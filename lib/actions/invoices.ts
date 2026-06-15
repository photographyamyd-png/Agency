"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { InvoiceStatus, InvoiceType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { createStripePaymentLink as createCheckout } from "@/lib/stripe/invoices";
import { isStripeConfigured } from "@/lib/stripe/client";
import { sendTemplatedEmail } from "@/lib/email/gmail";

export async function getInvoices() {
  await requireAdmin();
  return prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { id: true, legalBusinessName: true } },
      _count: { select: { payments: true } },
    },
  });
}

export async function getInvoice(id: string) {
  await requireAdmin();
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      lineItems: true,
      payments: { orderBy: { paidAt: "desc" } },
    },
  });
}

export async function createInvoice(formData: FormData) {
  await requireAdmin();

  const clientId = String(formData.get("clientId") ?? "");
  const type = String(formData.get("type") ?? "ONE_OFF") as InvoiceType;
  const description = String(formData.get("description") ?? "Service");
  const amount = parseFloat(String(formData.get("amount") ?? "0"));
  const dueDateStr = String(formData.get("dueDate") ?? "");

  if (!clientId || !amount) return;

  const invoice = await prisma.invoice.create({
    data: {
      clientId,
      type,
      status: "DRAFT",
      totalAmount: amount,
      dueDate: dueDateStr ? new Date(dueDateStr) : undefined,
      lineItems: {
        create: {
          description,
          quantity: 1,
          unitPrice: amount,
          total: amount,
        },
      },
    },
  });

  revalidatePath("/invoices");
  redirect(`/invoices/${invoice.id}`);
}

export async function sendInvoiceViaStripe(invoiceId: string) {
  await requireAdmin();

  if (!isStripeConfigured()) {
    return { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to env." };
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { client: true },
  });
  if (!invoice) return { error: "Invoice not found" };

  const url = await createCheckout(invoiceId);
  if (!url) return { error: "Failed to create payment link" };

  const email = invoice.client.billingEmail;
  if (email) {
    await sendTemplatedEmail({
      to: email,
      subject: "Invoice from your agency — {{businessName}}",
      bodyTemplate:
        "Hi,\n\nPlease pay your invoice for {{businessName}} using the secure link below:\n\n{{paymentUrl}}\n\nAmount due: {{amount}}\n\nThank you!",
      vars: {
        businessName: invoice.client.legalBusinessName,
        paymentUrl: url,
        amount: `$${Number(invoice.totalAmount).toFixed(2)} ${invoice.currency}`,
      },
      clientId: invoice.clientId,
    });
  }

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
  return { url };
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
) {
  await requireAdmin();
  await prisma.invoice.update({ where: { id: invoiceId }, data: { status } });
  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath("/invoices");
}

export async function getClientsForInvoiceSelect() {
  await requireAdmin();
  return prisma.client.findMany({
    orderBy: { legalBusinessName: "asc" },
    select: { id: true, legalBusinessName: true },
  });
}
