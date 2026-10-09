"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { AddressFields } from "@/components/address-fields";
import { useCart } from "@/components/cart-provider";
import { CheckoutTrustMarks } from "@/components/payment-marks";
import {
  CHECKOUT_STORAGE_KEY,
  emptyCheckoutDraft,
  readCheckoutDraft,
  validateCustomer,
  type CheckoutDraft,
} from "@/lib/checkout-details";
import { findCoupon, shippingMethods } from "@/lib/pricing";
import { quoteFromCart, type Quote } from "@/lib/quote";
import { formatZarCents } from "@/lib/site";

const RECEIPT_KEY = "baddie-booty-checkout-receipt-v1";

const control =
  "min-h-11 w-full rounded-xl border bg-white px-3 text-base font-normal text-ink outline-none ring-brand/30 placeholder:text-muted/70 focus:ring-2";

type PayfastResponse = {
  orderId: string;
  processUrl: string;
  fields: { name: string; value: string }[];
  totals: { totalCents: number };
  error?: string;
  fieldErrors?: Record<string, string>;
};

type PersistedCheckout = {
  draft: CheckoutDraft;
  shippingId: "flat_rate" | "overnight";
  couponCode: string;
};

const emptyPersisted: PersistedCheckout = {
  draft: emptyCheckoutDraft(),
  shippingId: "flat_rate",
  couponCode: "",
};

let persistedRaw: string | null = null;
let persistedValue: PersistedCheckout = emptyPersisted;
const persistedListeners = new Set<() => void>();

function readExtras(raw: string | null) {
  let shippingId: "flat_rate" | "overnight" = "flat_rate";
  let couponCode = "";
  if (!raw) return { shippingId, couponCode };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { shippingId, couponCode };
    const source = parsed as Record<string, unknown>;
    if (source.shippingId === "overnight" || source.shippingId === "flat_rate") {
      shippingId = source.shippingId;
    }
    if (typeof source.couponCode === "string") couponCode = source.couponCode.slice(0, 40);
  } catch {
    return { shippingId, couponCode };
  }
  return { shippingId, couponCode };
}

function readPersisted() {
  const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
  if (raw === persistedRaw) return persistedValue;
  persistedRaw = raw;
  const extras = readExtras(raw);
  persistedValue = {
    draft: readCheckoutDraft(raw),
    shippingId: extras.shippingId,
    couponCode: extras.couponCode,
  };
  return persistedValue;
}

function subscribePersisted(listener: () => void) {
  persistedListeners.add(listener);
  return () => persistedListeners.delete(listener);
}

function writePersisted(next: PersistedCheckout) {
  const raw = JSON.stringify({
    ...next.draft,
    shippingId: next.shippingId,
    couponCode: next.couponCode,
  });
  localStorage.setItem(CHECKOUT_STORAGE_KEY, raw);
  persistedRaw = raw;
  persistedValue = next;
  persistedListeners.forEach((listener) => listener());
}

function subscribeHydration() {
  return () => {};
}

function visibleError(
  key: string,
  errors: Record<string, string>,
  touched: Record<string, boolean>,
  submitted: boolean,
  serverErrors: Record<string, string>,
) {
  if (serverErrors[key]) return serverErrors[key];
  if ((submitted || touched[key]) && errors[key]) return errors[key];
  return undefined;
}

