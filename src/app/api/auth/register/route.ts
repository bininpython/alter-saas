import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name, whatsapp } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        whatsapp,
      },
    });

    return NextResponse.json({ user: { id: user.id, name, email } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
