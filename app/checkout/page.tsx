"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { lineProduct, useCart } from "@/components/cart-provider";
import { formatZar, site } from "@/lib/site";

export default function CheckoutPage() {
  const { lines, subtotal, clear, itemCount, ready } = useCart();
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setName(String(data.get("name") || "Baddie"));
    setDone(true);
    clear();
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-5 py-10 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
          Proposal demo
        </p>
        <h1 className="mt-2 font-display text-3xl">Nothing was charged, {name}.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          This checkout is a walkthrough only. No payment, no order, no courier
          booking. Message Tiara on {site.phoneDisplay} to order on the live
          store.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex min-h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  if (!ready) {
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
        <p className="mt-2 text-sm text-muted">Add a piece before the demo checkout.</p>
        <Link
          href="/shop"
          className="mt-5 inline-flex min-h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
        >
          Shop the edit
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1fr_0.9fr]">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
          Proposal demo — no payment
        </p>
        <h1 className="mt-2 font-display text-3xl">Checkout walkthrough</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Looks like a checkout. Submitting this form does not take a card, EFT,
          or SnapScan. Use it to feel the path; order on the live store or
          WhatsApp Tiara.
        </p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <label className="block space-y-1.5 text-sm font-medium">
            Name
            <input
              required
              name="name"
              autoComplete="name"
              className="min-h-10 w-full rounded-xl border border-ink/10 bg-cream px-4 text-base font-normal outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            Email
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className="min-h-10 w-full rounded-xl border border-ink/10 bg-cream px-4 text-base font-normal outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            City / area
            <input
              required
              name="city"
              autoComplete="address-level2"
              className="min-h-10 w-full rounded-xl border border-ink/10 bg-cream px-4 text-base font-normal outline-none ring-brand/30 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-white sm:w-auto sm:px-8"
          >
            Place demo order
          </button>
        </form>
      </div>
      <aside className="h-fit rounded-2xl border border-sand bg-cream p-4">
        <h2 className="font-display text-xl">Order summary</h2>
        <ul className="mt-3 space-y-3">
          {lines.map((line) => {
            const product = lineProduct(line);
            if (!product) return null;
            return (
              <li key={`${line.slug}-${line.size}`} className="flex gap-3">
                <div className="relative h-16 w-14 overflow-hidden rounded-xl bg-brand-tint">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-tight">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted">
                    {line.size} · ×{line.qty}
                  </p>
                </div>
                <p className="text-sm font-semibold text-brand">
                  {formatZar(product.price * line.qty)}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t border-sand pt-4">
          <span className="text-sm text-muted">Subtotal</span>
          <span className="font-display text-2xl text-brand">
            {formatZar(subtotal)}
          </span>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          Shipping is not calculated here. SA courier rates come with the paid
          rebuild.
        </p>
      </aside>
    </div>
  );
}
