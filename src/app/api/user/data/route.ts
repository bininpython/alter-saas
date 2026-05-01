import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workouts: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        checkins: {
          orderBy: { createdAt: "desc" },
          take: 7,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        level: user.level,
        streak: user.streak,
        totalWorkouts: user.totalWorkouts,
        onboardingCompleted: user.onboardingCompleted,
      },
      lastWorkout: user.workouts[0]?.data || null,
      recentCheckins: user.checkins,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar dados do usuário" }, { status: 500 });
  }
}
