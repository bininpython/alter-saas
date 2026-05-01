import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!me || me.role !== "admin") {
      return NextResponse.json({ error: "Proibido" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        onboardingCompleted: true,
        createdAt: true,
      },
      take: 200,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Erro admin/users:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

