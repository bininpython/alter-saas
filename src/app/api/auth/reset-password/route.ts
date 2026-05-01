import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation";
import { getRequestMeta } from "@/lib/request";
import { auditLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = resetPasswordSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { token, password } = parsed.data;

    const vt = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!vt || vt.expires < new Date() || !vt.identifier.startsWith("password_reset:")) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 });
    }

    const email = vt.identifier.replace("password_reset:", "");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.verificationToken.delete({ where: { token } });

    const meta = await getRequestMeta();
    await auditLog({
      action: "auth.reset_password",
      userId: user.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro reset-password:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

