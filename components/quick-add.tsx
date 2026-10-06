"use client";

import { AddToCart } from "@/components/add-to-cart";
import { defaultVariant, type Product } from "@/lib/products";

export function QuickAdd({ product }: { product: Product }) {
  const variant = defaultVariant(product);
  if (!variant?.purchasable) {
    return (
      <span className="inline-flex min-h-9 flex-1 items-center justify-center rounded-full bg-ink/10 px-2 text-xs font-semibold text-muted">
        Sold out
      </span>
    );
  }
  return <AddToCart product={product} size={variant.label} label="Add" compact />;
}
