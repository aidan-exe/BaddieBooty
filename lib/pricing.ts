export const shippingMethods = [
  {
    id: "flat_rate",
    label: "Flat rate",
    cents: 18_000,
    eta: "Dispatched from Durban. Central areas 2–3 working days, outlying areas 3–5.",
  },
  {
    id: "overnight",
    label: "Overnight Shipping",
    cents: 28_000,
    eta: "Next working day to main centres after same-day collection. Outlying areas can take longer.",
  },
] as const;

export type ShippingId = (typeof shippingMethods)[number]["id"];

export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  /** Percent points, or whole rands for a fixed discount. */
  amount: number;
  label: string;
};

/**
 * Studio coupon codes. Empty until a real WooCommerce code is added here.
 * `code` matches ignoring case. `amount` is percent points, or whole rands when type is "fixed".
 * Discounts apply to merchandise only.
 */
export const coupons: Coupon[] = [];

const MIN_PAYFAST_CENTS = 500;
const SNAPSHOT_CHUNK = 255;

export function mergeQty<T extends { qty: number }>(
  lines: T[],
  same: (left: T, right: T) => boolean,
): T[] {
  const merged: T[] = [];
  for (const line of lines) {
    const existing = merged.find((item) => same(item, line));
    if (!existing) {
      merged.push({ ...line });
      continue;
    }
    existing.qty += line.qty;
  }
  return merged;
}

export function findCoupon(code: string): Coupon | null {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  return coupons.find((coupon) => coupon.code === normalized) ?? null;
}

export function shippingById(id: string) {
  return shippingMethods.find((method) => method.id === id) ?? null;
}

export function discountCents(subtotalCents: number, coupon: Coupon | null) {
  if (!coupon || subtotalCents <= 0) return 0;
  if (coupon.type === "percent") {
    return Math.min(subtotalCents, Math.round((subtotalCents * coupon.amount) / 100));
  }
  return Math.min(subtotalCents, Math.round(coupon.amount * 100));
}

export function assertPayableTotal(totalCents: number) {
  if (totalCents < MIN_PAYFAST_CENTS) {
    return `PayFast needs an order of at least R5.00.`;
  }
  return null;
}

export type SnapshotLine = {
  productId: number;
  qty: number;
  label: string;
};

export function encodeCartSnapshot(lines: SnapshotLine[]) {
  const tokens = lines.map((line) => {
    if (!Number.isInteger(line.productId) || line.productId <= 0) {
      throw new Error("Bad product id");
    }
    if (!Number.isInteger(line.qty) || line.qty <= 0) {
      throw new Error("Bad quantity");
    }
    if (line.label.includes("*") || line.label.includes(";")) {
      throw new Error("This option cannot be sent to PayFast");
    }
    const token = `${line.productId}*${line.qty}*${line.label}`;
    if (token.length > SNAPSHOT_CHUNK) {
      throw new Error("One of the pieces cannot be sent to PayFast");
    }
    return token;
  });

  const chunks: string[] = [];
  let current = "";
  for (const token of tokens) {
    const next = current ? `${current};${token}` : token;
    if (next.length <= SNAPSHOT_CHUNK) {
      current = next;
      continue;
    }
    if (!current) throw new Error("One of the pieces cannot be sent to PayFast");
    chunks.push(current);
    current = token;
  }
  if (current) chunks.push(current);
  if (chunks.length > 3) {
    throw new Error("This order has too many pieces for one PayFast payment");
  }
  return chunks;
}

export function decodeCartSnapshot(chunks: string[]): SnapshotLine[] {
  const joined = chunks.filter(Boolean).join(";");
  if (!joined) return [];
  return joined.split(";").map((token) => {
    const first = token.indexOf("*");
    const second = token.indexOf("*", first + 1);
    if (first <= 0 || second <= first + 1 || second === token.length - 1) {
      throw new Error("Bad cart snapshot");
    }
    const productId = Number(token.slice(0, first));
    const qty = Number(token.slice(first + 1, second));
    const label = token.slice(second + 1);
    if (!Number.isInteger(productId) || productId <= 0 || !Number.isInteger(qty) || qty <= 0) {
      throw new Error("Bad cart snapshot");
    }
    if (!label) throw new Error("Bad cart snapshot");
    return { productId, qty, label };
  });
}

export function formatPayfastAmount(cents: number) {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error("Invalid amount");
  }
  const whole = Math.floor(cents / 100);
  const rem = cents % 100;
  return `${whole}.${String(rem).padStart(2, "0")}`;
}

export function parsePayfastAmount(value: string) {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents)) return null;
  return cents;
}
