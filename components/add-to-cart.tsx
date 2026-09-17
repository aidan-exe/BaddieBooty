"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

export function AddToCart({
  product,
  size,
  label = "Add to bag",
  compact = false,
}: {
  product: Product;
  size: string;
  label?: string;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [pulse, setPulse] = useState(false);

  function add() {
    if (!size) return;
    addItem(product.slug, size, 1);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 900);
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={!size}
      className={`inline-flex flex-1 items-center justify-center rounded-full bg-brand font-semibold text-white transition hover:bg-brand-header disabled:cursor-not-allowed disabled:opacity-50 ${
        compact
          ? "min-h-9 px-2 text-xs"
          : "min-h-10 px-5 text-sm"
      }`}
    >
      {pulse ? "Added" : label}
    </button>
  );
}

export function CartIconButton() {
  const { itemCount, openDrawer, ready } = useCart();
  const count = ready ? itemCount : 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-ink/10 bg-cream text-sm font-semibold"
      aria-label={`Open bag, ${count} items`}
    >
      <BagIcon />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none">
      <path
        d="M6 8h12l-1 12H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V7a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
