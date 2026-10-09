import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { resolve4 } from "node:dns/promises";

function formatPayfastAmount(cents: number) {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error("Invalid amount");
  }
  const whole = Math.floor(cents / 100);
  const rem = cents % 100;
  return `${whole}.${String(rem).padStart(2, "0")}`;
}

export const SANDBOX_MERCHANT_ID = "10000100";
export const SANDBOX_MERCHANT_KEY = "46f0cd694581a";

const MIN_SNAPSHOT_SECRET_LENGTH = 16;

const PAYFAST_HOSTS = [
  "www.payfast.co.za",
  "sandbox.payfast.co.za",
  "w1w.payfast.co.za",
  "w2w.payfast.co.za",
];

const PAYFAST_RANGES: Array<[string, number]> = [
  ["197.97.145.144", 28],
  ["41.74.179.192", 27],
  ["102.216.36.0", 28],
  ["102.216.36.128", 28],
  ["144.126.193.139", 32],
];

const PAYMENT_FIELDS = [
  "merchant_id",
  "merchant_key",
  "return_url",
  "cancel_url",
  "notify_url",
  "name_first",
  "name_last",
  "email_address",
  "cell_number",
  "m_payment_id",
  "amount",
  "item_name",
  "item_description",
  "custom_int1",
  "custom_str1",
  "custom_str2",
  "custom_str3",
  "custom_str4",
  "custom_str5",
  "email_confirmation",
  "confirmation_address",
] as const;

export type PayfastFieldName = (typeof PAYMENT_FIELDS)[number] | "signature";

export type PayfastField = {
  name: PayfastFieldName;
  value: string;
};

export class PayfastConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PayfastConfigError";
  }
}

export type PayfastConfig = {
  sandbox: boolean;
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  snapshotSecret: string;
  processUrl: string;
  validateUrl: string;
};

export function isPayfastSandbox() {
  const raw = process.env.PAYFAST_SANDBOX;
  if (process.env.VERCEL_ENV === "production") {
    const value = raw?.trim().toLowerCase();
    if (value !== "true" && value !== "false") {
      throw new PayfastConfigError("PAYFAST_SANDBOX must be set to true or false in production.");
    }
    return value === "true";
  }
  return (raw ?? "true").trim().toLowerCase() !== "false";
}

export function getPayfastConfig(): PayfastConfig {
  const sandbox = isPayfastSandbox();
  const configuredId = process.env.PAYFAST_MERCHANT_ID?.trim() ?? "";
  const configuredKey = process.env.PAYFAST_MERCHANT_KEY?.trim() ?? "";
  // Empty only for the shared sandbox merchant 10000100, which rejects signed
  // forms. A merchant's own sandbox account uses the passphrase on that account.
  const passphrase = process.env.PAYFAST_PASSPHRASE?.trim() ?? "";
  const snapshotSecret = process.env.PAYFAST_SNAPSHOT_SECRET?.trim() ?? "";

  if (snapshotSecret.length < MIN_SNAPSHOT_SECRET_LENGTH) {
    throw new PayfastConfigError("PAYFAST_SNAPSHOT_SECRET is not set.");
  }

  let merchantId = configuredId;
  let merchantKey = configuredKey;
  if (sandbox) {
    merchantId = merchantId || SANDBOX_MERCHANT_ID;
    merchantKey = merchantKey || SANDBOX_MERCHANT_KEY;
  } else {
    if (!merchantId || !merchantKey || !passphrase) {
      throw new PayfastConfigError("Live PayFast needs a merchant id, key, and passphrase.");
    }
    if (merchantId === SANDBOX_MERCHANT_ID) {
      throw new PayfastConfigError("Live PayFast cannot use the public sandbox merchant id.");
    }
  }

  if (!merchantId || !merchantKey) {
    throw new PayfastConfigError("PayFast merchant credentials are not configured.");
  }

  const host = sandbox ? "sandbox.payfast.co.za" : "www.payfast.co.za";
  return {
    sandbox,
    merchantId,
    merchantKey,
    passphrase,
    snapshotSecret,
    processUrl: `https://${host}/eng/process`,
    validateUrl: `https://${host}/eng/query/validate`,
  };
}

