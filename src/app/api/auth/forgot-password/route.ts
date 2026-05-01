import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { getRequestMeta } from "@/lib/request";
import { auditLog } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = forgotPasswordSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.verificationToken.create({
      data: {
        identifier: `password_reset:${email}`,
        token,
        expires,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
      throw new Error("NEXTAUTH_URL não configurado");
    }

    const resetUrl = `${baseUrl}/reset-password/${token}`;
    await sendPasswordResetEmail({ to: email, resetUrl });

    const meta = await getRequestMeta();
    await auditLog({
      action: "auth.forgot_password",
      userId: user.id,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro forgot-password:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

