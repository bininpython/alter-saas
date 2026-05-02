import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { weight, measurements } = await req.json();

    if (!weight || weight < 20 || weight > 300) {
      return NextResponse.json({ error: "Peso inválido" }, { status: 400 });
    }

    const checkin = await prisma.checkin.create({
      data: {
        userId,
        weight: parseFloat(weight),
        measurements: measurements || null,
      },
    });

    return NextResponse.json({ checkin, message: "Check-in registrado!" });
  } catch (error) {
    console.error("Checkin Error:", error);
    return NextResponse.json({ error: "Erro ao registrar check-in" }, { status: 500 });
  }
}