export function CheckoutForm({ sandbox }: { sandbox: boolean }) {
  const { lines, itemCount, ready } = useCart();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const persisted = useSyncExternalStore(subscribePersisted, readPersisted, () => emptyPersisted);
  const { draft, shippingId, couponCode } = persisted;
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const customerCheck = useMemo(() => validateCustomer(draft), [draft]);
  const coupon = findCoupon(couponCode);
  const couponInvalid = couponCode.trim().length > 0 && !coupon;
  const quoted = useMemo(
    () => quoteFromCart(lines, shippingId, coupon ? coupon.code : ""),
    [lines, shippingId, coupon],
  );

  const fieldErrors = customerCheck.ok ? {} : customerCheck.errors;
  const shownErrors: Record<string, string | undefined> = {};
  for (const key of Object.keys(fieldErrors)) {
    shownErrors[key] = visibleError(key, fieldErrors, touched, submitted, serverErrors);
  }
  for (const [key, message] of Object.entries(serverErrors)) {
    shownErrors[key] = message;
  }
  if ((submitted || touched.coupon) && couponInvalid) {
    shownErrors.coupon = "That coupon code isn't valid.";
  }
  if ((submitted || touched.notes) && fieldErrors.notes) {
    shownErrors.notes = fieldErrors.notes;
  }

  function touch(key: string) {
    setTouched((current) => ({ ...current, [key]: true }));
  }

  function updateAddress(section: "billing" | "shipping", field: string, next: string) {
    const current = readPersisted();
    writePersisted({
      ...current,
      draft: {
        ...current.draft,
        [section]: { ...current.draft[section], [field]: next },
      },
    });
    setServerErrors((current) => {
      if (!current[`${section}.${field}`]) return current;
      const copy = { ...current };
      delete copy[`${section}.${field}`];
      return copy;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setFormError("");
    setServerErrors({});

    if (!customerCheck.ok || !quoted.ok || couponInvalid) {
      const firstKey = !customerCheck.ok
        ? Object.keys(customerCheck.errors)[0]
        : couponInvalid
          ? "coupon"
          : "lines";
      if (firstKey === "coupon") {
        document.getElementById("field-coupon")?.focus();
      } else if (firstKey) {
        const node = document.getElementById(`field-${firstKey.replaceAll(".", "-")}`);
        node?.scrollIntoView({ behavior: "smooth", block: "center" });
        node?.focus();
      }
      if (!quoted.ok) setFormError(quoted.error);
      else if (couponInvalid) setFormError("That coupon code isn't valid.");
      else setFormError("Check the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout/payfast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          lines,
          shippingId,
          couponCode: coupon ? coupon.code : "",
        }),
      });
      const payload = (await response.json()) as PayfastResponse;
      if (!response.ok) {
        setServerErrors(payload.fieldErrors ?? {});
        setFormError(payload.error || "We couldn't start the payment.");
        setSubmitting(false);
        return;
      }
      if (payload.totals.totalCents !== quoted.quote.totalCents) {
        setFormError("The total changed. Review the order and try again.");
        setSubmitting(false);
        return;
      }

      const quote: Quote = quoted.quote;
      sessionStorage.setItem(
        RECEIPT_KEY,
        JSON.stringify({
          orderId: payload.orderId,
          firstName: customerCheck.value.billing.firstName,
          email: customerCheck.value.billing.email,
          lines: quote.lines.map((line) => ({
            name: line.name,
            size: line.size,
            qty: line.qty,
            lineCents: line.lineCents,
            image: line.image,
          })),
          subtotalCents: quote.subtotalCents,
          discountCents: quote.discountCents,
          shippingCents: quote.shippingCents,
          shippingLabel: quote.shippingLabel,
          totalCents: quote.totalCents,
        }),
      );

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payload.processUrl;
      for (const field of payload.fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = field.name;
        input.value = field.value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch {
      setFormError("We couldn't reach the payment step. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (!ready || !hydrated) {
    return (
      <div className="mx-auto max-w-xl px-5 py-10 text-center">
        <p className="text-sm text-muted">Loading checkout…</p>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-10 text-center">
        <h1 className="font-display text-3xl">Bag is empty</h1>
        <p className="mt-2 text-sm text-muted">Add a piece before checkout.</p>
        <Link
          href="/shop"
          className="mt-5 inline-flex min-h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
        >
          Shop the edit
        </Link>
      </div>
    );
  }

  const quote = quoted.ok ? quoted.quote : null;
  const shipping = shippingMethods.find((method) => method.id === shippingId) ?? shippingMethods[0];

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto max-w-6xl px-4 py-6 lg:px-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <details className="checkout-summary h-fit rounded-2xl border border-sand bg-cream lg:sticky lg:top-20 lg:order-2" open>
          <summary className="flex items-center justify-between gap-3 px-4 py-3">
            <span>
              <span className="font-display text-xl">Order summary</span>
              <span className="mt-0.5 block text-xs text-muted lg:hidden">
                {itemCount} {itemCount === 1 ? "piece" : "pieces"} · {shipping.label}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-display text-xl text-brand" aria-live="polite">
                {quote ? formatZarCents(quote.totalCents) : "—"}
              </span>
              <span className="checkout-chevron text-muted" aria-hidden>
                ▾
              </span>
            </span>
          </summary>
          <div className="checkout-summary-body space-y-4 border-t border-sand px-4 py-4">
            <ul className="space-y-3">
              {lines.map((line) => {
                const priced = quote?.lines.find(
                  (item) => item.slug === line.slug && item.size === line.size,
                );
                return (
                  <li key={`${line.slug}-${line.size}`} className="flex gap-3">
                    <div className="relative h-16 w-14 overflow-hidden rounded-xl bg-brand-tint">
                      {priced ? (
                        <Image src={priced.image} alt="" fill sizes="56px" className="object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight">
                        {priced?.name ?? line.slug}
                      </p>
                      <p className="text-xs text-muted">
                        {line.size} · Qty {line.qty}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-brand">
                      {priced ? formatZarCents(priced.lineCents) : ""}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-2 border-t border-sand pt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{quote ? formatZarCents(quote.subtotalCents) : "—"}</span>
              </div>
              {quote && quote.discountCents > 0 ? (
                <div className="flex justify-between">
                  <span className="text-muted">Coupon {quote.couponCode}</span>
                  <span>−{formatZarCents(quote.discountCents)}</span>
                </div>
              ) : null}
            </div>

            <div>
              <label className="block space-y-1.5 text-sm font-medium" htmlFor="field-coupon">
                Coupon code
                <input
                  id="field-coupon"
                  value={couponCode}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) =>
                    writePersisted({ ...readPersisted(), couponCode: event.target.value })
                  }
                  onBlur={() => touch("coupon")}
                  aria-invalid={Boolean(shownErrors.coupon)}
                  aria-describedby={shownErrors.coupon ? "field-coupon-error" : undefined}
                  className={`${control} ${shownErrors.coupon ? "border-red-700" : "border-ink/10"}`}
                />
              </label>
              {shownErrors.coupon ? (
                <p id="field-coupon-error" role="alert" className="mt-1 text-xs text-red-800">
                  {shownErrors.coupon}
                </p>
              ) : null}
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold">Shipping</legend>
              {shippingMethods.map((method) => {
                const selected = shippingId === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${
                      selected ? "border-brand bg-white" : "border-ink/10 bg-ivory"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingId"
                      value={method.id}
                      checked={selected}
                      onChange={() =>
                        writePersisted({ ...readPersisted(), shippingId: method.id })
                      }
                      className="mt-1 accent-[var(--brand)]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-3 text-sm font-semibold">
                        <span>{method.label}</span>
                        <span>{formatZarCents(method.cents)}</span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted">{method.eta}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <div className="flex items-center justify-between border-t border-sand pt-3">
              <span className="text-sm text-muted">Total</span>
              <span className="font-display text-2xl text-brand">
                {quote ? formatZarCents(quote.totalCents) : "—"}
              </span>
            </div>
            {!quoted.ok ? (
              <p role="alert" className="text-sm text-red-800">
                {quoted.error}
              </p>
            ) : null}
          </div>
        </details>

        <div className="space-y-8 lg:order-1">
          <div>
            <h1 className="font-display text-3xl">Checkout</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Guest checkout. We keep these details on this device for next time.
            </p>
          </div>

          {formError ? (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              {formError}
            </p>
          ) : null}

          <section className="space-y-4">
            <h2 className="font-display text-2xl">Billing details</h2>
            <AddressFields
              prefix="billing"
              value={draft.billing}
              errors={shownErrors}
              includeEmail
              onBlur={(field) => touch(`billing.${field}`)}
              onChange={(field, next) => updateAddress("billing", field, next)}
            />
          </section>

          <section className="space-y-4">
            <label className="flex items-start gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={draft.shipToDifferent}
                onChange={(event) => {
                  const current = readPersisted();
                  writePersisted({
                    ...current,
                    draft: { ...current.draft, shipToDifferent: event.target.checked },
                  });
                }}
                className="mt-0.5 accent-[var(--brand)]"
              />
              Deliver to a different address?
            </label>
            {draft.shipToDifferent ? (
              <AddressFields
                prefix="shipping"
                value={draft.shipping}
                errors={shownErrors}
                onBlur={(field) => touch(`shipping.${field}`)}
                onChange={(field, next) => updateAddress("shipping", field, next)}
              />
            ) : null}
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-2xl">Additional information</h2>
            <label className="block space-y-1.5 text-sm font-medium" htmlFor="field-notes">
              Order notes <span className="font-normal text-muted">(optional)</span>
              <textarea
                id="field-notes"
                value={draft.notes}
                rows={3}
                placeholder="Notes about your order, e.g. special notes for delivery."
                onChange={(event) => {
                  const current = readPersisted();
                  writePersisted({
                    ...current,
                    draft: { ...current.draft, notes: event.target.value },
                  });
                }}
                onBlur={() => touch("notes")}
                aria-invalid={Boolean(shownErrors.notes)}
                className={`${control} py-3 ${shownErrors.notes ? "border-red-700" : "border-ink/10"}`}
              />
            </label>
            {shownErrors.notes ? (
              <p role="alert" className="text-xs text-red-800">
                {shownErrors.notes}
              </p>
            ) : null}
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl">Payment</h2>
            <div className="rounded-2xl border border-brand bg-white p-4">
              <label className="flex gap-3">
                <input
                  type="radio"
                  name="payment_method"
                  value="payfast"
                  checked
                  onChange={() => {}}
                  className="mt-1 accent-[var(--brand)]"
                />
                <span>
                  <span className="text-sm font-semibold">PayFast</span>
                  <span className="mt-1 block text-sm leading-5 text-muted">
                    Card or Instant EFT on PayFast. Visa and Mastercard accepted.
                  </span>
                </span>
              </label>
              <div className="mt-4">
                <CheckoutTrustMarks />
              </div>
              {sandbox ? (
                <p className="mt-3 text-xs leading-5 text-muted">
                  Sandbox mode: PayFast will not take a real payment.
                </p>
              ) : null}
            </div>
            <p className="text-xs leading-5 text-muted">
              Your personal data will be used to process your order, support your experience
              throughout this website, and for other purposes described in our{" "}
              <Link href="/privacy" className="font-semibold text-brand underline-offset-2 hover:underline">
                privacy policy
              </Link>
              .
            </p>
            <button
              type="submit"
              disabled={submitting || !quoted.ok}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-header disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Redirecting to PayFast…"
                : `Place order${quote ? ` · ${formatZarCents(quote.totalCents)}` : ""}`}
            </button>
          </section>
        </div>
      </div>
    </form>
  );
}
