"use client";

import { useState } from "react";
import { QtyControl } from "@/components/cart-drawer";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/cart-provider";

export function ProductPurchase({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0] ?? "One size");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="space-y-3">
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
          Size
        </legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.sizes.map((option) => {
            const active = option === size;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-full px-3 text-xs font-semibold ${
                  active
                    ? "bg-brand text-white"
                    : "border border-ink/10 bg-ivory text-ink"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {product.sizes.length > 1 ? (
          <p className="mt-2 text-xs leading-5 text-muted">
            Between sizes? WhatsApp the studio with your usual clothing size.
          </p>
        ) : null}
      </fieldset>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <QtyControl qty={qty} onChange={(next) => setQty(Math.max(1, next))} />
        <button
          type="button"
          onClick={() => addItem(product.slug, size, qty)}
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-header"
        >
          Add {qty} to bag
        </button>
      </div>
      <p className="text-xs leading-5 text-muted">
        Proposal demo bag, this browser only. Checkout does not process
        payment.
      </p>
    </div>
  );
}
