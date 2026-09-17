"use client";

import Link from "next/link";
import { ProductCard, productGridClass } from "@/components/product-card";
import { categories, products, type CategoryId } from "@/lib/products";
import { useMemo } from "react";

export function ShopCatalog({ category }: { category: CategoryId }) {
  const visible = useMemo(
    () =>
      category === "all"
        ? products
        : products.filter((product) => product.category === category),
    [category],
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-[3.5rem] z-30 -mx-5 bg-ivory/95 px-5 py-2 backdrop-blur-md md:static md:mx-0 md:bg-transparent md:px-0 md:py-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((item) => {
            const active = category === item.id;
            const href =
              item.id === "all" ? "/shop" : `/shop?category=${item.id}`;
            return (
              <Link
                key={item.id}
                href={href}
                scroll={false}
                className={`inline-flex min-h-9 shrink-0 items-center rounded-full px-3 text-xs font-semibold ${
                  active
                    ? "bg-brand text-white"
                    : "border border-ink/10 bg-cream text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted">
        {visible.length} piece{visible.length === 1 ? "" : "s"} · tap for the
        product page, then add to the demo bag.
      </p>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sand bg-cream px-5 py-10 text-center">
          <p className="font-display text-2xl text-ink">
            Nothing in this edit yet
          </p>
          <p className="mt-1 text-sm text-muted">Try another category.</p>
        </div>
      ) : (
        <div className={productGridClass}>
          {visible.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      )}
    </div>
  );
}
