import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

function cleanEnvValue(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

type AddressValue = string | { name?: string; address: string } | Array<string | { name?: string; address: string }>;

type MailOptions = SMTPTransport.MailOptions & {
  templateParams?: Record<string, string | undefined>;
};

const smtpHost = cleanEnvValue(process.env.SMTP_HOST) ?? "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpSecure = (process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
const emailJsServiceId = cleanEnvValue(process.env.EMAILJS_SERVICE_ID);
const emailJsTemplateId = cleanEnvValue(process.env.EMAILJS_TEMPLATE_ID);
const emailJsPublicKey = cleanEnvValue(process.env.EMAILJS_PUBLIC_KEY);
const emailJsPrivateKey = cleanEnvValue(process.env.EMAILJS_PRIVATE_KEY);
const useEmailJs =
  process.env.NODE_ENV === "production" &&
  Boolean(emailJsServiceId && emailJsTemplateId && emailJsPublicKey);

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
    if (useEmailJs) {
      return sendWithEmailJs(mailOptions);
    }

    const host = await resolveSmtpHost();
    const transport = nodemailer.createTransport({
      ...smtpOptions,
      host,
    });

    return transport.sendMail(mailOptions);
  },
};

function normalizeAddress(value: AddressValue | undefined): string | string[] | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeAddress(item)).filter(Boolean) as string[];
  }

  return value.name ? `${value.name} <${value.address}>` : value.address;
}

async function sendWithEmailJs(mailOptions: MailOptions) {
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: emailJsServiceId,
      template_id: emailJsTemplateId,
      user_id: emailJsPublicKey,
      accessToken: emailJsPrivateKey,
      template_params: {
        to_email: normalizeAddress(mailOptions.to as AddressValue | undefined),
        subject: String(mailOptions.subject ?? ""),
        message_html: String(mailOptions.html ?? ""),
        message_text: String(mailOptions.text ?? ""),
        ...mailOptions.templateParams,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`EmailJS send failed: ${response.status} ${errorBody}`);
  }

  return {
    status: response.status,
    text: await response.text(),
  };
}

export default transporter;
