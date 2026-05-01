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
    const { goal, level } = body;

    // --- Lógica de Cache (Sugestão de Evolução) ---
    // Busca o treino mais recente gerado nas últimas 24 horas para evitar gastos desnecessários
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        userId: userId,
        createdAt: { gte: oneDayAgo }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (existingWorkout) {
      console.log("Retornando treino do cache (menos de 24h)");
      return NextResponse.json({ 
        plan: existingWorkout.data, 
        cached: true,
        message: "Plano recente recuperado com sucesso." 
      });
    }

    // Atualiza o perfil do usuário com os dados atuais
    await prisma.user.update({
      where: { id: userId },
      data: {
        goal,
        level,
        onboardingCompleted: true,
      }
    });

    // --- Geração com Gemini 1.5 Flash (Sugestão de Evolução) ---
    // Mais rápido e barato que GPT-4o, mantendo alta qualidade para este caso de uso
    const plan = await generateFitnessPlan(body);
    
    // Salva o novo plano no banco de dados
    await prisma.workout.create({
      data: {
        userId: userId,
        data: plan,
      }
    });

    return NextResponse.json({ 
      plan, 
      cached: false,
      message: "Novo plano gerado com IA e salvo com sucesso." 
    });
  } catch (error) {
    console.error("Erro no onboarding API:", error);
    return NextResponse.json({ 
      error: "Falha ao processar plano",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    }, { status: 500 });
  }
}
