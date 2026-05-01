import { describe, it, expect } from "vitest";
import { registerSchema, forgotPasswordSchema, resetPasswordSchema } from "./validation";

describe("validation schemas", () => {
  it("accepts valid register payload", () => {
    const res = registerSchema.safeParse({
      name: "Abner Lucas",
      email: "abner@example.com",
      password: "12345678",
      whatsapp: "(11) 99999-9999",
    });
    expect(res.success).toBe(true);
  });

  it("rejects invalid email on register", () => {
    const res = registerSchema.safeParse({
      name: "Abner Lucas",
      email: "not-an-email",
      password: "12345678",
    });
    expect(res.success).toBe(false);
  });

  it("accepts forgot-password payload", () => {
    const res = forgotPasswordSchema.safeParse({ email: "a@b.com" });
    expect(res.success).toBe(true);
  });

  it("rejects reset-password with short token", () => {
    const res = resetPasswordSchema.safeParse({ token: "abc", password: "12345678" });
    expect(res.success).toBe(false);
  });
});

