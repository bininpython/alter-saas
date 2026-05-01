import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  password: z.string().min(8).max(200),
  whatsapp: z.string().max(30).optional().or(z.literal("")),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(120),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(200),
});

