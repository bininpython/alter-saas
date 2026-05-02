import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { chatWithPersonal } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        gender: true,
        goal: true,
        level: true,
        streak: true,
        totalWorkouts: true,
      },
    });

    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Mensagem não fornecida" }, { status: 400 });
    }

    // Buscar último check-in para peso
    const lastCheckin = await prisma.checkin.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const response = await chatWithPersonal(
      message,
      {
        name: user?.name || undefined,
        gender: user?.gender || undefined,
        goal: user?.goal || undefined,
        level: user?.level || undefined,
        weight: lastCheckin?.weight || undefined,
        streak: user?.streak || 0,
        totalWorkouts: user?.totalWorkouts || 0,
      },
      history || []
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Erro ao processar mensagem" }, { status: 500 });
  }
}
