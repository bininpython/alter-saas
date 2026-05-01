import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => {
  return {
    default: {
      auditLog: {
        create: vi.fn(async () => undefined),
      },
    },
  };
});

import prisma from "@/lib/prisma";
import { auditLog } from "./audit";

describe("auditLog", () => {
  it("writes audit log entry", async () => {
    await auditLog({ action: "x", userId: "u1", ip: "1.1.1.1", userAgent: "ua" });
    expect((prisma as any).auditLog.create).toHaveBeenCalled();
  });
});

