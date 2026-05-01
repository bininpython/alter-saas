import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { getRequestMeta } from "@/lib/request";
import { auditLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    const { email, password, name, whatsapp } = parsed.data;

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
        whatsapp: whatsapp || null,
      },
    });

    const meta = await getRequestMeta();
    await auditLog({
      action: "auth.register",
      userId: user.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    return NextResponse.json({ user: { id: user.id, name, email } });
  } catch (error: any) {
    console.error("Erro no registro:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
