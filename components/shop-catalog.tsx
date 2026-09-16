"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import {
  categories,
  products,
  type CategoryId,
  type Product,
} from "@/lib/products";
import { site } from "@/lib/site";

export function ShopCatalog({ category }: { category: CategoryId }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      category === "all"
        ? products
        : products.filter((product) => product.category === category),
    [category],
  );

  function save(product: Product) {
    setSaved((current) =>
      current.includes(product.slug)
        ? current.filter((slug) => slug !== product.slug)
        : [...current, product.slug],
    );
    setNotice(
      `${product.name} is saved in this preview only. Secure checkout and SA shipping come with a paid WooCommerce rebuild. Message Tiara to order today.`,
    );
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-[4.25rem] z-30 -mx-5 bg-ivory/95 px-5 py-3 backdrop-blur-md md:static md:mx-0 md:bg-transparent md:px-0 md:py-0">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => {
            const active = category === item.id;
            const href =
              item.id === "all" ? "/shop" : `/shop?category=${item.id}`;
            return (
              <Link
                key={item.id}
                href={href}
                scroll={false}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold ${
                  active
                    ? "bg-wine text-ivory"
                    : "border border-espresso/10 bg-cream text-espresso"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-mocha">
        {visible.length} piece{visible.length === 1 ? "" : "s"} · category feel
        for Compression, Bras, Boards & Pillows, and Bodysuits. No live
        checkout in this concept.
      </p>

      {notice ? (
        <div
          role="status"
          className="rounded-2xl border border-champagne/60 bg-cream px-4 py-3 text-sm leading-6 text-espresso"
        >
          {notice}{" "}
          <a
            className="font-semibold text-wine underline"
            href={`tel:${site.phoneTel}`}
          >
            Call
          </a>{" "}
          or{" "}
          <a
            className="font-semibold text-wine underline"
            href={site.whatsapp}
          >
            WhatsApp
          </a>
          .
        </div>
      ) : null}

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sand bg-cream px-6 py-16 text-center">
          <p className="font-display text-3xl text-espresso">
            Nothing in this edit yet
          </p>
          <p className="mt-2 text-sm text-mocha">Try another category.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              onSave={save}
              saved={saved.includes(product.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
