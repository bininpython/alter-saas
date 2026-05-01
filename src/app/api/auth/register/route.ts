import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

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
    
    console.log("Tentando criar usuário no banco...");
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        whatsapp,
      },
    });

    console.log("Usuário criado com sucesso:", user.id);

    return NextResponse.json({ user: { id: user.id, name, email } });
  } catch (error: any) {
    console.error("Erro no registro:", error);
    return NextResponse.json({ 
      error: "Erro interno do servidor", 
      details: error.message 
    }, { status: 500 });
  }
}
