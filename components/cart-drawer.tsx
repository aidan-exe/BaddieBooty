"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, lineProduct } from "@/components/cart-provider";
import { formatZar } from "@/lib/site";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, setQty, removeItem, subtotal, itemCount } =
    useCart();

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close bag"
        onClick={closeDrawer}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 id="cart-drawer-title" className="font-display text-xl text-ink">
            Your bag · {itemCount}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-ink/10 text-sm font-semibold"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-sm leading-6 text-muted">
              Nothing in the demo bag yet. Add a piece from the shop — this cart
              lives in your browser only.
            </p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => {
                const product = lineProduct(line);
                if (!product) return null;
                return (
                  <li
                    key={`${line.slug}-${line.size}`}
                    className="flex gap-3 rounded-2xl border border-sand bg-cream p-3"
                  >
                    <Link
                      href={`/shop/${product.slug}`}
                      onClick={closeDrawer}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-tint"
                    >
                      <Image
                        src={product.image}
                        alt={product.imageAlt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/shop/${product.slug}`}
                        onClick={closeDrawer}
                        className="block font-display text-base leading-tight text-ink"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted">Size {line.size}</p>
                      <p className="mt-1 text-sm font-semibold text-brand">
                        {formatZar(product.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <QtyControl
                          qty={line.qty}
                          onChange={(qty) => setQty(line.slug, line.size, qty)}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(line.slug, line.size)}
                          className="text-xs font-semibold text-muted underline-offset-2 hover:text-brand hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-sand px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-display text-2xl text-brand">
              {formatZar(subtotal)}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            Proposal demo — no payment is processed. Courier rates land with a
            paid rebuild.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
            >
              Demo checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/10 px-5 text-sm font-semibold"
            >
              View bag
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function QtyControl({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (qty: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink/10 bg-ivory">
      <button
        type="button"
        className="inline-flex min-h-9 min-w-9 items-center justify-center text-lg"
        aria-label="Decrease quantity"
        onClick={() => onChange(qty - 1)}
      >
        −
      </button>
      <span className="min-w-6 text-center text-sm font-semibold">{qty}</span>
      <button
        type="button"
        className="inline-flex min-h-9 min-w-9 items-center justify-center text-lg"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
      >
        +
      </button>
    </div>
  );
}
