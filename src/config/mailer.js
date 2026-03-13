import nodemailer from "nodemailer";
import { env } from "./env.js";

let cachedTransporter = null;

export const getTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  // Si no hay SMTP configurado, usa Ethereal (ideal para correcciones / pruebas)
  if (!env.mail.host || !env.mail.user || !env.mail.pass) {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port || 587,
    secure: false,
    auth: {
      user: env.mail.user,
      pass: env.mail.pass,
    },
  });

  return cachedTransporter;
};

export const sendMail = async ({ to, subject, html, text }) => {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: env.mail.from,
    to,
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  return { info, previewUrl };
};

