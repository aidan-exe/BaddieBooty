import { hasCompletedPayment, recordOrder } from "@/lib/order-log";
import {
  PayfastConfigError,
  confirmWithPayfast,
  getPayfastConfig,
  isPayfastSourceIp,
  itnRecord,
  parseUrlEncoded,
  readClientIp,
  safeEqual,
  signatureForFields,
} from "@/lib/payfast";
import { parsePayfastAmount } from "@/lib/pricing";
import { quoteFromSnapshot } from "@/lib/quote";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function reject(orderId: string, reason: string, detail?: unknown) {
  return recordOrder({
    orderId: orderId || "unknown",
    status: "rejected",
    reason,
    detail,
  });
}

export async function GET() {
  return new Response("PayFast notify endpoint", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  const raw = await request.text();
  const pairs = parseUrlEncoded(raw);
  if (pairs.length === 0) {
    return new Response("Empty notification", { status: 400 });
  }

  let config;
  try {
    config = getPayfastConfig();
  } catch (error) {
    const message = error instanceof PayfastConfigError ? error.message : "PayFast is not configured.";
    console.error("baddie-order", message);
    return new Response("PayFast is not configured", { status: 500 });
  }

  const signedPairs: Array<[string, string]> = [];
  for (const pair of pairs) {
    if (pair.key === "signature") break;
    signedPairs.push([pair.key, pair.value]);
  }
  const { paramString, signature } = signatureForFields(signedPairs, config.passphrase, false);
  const { record, signature: postedSignature } = itnRecord(pairs);
  const orderId = record.m_payment_id || "unknown";

  if (config.passphrase) {
    if (!postedSignature || !safeEqual(signature, postedSignature.toLowerCase())) {
      await reject(orderId, "signature");
      return new Response("Invalid signature", { status: 200 });
    }
  }

  if (record.merchant_id !== config.merchantId) {
    await reject(orderId, "merchant");
    return new Response("Merchant mismatch", { status: 200 });
  }

  const sourceIp = readClientIp(request.headers);
  if (!(await isPayfastSourceIp(sourceIp))) {
    await reject(orderId, "source", { sourceIp });
    return new Response("Untrusted source", { status: 200 });
  }

  const quoted = quoteFromSnapshot(
    [record.custom_str3, record.custom_str4, record.custom_str5].filter(Boolean),
    record.custom_str1 ?? "",
    record.custom_str2 ?? "",
  );
  if (!quoted.ok) {
    await reject(orderId, "amount", { quoteError: quoted.error });
    return new Response("Amount mismatch", { status: 200 });
  }
  const quote = quoted.quote;
  const grossCents = parsePayfastAmount(record.amount_gross ?? "");
  const signedCents = /^\d+$/.test(record.custom_int1 ?? "") ? Number(record.custom_int1) : null;
  if (
    grossCents === null ||
    signedCents === null ||
    grossCents !== quote.totalCents ||
    signedCents !== quote.totalCents
  ) {
    await reject(orderId, "amount", {
      grossCents,
      signedCents,
      expectedCents: quote.totalCents,
    });
    return new Response("Amount mismatch", { status: 200 });
  }

  const confirmation = await confirmWithPayfast(config.validateUrl, paramString);
  if (confirmation === "ERROR") {
    await recordOrder({
      orderId,
      status: "failed",
      reason: "confirm-unreachable",
      pfPaymentId: record.pf_payment_id,
      amountCents: quote.totalCents,
      paymentStatus: record.payment_status,
    });
    return new Response("Confirmation unavailable", { status: 503 });
  }
  if (confirmation !== "VALID") {
    await reject(orderId, "confirm-invalid", { pfPaymentId: record.pf_payment_id });
    return new Response("Confirmation invalid", { status: 200 });
  }

  const paymentStatus = record.payment_status || "";
  const pfPaymentId = record.pf_payment_id;
  if (paymentStatus === "COMPLETE" && pfPaymentId && (await hasCompletedPayment(pfPaymentId))) {
    return new Response("OK", { status: 200 });
  }

  const status =
    paymentStatus === "COMPLETE" ? "complete" : paymentStatus === "CANCELLED" ? "cancelled" : "failed";

  await recordOrder({
    orderId,
    status,
    pfPaymentId,
    amountCents: quote.totalCents,
    paymentStatus,
    sandbox: config.sandbox,
    shippingId: quote.shippingId,
    couponCode: quote.couponCode,
    lines: quote.lines.map((line) => ({
      slug: line.slug,
      name: line.name,
      size: line.size,
      qty: line.qty,
      lineCents: line.lineCents,
    })),
    totals: {
      subtotalCents: quote.subtotalCents,
      discountCents: quote.discountCents,
      shippingCents: quote.shippingCents,
      totalCents: quote.totalCents,
    },
  });

  return new Response("OK", { status: 200 });
}
