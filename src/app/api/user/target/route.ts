import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateFitnessPlan } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    const body = await req.json();
    const { targetBodyPart } = body;

    if (!targetBodyPart) {
      return NextResponse.json({ error: "Foco não informado" }, { status: 400 });
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: { targetBodyPart }
    });

    // Generate new plan with the new focus
    const plan = await generateFitnessPlan({
      name: user.name || session.user.name || "Atleta",
      gender: user.gender,
      goal: user.goal,
      level: user.level,
      frequency: 3, // Default or fetch from user if stored
      targetBodyPart: targetBodyPart,
    });
    
    // Save new plan
    await prisma.workout.create({
      data: {
        userId: userId,
        data: plan,
      }
    });

    return NextResponse.json({ 
      success: true,
      message: "Foco atualizado e novo plano gerado com sucesso." 
    });
  } catch (error) {
    console.error("Erro ao atualizar foco:", error);
    return NextResponse.json({ error: "Falha ao atualizar foco e plano" }, { status: 500 });
  }
}
