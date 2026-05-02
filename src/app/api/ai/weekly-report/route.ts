import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateWeeklyReport } from "@/lib/ai";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        goal: true,
        level: true,
        streak: true,
        totalWorkouts: true,
      },
    });

    // Buscar treinos desta semana
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyWorkouts = await prisma.workout.count({
      where: {
        userId,
        createdAt: { gte: oneWeekAgo },
      },
    });

    // Buscar check-ins recentes
    const recentCheckins = await prisma.checkin.findMany({
      where: {
        userId,
        createdAt: { gte: oneWeekAgo },
      },
      orderBy: { createdAt: "desc" },
      take: 7,
    });

    const lastWeight = recentCheckins[0]?.weight || undefined;

    const report = await generateWeeklyReport({
      name: user?.name || undefined,
      goal: user?.goal || undefined,
      level: user?.level || undefined,
      weight: lastWeight,
      streak: user?.streak || 0,
      totalWorkouts: user?.totalWorkouts || 0,
      weeklyWorkouts,
      checkins: recentCheckins.map((c) => ({
        weight: c.weight,
        date: c.createdAt,
      })),
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Weekly Report Error:", error);
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 });
  }
}
