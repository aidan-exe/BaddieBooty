import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Orders are an append-only log, not a database.
 *
 * The payable total is recomputed from the catalogue using the cart snapshot
 * PayFast echoes in the signed ITN, so fulfilment does not depend on a shared
 * order table. Vercel instances do not share a disk, so the durable copy is
 * the structured `baddie-order` log line (Vercel runtime logs). A local jsonl
 * file is written when the filesystem allows it, for dev and single-instance hosts.
 */
export type OrderEvent = {
  at: string;
  orderId: string;
  status: "pending" | "complete" | "cancelled" | "failed" | "rejected";
  reason?: string;
  pfPaymentId?: string;
  amountCents?: number;
  paymentStatus?: string;
  sandbox?: boolean;
  customer?: unknown;
  lines?: unknown;
  totals?: unknown;
  shippingId?: string;
  couponCode?: string | null;
  notes?: string;
  detail?: unknown;
};

function logTargets() {
  const configured = process.env.ORDER_LOG_PATH?.trim();
  return [
    configured,
    path.join(process.cwd(), ".data", "orders.jsonl"),
    path.join("/tmp", "baddie-booty-orders.jsonl"),
  ].filter((target): target is string => Boolean(target));
}

export async function recordOrder(event: Omit<OrderEvent, "at"> & { at?: string }) {
  const entry: OrderEvent = { ...event, at: event.at ?? new Date().toISOString() };
  const line = JSON.stringify(entry);
  console.info(`baddie-order ${line}`);
  for (const target of logTargets()) {
    try {
      await mkdir(path.dirname(target), { recursive: true });
      await appendFile(target, `${line}\n`, "utf8");
      return target;
    } catch {
      continue;
    }
  }
  return null;
}

export async function hasCompletedPayment(pfPaymentId: string) {
  for (const target of logTargets()) {
    try {
      const raw = await readFile(target, "utf8");
      for (const line of raw.split("\n")) {
        if (!line.trim()) continue;
        const parsed = JSON.parse(line) as OrderEvent;
        if (parsed.pfPaymentId === pfPaymentId && parsed.status === "complete") return true;
      }
    } catch {
      continue;
    }
  }
  return false;
}
