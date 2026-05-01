import nodemailer from "nodemailer";

export function getMailer() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP não configurado");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendPasswordResetEmail(params: {
  to: string;
  resetUrl: string;
}) {
  const from = process.env.MAIL_FROM;
  if (!from) throw new Error("MAIL_FROM não configurado");

  const transporter = getMailer();
  await transporter.sendMail({
    from,
    to: params.to,
    subject: "Alter - Recuperação de senha",
    text: `Para redefinir sua senha, abra este link: ${params.resetUrl}`,
  });
}

