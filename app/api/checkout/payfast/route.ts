import { validateCustomer } from "@/lib/checkout-details";
import { recordOrder } from "@/lib/order-log";
import {
  PayfastConfigError,
  buildPaymentFields,
  createOrderId,
  getPayfastConfig,
  publicOrigin,
} from "@/lib/payfast";
import { parseCartLines, quoteFromCart, snapshotChunks } from "@/lib/quote";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "We couldn't read that checkout." }, { status: 400 });
  }

  const source = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const customer = validateCustomer(source);
  const lines = parseCartLines(source.lines);
  const shippingId = typeof source.shippingId === "string" ? source.shippingId : "";
  const couponCode = typeof source.couponCode === "string" ? source.couponCode : "";

  if (!lines) {
    return Response.json({ error: "The bag couldn't be read." }, { status: 400 });
  }

  const quoted = quoteFromCart(lines, shippingId, couponCode);
  if (!customer.ok || !quoted.ok) {
    return Response.json(
      {
        error: !quoted.ok ? quoted.error : "Check the highlighted fields.",
        fieldErrors: customer.ok ? {} : customer.errors,
      },
      { status: 400 },
    );
  }

  let config;
  let origin: string;
  try {
    config = getPayfastConfig();
    origin = publicOrigin(request);
  } catch (error) {
    const message = error instanceof PayfastConfigError ? error.message : "PayFast is not configured.";
    console.error("baddie-order", message);
    return Response.json({ error: "PayFast is not configured." }, { status: 500 });
  }

  const orderId = createOrderId();
  const quote = quoted.quote;
  const description = quote.lines
    .map((line) => `${line.name} (${line.size}) x${line.qty}`)
    .join(", ");
  const fields = buildPaymentFields({
    config,
    origin,
    orderId,
    amountCents: quote.totalCents,
    firstName: customer.value.billing.firstName,
    lastName: customer.value.billing.lastName,
    email: customer.value.billing.email,
    phone: customer.value.billing.phone,
    itemDescription: description,
    shippingId: quote.shippingId,
    couponCode: quote.couponCode,
    snapshot: snapshotChunks(quote),
    confirmationEmail: site.email,
  });

  await recordOrder({
    orderId,
    status: "pending",
    sandbox: config.sandbox,
    amountCents: quote.totalCents,
    shippingId: quote.shippingId,
    couponCode: quote.couponCode,
    notes: customer.value.notes,
    customer: {
      billing: customer.value.billing,
      shipping: customer.value.shipping,
      shipToDifferent: customer.value.shipToDifferent,
    },
    lines: quote.lines.map((line) => ({
      slug: line.slug,
      productId: line.productId,
      name: line.name,
      size: line.size,
      qty: line.qty,
      unitCents: line.unitCents,
      lineCents: line.lineCents,
    })),
    totals: {
      subtotalCents: quote.subtotalCents,
      discountCents: quote.discountCents,
      shippingCents: quote.shippingCents,
      totalCents: quote.totalCents,
    },
  });

  return Response.json({
    orderId,
    processUrl: config.processUrl,
    sandbox: config.sandbox,
    fields,
    totals: {
      subtotalCents: quote.subtotalCents,
      discountCents: quote.discountCents,
      shippingCents: quote.shippingCents,
      totalCents: quote.totalCents,
    },
  });
}
