import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

function cleanEnvValue(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

type MailOptions = Parameters<ReturnType<typeof nodemailer.createTransport>["sendMail"]>[0];

const smtpHost = cleanEnvValue(process.env.SMTP_HOST) ?? "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpSecure = (process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";

const smtpOptions: Omit<SMTPTransport.Options, "host"> & { family: 4 } = {
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: !smtpSecure,
  family: 4,
  tls: {
    servername: smtpHost,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  auth: {
    user: cleanEnvValue(process.env.SMTP_EMAIL),
    pass: cleanEnvValue(process.env.SMTP_PASSWORD),
  },
};

async function resolveSmtpHost() {
  if (/^\d+\.\d+\.\d+\.\d+$/.test(smtpHost)) {
    return smtpHost;
  }

  const addresses = await dns.promises.resolve4(smtpHost);
  return addresses[0] ?? smtpHost;
}

const transporter = {
  async sendMail(mailOptions: MailOptions) {
    const host = await resolveSmtpHost();
    const transport = nodemailer.createTransport({
      ...smtpOptions,
      host,
    });

    return transport.sendMail(mailOptions);
  },
};

export default transporter;
