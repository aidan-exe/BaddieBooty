"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useCart } from "@/components/cart-provider";
import { formatZarCents, site } from "@/lib/site";

const RECEIPT_KEY = "baddie-booty-checkout-receipt-v1";

type Receipt = {
  orderId: string;
  firstName: string;
  email: string;
  lines: { name: string; size: string; qty: number; lineCents: number; image: string }[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  shippingLabel: string;
  totalCents: number;
};

let receiptRaw: string | null = null;
let receiptCached: Receipt | null = null;

function readReceiptSnapshot() {
  const raw = sessionStorage.getItem(RECEIPT_KEY);
  if (raw === receiptRaw) return receiptCached;
  receiptRaw = raw;
  if (!raw) {
    receiptCached = null;
    return receiptCached;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    receiptCached =
      parsed && typeof parsed === "object" && "orderId" in parsed ? (parsed as Receipt) : null;
  } catch {
    receiptCached = null;
  }
  return receiptCached;
}

function subscribeHydration() {
  return () => {};
}

export function CheckoutResult({ mode }: { mode: "success" | "cancel" | "failed" }) {
  const params = useSearchParams();
  const orderId = params.get("order");
  const { clear, ready } = useCart();
  const stored = useSyncExternalStore(subscribeHydration, readReceiptSnapshot, () => null);
  const receipt = stored?.orderId === orderId ? stored : null;

  useEffect(() => {
    if (mode !== "success" || !ready || !receipt) return;
    clear();
  }, [mode, ready, receipt, clear]);

  if (mode === "cancel") {
    return (
      <ResultShell
        title="Payment cancelled"
        body="You left PayFast before the payment finished. Your bag is unchanged."
        orderId={orderId}
        primary={{ href: "/checkout", label: "Return to checkout" }}
      />
    );
  }

  if (mode === "failed") {
    return (
      <ResultShell
        title="Payment failed"
        body="PayFast did not complete this payment. Your bag is unchanged."
        orderId={orderId}
        primary={{ href: "/checkout", label: "Try checkout again" }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Order received</p>
      <h1 className="mt-2 font-display text-3xl">
        {receipt ? `Thank you, ${receipt.firstName}.` : "Payment return"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        {receipt
          ? `PayFast sent you back from the payment page. We pack order ${receipt.orderId} in Durban once PayFast confirms the payment, then email tracking to ${receipt.email}.`
          : orderId
            ? `If PayFast sent you here, the order reference is ${orderId}. We will email you once the payment is confirmed.`
            : "If PayFast sent you here, we will email you once the payment is confirmed."}
      </p>
      {receipt ? (
        <div className="mt-6 space-y-3 rounded-2xl border border-sand bg-cream p-4">
          <ul className="space-y-3">
            {receipt.lines.map((line) => (
              <li key={`${line.name}-${line.size}`} className="flex gap-3">
                <div className="relative h-16 w-14 overflow-hidden rounded-xl bg-brand-tint">
                  <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-tight">{line.name}</p>
                  <p className="text-xs text-muted">
                    {line.size} · Qty {line.qty}
                  </p>
                </div>
                <p className="text-sm font-semibold text-brand">{formatZarCents(line.lineCents)}</p>
              </li>
            ))}
          </ul>
          <dl className="space-y-1 border-t border-sand pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatZarCents(receipt.subtotalCents)}</dd>
            </div>
            {receipt.discountCents > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted">Coupon</dt>
                <dd>−{formatZarCents(receipt.discountCents)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted">{receipt.shippingLabel}</dt>
              <dd>{formatZarCents(receipt.shippingCents)}</dd>
            </div>
            <div className="flex justify-between pt-1">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display text-xl text-brand">{formatZarCents(receipt.totalCents)}</dd>
            </div>
          </dl>
        </div>
      ) : null}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
        >
          Back to shop
        </Link>
        <a
          href={site.whatsapp}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-ink/10 px-5 text-sm font-semibold"
        >
          WhatsApp the studio
        </a>
      </div>
    </div>
  );
}

function ResultShell({
  title,
  body,
  orderId,
  primary,
}: {
  title: string;
  body: string;
  orderId: string | null;
  primary: { href: "/checkout"; label: string };
}) {
  return (
    <div className="mx-auto max-w-xl px-5 py-10 text-center">
      <h1 className="font-display text-3xl">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
      {orderId ? <p className="mt-2 text-xs text-muted">Reference {orderId}</p> : null}
      <div className="mt-5 flex flex-col items-center gap-2">
        <Link
          href={primary.href}
          className="inline-flex min-h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
        >
          {primary.label}
        </Link>
        <Link href="/shop" className="text-sm font-semibold text-brand">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
