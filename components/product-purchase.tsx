"use client";

import { useState } from "react";
import { QtyControl } from "@/components/cart-drawer";
import { useCart } from "@/components/cart-provider";
import {
  defaultVariant,
  variantFor,
  type Product,
} from "@/lib/products";
import { formatZar } from "@/lib/site";

export function ProductPurchase({ product }: { product: Product }) {
  const initial = defaultVariant(product);
  const [selected, setSelected] = useState<Record<string, string>>(
    initial?.attributes ?? {},
  );
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const variant = variantFor(product, selected) ?? initial;
  const canBuy = Boolean(variant?.purchasable && variant.inStock);

  return (
    <div className="space-y-3">
      <div>
        <p className="font-display text-3xl text-brand">
          {variant?.onSale ? (
            <>
              <span className="mr-2 text-xl text-muted line-through">
                {formatZar(variant.regularPrice)}
              </span>
              {formatZar(variant.price)}
            </>
          ) : (
            formatZar(variant?.price ?? product.price)
          )}
        </p>
        {variant?.stockText ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {variant.stockText}
          </p>
        ) : null}
      </div>
      {product.attributes.map((attribute) => (
        <fieldset key={attribute.name}>
          <legend className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
            {attribute.name}
          </legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {attribute.options.map((option) => {
              const active = selected[attribute.name] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setSelected((current) => ({ ...current, [attribute.name]: option }))
                  }
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
        </fieldset>
      ))}
      {product.attributes.length === 0 ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-bright">
          {variant?.label ?? "One size"}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <QtyControl qty={qty} onChange={(next) => setQty(Math.max(1, next))} />
        <button
          type="button"
          disabled={!canBuy || !variant}
          onClick={() => {
            if (!variant || !canBuy) return;
            addItem(product.slug, variant.label, qty);
          }}
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-header disabled:cursor-not-allowed disabled:opacity-50"
        >
          {canBuy ? `Add ${qty} to bag` : variant?.stockText || "Unavailable"}
        </button>
      </div>
    </div>
  );
}
