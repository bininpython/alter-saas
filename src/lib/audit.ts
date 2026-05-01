import prisma from "@/lib/prisma";

export async function auditLog(params: {
  action: string;
  userId?: string | null;
  ip?: string;
  userAgent?: string;
  metadata?: any;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        userId: params.userId ?? null,
        ip: params.ip,
        userAgent: params.userAgent,
        metadata: params.metadata,
      },
    });
  } catch {}
}

