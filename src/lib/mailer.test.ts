import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("nodemailer", () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: vi.fn(async () => undefined),
      })),
    },
  };
});

import { getMailer, sendPasswordResetEmail } from "./mailer";

describe("mailer", () => {
  beforeEach(() => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.MAIL_FROM;
  });

  it("throws when smtp missing", () => {
    expect(() => getMailer()).toThrow();
  });

  it("sends reset email when configured", async () => {
    process.env.SMTP_HOST = "smtp.test";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "user";
    process.env.SMTP_PASS = "pass";
    process.env.MAIL_FROM = "Alter <no-reply@alter.com>";

    await expect(
      sendPasswordResetEmail({ to: "a@b.com", resetUrl: "https://x/reset" })
    ).resolves.toBeUndefined();
  });
});

