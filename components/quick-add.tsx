"use client";

import { AddToCart } from "@/components/add-to-cart";
import type { Product } from "@/lib/products";

export function QuickAdd({ product }: { product: Product }) {
  const size = product.sizes[0] ?? "One size";
  return (
    <AddToCart product={product} size={size} label="Add" compact />
  );
}
