import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { renderTemplate } from "./templates";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  clientId?: string;
  leadId?: string;
  summary?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const transporter = getTransporter();
  const fromName = process.env.GMAIL_FROM_NAME ?? "Agency OS";
  const from = process.env.GMAIL_USER;

  if (!transporter || !from) {
    console.warn("[email] Gmail not configured — skipping send to", input.to);
    await prisma.communicationLog.create({
      data: {
        clientId: input.clientId,
        leadId: input.leadId,
        channel: "EMAIL",
        summary: input.summary ?? `[DRY RUN] ${input.subject}`,
      },
    }).catch(() => undefined);
    return { ok: false, error: "Gmail not configured" };
  }

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${from}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    await prisma.communicationLog.create({
      data: {
        clientId: input.clientId,
        leadId: input.leadId,
        channel: "EMAIL",
        summary: input.summary ?? input.subject,
      },
    });

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    return { ok: false, error: message };
  }
}

export async function sendTemplatedEmail(input: {
  to: string;
  subject: string;
  bodyTemplate: string;
  vars: Record<string, string>;
  clientId?: string;
  leadId?: string;
}) {
  const subject = renderTemplate(input.subject, input.vars);
  const html = renderTemplate(input.bodyTemplate, input.vars).replace(
    /\n/g,
    "<br/>"
  );
  return sendEmail({
    to: input.to,
    subject,
    html: `<div style="font-family:Inter,sans-serif;line-height:1.6;color:#111">${html}</div>`,
    clientId: input.clientId,
    leadId: input.leadId,
    summary: subject,
  });
}
