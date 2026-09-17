"use client";

import Image from "next/image";
import Link from "next/link";
import { QtyControl } from "@/components/cart-drawer";
import { lineProduct, useCart } from "@/components/cart-provider";
import { formatZar } from "@/lib/site";

export default function CartPage() {
  const { lines, setQty, removeItem, subtotal, itemCount, openDrawer, ready } =
    useCart();

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
        Demo bag
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink">Your bag</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Qty update and remove work in this browser. Checkout is a proposal demo
        and does not process payment.
      </p>

      {!ready ? (
        <p className="mt-6 text-sm text-muted">Loading bag…</p>
      ) : lines.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-sand bg-cream px-5 py-10 text-center">
          <p className="font-display text-2xl">Bag is empty</p>
          <Link
            href="/shop"
            className="mt-4 inline-flex min-h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {lines.map((line) => {
            const product = lineProduct(line);
            if (!product) return null;
            return (
              <article
                key={`${line.slug}-${line.size}`}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-sand bg-cream p-4 sm:flex-row"
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-brand-tint sm:h-36 sm:w-28 sm:shrink-0"
                >
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 112px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="font-display text-lg leading-tight hover:text-brand"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">Size {line.size}</p>
                  <p className="mt-1 font-display text-xl text-brand">
                    {formatZar(product.price * line.qty)}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <QtyControl
                      qty={line.qty}
                      onChange={(qty) => setQty(line.slug, line.size, qty)}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(line.slug, line.size)}
                      className="text-sm font-semibold text-muted underline-offset-2 hover:text-brand hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
          <div className="flex flex-col items-start justify-between gap-4 rounded-[1.5rem] bg-brand-header px-6 py-6 text-white sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-lavender">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </p>
              <p className="font-display text-3xl">{formatZar(subtotal)}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={openDrawer}
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/30 px-5 text-sm font-semibold"
              >
                Open drawer
              </button>
              <Link
                href="/checkout"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-brand"
              >
                Demo checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