export function payfastCheckoutStatus():
  | { available: true; sandbox: boolean }
  | { available: false; sandbox: false } {
  try {
    const config = getPayfastConfig();
    return { available: true, sandbox: config.sandbox };
  } catch (error) {
    if (error instanceof PayfastConfigError) return { available: false, sandbox: false };
    throw error;
  }
}

export function cartSnapshotMac(input: {
  secret: string;
  merchantId: string;
  orderId: string;
  amountCents: number;
  shippingId: string;
  couponCode: string;
  chunks: readonly string[];
}) {
  const payload = [
    "v2",
    input.merchantId,
    input.orderId,
    String(input.amountCents),
    input.shippingId,
    input.couponCode,
    input.chunks[0] ?? "",
    input.chunks[1] ?? "",
    input.chunks[2] ?? "",
  ].join("\n");
  return createHmac("sha256", input.secret).update(payload).digest("hex");
}

export function splitShippingField(value: string): { shippingId: string; mac: string } | null {
  const index = value.lastIndexOf("|");
  if (index <= 0) return null;
  const shippingId = value.slice(0, index);
  const mac = value.slice(index + 1);
  if (!/^[a-f0-9]{64}$/.test(mac)) return null;
  return { shippingId, mac };
}

/** PHP `urlencode`: spaces as `+`, uppercase hex, unreserved characters left as-is. */
export function phpUrlEncode(value: string) {
  return encodeURIComponent(value)
    .replace(/[!'()*~]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%20/g, "+");
}

export function md5Hex(value: string) {
  return createHash("md5").update(value).digest("hex");
}

export function signatureForFields(
  fields: Array<[string, string]>,
  passphrase: string,
  trimValues: boolean,
) {
  const parts: string[] = [];
  for (const [key, raw] of fields) {
    if (key === "signature") break;
    const value = trimValues ? raw.trim() : raw;
    if (trimValues && value === "") continue;
    parts.push(`${key}=${phpUrlEncode(value)}`);
  }
  let base = parts.join("&");
  if (passphrase.trim() !== "") {
    base += `&passphrase=${phpUrlEncode(passphrase.trim())}`;
  }
  return { paramString: parts.join("&"), signature: md5Hex(base) };
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function publicOrigin(request: Request) {
  const configured = process.env.PAYFAST_SITE_URL?.trim();
  if (configured) {
    const url = new URL(configured);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new PayfastConfigError("PAYFAST_SITE_URL must be an http(s) origin.");
    }
    return url.origin;
  }

  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host = forwardedHost || requestUrl.host;
  const proto = forwardedProto || requestUrl.protocol.replace(":", "");
  if ((proto !== "http" && proto !== "https") || !host || host.includes("/")) {
    throw new PayfastConfigError("Could not determine the public site URL.");
  }
  return `${proto}://${host}`;
}

export function createOrderId() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BB-${time}-${rand}`;
}

export function buildPaymentFields(input: {
  config: PayfastConfig;
  origin: string;
  orderId: string;
  amountCents: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  itemDescription: string;
  shippingId: string;
  couponCode: string | null;
  snapshot: string[];
  confirmationEmail: string;
}) {
  const values: Record<string, string> = {
    merchant_id: input.config.merchantId,
    merchant_key: input.config.merchantKey,
    return_url: `${input.origin}/checkout/success?order=${encodeURIComponent(input.orderId)}`,
    cancel_url: `${input.origin}/checkout/cancel?order=${encodeURIComponent(input.orderId)}`,
    notify_url: `${input.origin}/api/payfast/notify`,
    name_first: input.firstName,
    name_last: input.lastName,
    email_address: input.email,
    cell_number: input.phone,
    m_payment_id: input.orderId,
    amount: formatPayfastAmount(input.amountCents),
    item_name: `Baddie Booty ${input.orderId}`.slice(0, 100),
    item_description: input.itemDescription.slice(0, 255),
    custom_int1: String(input.amountCents),
    custom_str1: `${input.shippingId}|${cartSnapshotMac({
      secret: input.config.snapshotSecret,
      merchantId: input.config.merchantId,
      orderId: input.orderId,
      amountCents: input.amountCents,
      shippingId: input.shippingId,
      couponCode: input.couponCode ?? "",
      chunks: input.snapshot,
    })}`,
    custom_str2: input.couponCode ?? "",
    custom_str3: input.snapshot[0] ?? "",
    custom_str4: input.snapshot[1] ?? "",
    custom_str5: input.snapshot[2] ?? "",
    email_confirmation: "1",
    confirmation_address: input.confirmationEmail,
  };

  const ordered = PAYMENT_FIELDS.map((name) => [name, values[name] ?? ""] as [string, string]);
  const fields: PayfastField[] = ordered
    .filter(([, value]) => value.trim() !== "")
    .map(([name, value]) => ({ name: name as PayfastFieldName, value: value.trim() }));
  if (!input.config.sandbox && !input.config.passphrase) {
    throw new PayfastConfigError("Live PayFast requires a passphrase.");
  }
  if (input.config.passphrase || !input.config.sandbox) {
    const { signature } = signatureForFields(ordered, input.config.passphrase, true);
    fields.push({ name: "signature", value: signature });
  }
  return fields;
}

export function parseUrlEncoded(body: string) {
  if (!body.trim()) return [];
  return body.split("&").filter(Boolean).map((part) => {
    const index = part.indexOf("=");
    const rawKey = index === -1 ? part : part.slice(0, index);
    const rawValue = index === -1 ? "" : part.slice(index + 1);
    return {
      key: decodeFormComponent(rawKey),
      value: decodeFormComponent(rawValue),
    };
  });
}

function decodeFormComponent(value: string) {
  try {
    return decodeURIComponent(value.replace(/\+/g, "%20"));
  } catch {
    return value;
  }
}

export function itnRecord(pairs: Array<{ key: string; value: string }>) {
  const record: Record<string, string> = {};
  for (const pair of pairs) {
    if (pair.key === "signature") break;
    record[pair.key] = pair.value;
  }
  const signature = pairs.find((pair) => pair.key === "signature")?.value ?? "";
  return { record, signature };
}

function ipv4ToInt(ip: string) {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let value = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const octet = Number(part);
    if (octet > 255) return null;
    value = (value * 256 + octet) >>> 0;
  }
  return value;
}

export function normalizeIp(ip: string) {
  const trimmed = ip.trim().replace(/^::ffff:/i, "");
  return trimmed;
}

export function isPayfastRangeIp(ip: string) {
  const normalized = normalizeIp(ip);
  const value = ipv4ToInt(normalized);
  if (value === null) return false;
  return PAYFAST_RANGES.some(([base, bits]) => {
    const start = ipv4ToInt(base);
    if (start === null) return false;
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (value & mask) === (start & mask);
  });
}

let hostCache: { at: number; ips: Set<string> } | null = null;

export async function isPayfastHostIp(ip: string) {
  const normalized = normalizeIp(ip);
  const now = Date.now();
  if (!hostCache || now - hostCache.at > 10 * 60 * 1000) {
    const ips = new Set<string>();
    await Promise.all(
      PAYFAST_HOSTS.map(async (host) => {
        try {
          for (const address of await resolve4(host)) ips.add(address);
        } catch {
          // DNS failure falls through to the published ranges.
        }
      }),
    );
    hostCache = { at: now, ips };
  }
  return hostCache.ips.has(normalized);
}

export async function isPayfastSourceIp(ip: string | null) {
  if (!ip) return false;
  if (isPayfastRangeIp(ip)) return true;
  return isPayfastHostIp(ip);
}

export function readClientIp(headers: Headers) {
  const candidates = [
    headers.get("x-real-ip"),
    headers.get("x-vercel-forwarded-for"),
    headers.get("x-forwarded-for"),
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const first = candidate.split(",")[0]?.trim();
    if (first) return normalizeIp(first);
  }
  return null;
}

export async function confirmWithPayfast(validateUrl: string, paramString: string) {
  try {
    const response = await fetch(validateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "BaddieBooty-PayFast/1.0",
      },
      body: paramString,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const text = (await response.text()).trim();
    if (text === "VALID" || text === "INVALID") return text;
    return "ERROR" as const;
  } catch {
    return "ERROR" as const;
  }
}
