import { getProduct, products, type Product } from "@/lib/products";
import {
  assertPayableTotal,
  decodeCartSnapshot,
  discountCents,
  encodeCartSnapshot,
  findCoupon,
  mergeQty,
  shippingById,
  type ShippingId,
} from "./pricing";

const MAX_QTY = 20;
const MAX_LINES = 30;

export type QuoteLine = {
  slug: string;
  productId: number;
  name: string;
  image: string;
  size: string;
  qty: number;
  unitCents: number;
  lineCents: number;
};

export type Quote = {
  lines: QuoteLine[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  shippingId: ShippingId;
  shippingLabel: string;
  couponCode: string | null;
  couponLabel: string | null;
};

export type CartRequestLine = {
  slug: string;
  size: string;
  qty: number;
};

function centsFromRands(rands: number) {
  return Math.round(rands * 100);
}

function finishQuote(
  lines: QuoteLine[],
  shippingId: string,
  couponCode: string,
  requireStock: boolean,
): { ok: true; quote: Quote } | { ok: false; error: string } {
  if (lines.length === 0) return { ok: false, error: "Your bag is empty." };
  if (lines.length > MAX_LINES) {
    return { ok: false, error: "This order has too many lines for one payment." };
  }
  for (const line of lines) {
    if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > MAX_QTY) {
      return { ok: false, error: `Use a quantity from 1 to ${MAX_QTY} for ${line.name}.` };
    }
  }

  const shipping = shippingById(shippingId);
  if (!shipping) return { ok: false, error: "Choose a shipping method." };

  const trimmedCoupon = couponCode.trim();
  const coupon = trimmedCoupon ? findCoupon(trimmedCoupon) : null;
  if (trimmedCoupon && !coupon) return { ok: false, error: "That is not a valid code." };

  if (requireStock) {
    for (const line of lines) {
      const product = getProduct(line.slug);
      const variant = product?.variants.find((item) => item.label === line.size);
      if (!variant?.purchasable || !variant.inStock) {
        return { ok: false, error: `${line.name} (${line.size}) is unavailable.` };
      }
    }
  }

  const subtotalCents = lines.reduce((sum, line) => sum + line.lineCents, 0);
  const discount = discountCents(subtotalCents, coupon);
  const totalCents = subtotalCents - discount + shipping.cents;
  const payableError = assertPayableTotal(totalCents);
  if (payableError) return { ok: false, error: payableError };

  let snapshotError: string | null = null;
  try {
    encodeCartSnapshot(
      lines.map((line) => ({ productId: line.productId, qty: line.qty, label: line.size })),
    );
  } catch (error) {
    snapshotError = error instanceof Error ? error.message : "This order cannot be sent to PayFast.";
  }
  if (snapshotError) return { ok: false, error: snapshotError };

  return {
    ok: true,
    quote: {
      lines,
      subtotalCents,
      discountCents: discount,
      shippingCents: shipping.cents,
      totalCents,
      shippingId: shipping.id,
      shippingLabel: shipping.label,
      couponCode: coupon?.code ?? null,
      couponLabel: coupon?.label ?? null,
    },
  };
}

function lineFromProduct(product: Product, size: string, qty: number): QuoteLine | string {
  const variant = product.variants.find((item) => item.label === size);
  if (!variant) return `${product.name} does not have the option ${size}.`;
  const unitCents = centsFromRands(variant.price);
  return {
    slug: product.slug,
    productId: product.id,
    name: product.name,
    image: product.image,
    size,
    qty,
    unitCents,
    lineCents: unitCents * qty,
  };
}

export function parseCartLines(input: unknown): CartRequestLine[] | null {
  if (!Array.isArray(input)) return null;
  const lines: CartRequestLine[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const source = item as Record<string, unknown>;
    if (typeof source.slug !== "string" || typeof source.size !== "string") return null;
    if (typeof source.qty !== "number" || !Number.isInteger(source.qty)) return null;
    lines.push({ slug: source.slug, size: source.size, qty: source.qty });
  }
  return lines;
}

export function quoteFromCart(lines: CartRequestLine[], shippingId: string, couponCode: string) {
  const priced: QuoteLine[] = [];
  const merged = mergeQty(lines, (left, right) => left.slug === right.slug && left.size === right.size);
  for (const line of merged) {
    const product = getProduct(line.slug);
    if (!product) return { ok: false as const, error: "A piece in your bag is no longer in the shop." };
    const pricedLine = lineFromProduct(product, line.size, line.qty);
    if (typeof pricedLine === "string") return { ok: false as const, error: pricedLine };
    priced.push(pricedLine);
  }
  return finishQuote(priced, shippingId, couponCode, true);
}

export function quoteFromSnapshot(chunks: string[], shippingId: string, couponCode: string) {
  let decoded;
  try {
    decoded = mergeQty(decodeCartSnapshot(chunks), (left, right) => {
      return left.productId === right.productId && left.label === right.label;
    });
  } catch {
    return { ok: false as const, error: "The payment did not include a readable order." };
  }
  const priced: QuoteLine[] = [];
  for (const line of decoded) {
    const product = products.find((item) => item.id === line.productId);
    if (!product) return { ok: false as const, error: "The payment refers to a product that is not in the catalogue." };
    const pricedLine = lineFromProduct(product, line.label, line.qty);
    if (typeof pricedLine === "string") return { ok: false as const, error: pricedLine };
    priced.push(pricedLine);
  }
  return finishQuote(priced, shippingId, couponCode, false);
}

export function snapshotChunks(quote: Quote) {
  return encodeCartSnapshot(
    quote.lines.map((line) => ({ productId: line.productId, qty: line.qty, label: line.size })),
  );
}
