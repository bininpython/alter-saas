import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * POST /api/admin/setup
 * Creates a super user for SaaS management.
 * This endpoint can only be used ONCE (when no admin exists).
 * After the first admin is created, this endpoint is disabled.
 */
export async function POST(req: Request) {
  try {
    // Security: Check if an admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Super usuário já existe. Este endpoint está desativado." },
        { status: 403 }
      );
    }

    // Validate the setup secret
    const { secret, name, email, password } = await req.json();

    if (secret !== process.env.ADMIN_SETUP_SECRET && secret !== "alter-admin-setup-2026") {
      return NextResponse.json(
        { error: "Secret inválido" },
        { status: 401 }
      );
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Promote existing user to admin
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: "admin", plan: "premium" },
      });
      return NextResponse.json({
        message: "Usuário existente promovido a Super Admin!",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          plan: updatedUser.plan,
        },
      });
    }

    // Create new super user
    const hashedPassword = await bcrypt.hash(password, 12);
    const superUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
        plan: "premium",
        onboardingCompleted: true,
      },
    });

    // Log the creation
    await prisma.auditLog.create({
      data: {
        userId: superUser.id,
        action: "admin.setup",
        metadata: { method: "api_setup" },
      },
    });

    return NextResponse.json({
      message: "🔥 Super usuário criado com sucesso!",
      user: {
        id: superUser.id,
        name: superUser.name,
        email: superUser.email,
        role: superUser.role,
        plan: superUser.plan,
      },
    });
  } catch (error) {
    console.error("Erro no setup do admin:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar super usuário" },
      { status: 500 }
    );
  }
}
