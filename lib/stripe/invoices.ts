import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "./client";

export async function ensureStripeCustomer(clientId: string) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw new Error("Client not found");

  if (client.stripeCustomerId) {
    return client.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    name: client.legalBusinessName,
    email: client.billingEmail ?? undefined,
    metadata: { clientId },
  });

  await prisma.client.update({
    where: { id: clientId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function createStripePaymentLink(invoiceId: string) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { lineItems: true, client: true },
  });
  if (!invoice) throw new Error("Invoice not found");

  const customerId = await ensureStripeCustomer(invoice.clientId);
  const amountDue = Number(invoice.totalAmount) - Number(invoice.amountPaid);

  if (amountDue <= 0) throw new Error("Invoice is already paid");

  const lineItems =
    invoice.lineItems.length > 0
      ? invoice.lineItems.map((item) => ({
          price_data: {
            currency: invoice.currency.toLowerCase(),
            unit_amount: Math.round(Number(item.unitPrice) * 100),
            product_data: { name: item.description },
          },
          quantity: item.quantity,
        }))
      : [
          {
            price_data: {
              currency: invoice.currency.toLowerCase(),
              unit_amount: Math.round(amountDue * 100),
              product_data: {
                name: `Invoice ${invoice.type} — ${invoice.client.legalBusinessName}`,
              },
            },
            quantity: 1,
          },
        ];

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: lineItems,
    success_url: `${process.env.NEXTAUTH_URL}/invoices/${invoiceId}?paid=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/invoices/${invoiceId}`,
    metadata: { invoiceId, clientId: invoice.clientId },
  });

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      stripeCheckoutSessionId: session.id,
      status: invoice.status === "DRAFT" ? "SENT" : invoice.status,
    },
  });

  return session.url;
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const invoiceId = session.metadata?.invoiceId;
  if (!invoiceId) return;

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return;

  const amount = (session.amount_total ?? 0) / 100;

  await prisma.payment.create({
    data: {
      invoiceId,
      amount,
      method: "stripe_card",
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
    },
  });

  const newPaid = Number(invoice.amountPaid) + amount;
  const total = Number(invoice.totalAmount);

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      amountPaid: newPaid,
      status: newPaid >= total ? "PAID" : "PARTIALLY_PAID",
    },
  });
}
