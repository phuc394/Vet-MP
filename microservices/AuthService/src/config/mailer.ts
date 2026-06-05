import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

function cleanEnvValue(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpSecure = (process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";

const smtpOptions: SMTPTransport.Options & { family: 4 } = {
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: !smtpSecure,
  family: 4,
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  auth: {
    user: cleanEnvValue(process.env.SMTP_EMAIL),
    pass: cleanEnvValue(process.env.SMTP_PASSWORD),
  },
};

const transporter = nodemailer.createTransport(smtpOptions);

export default transporter;
