import type { Metadata } from "next";
import { ProductCopy } from "@/components/product-copy";
import { ShopCatalog } from "@/components/shop-catalog";
import { categoryDescription, categoryLabel, readCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop the Baddie Booty catalogue: post-op recovery, daily shapewear, BBL accessories, and best sellers.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = readCategory(params.category);
  const description = category === "all" ? "" : categoryDescription(category);

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            The catalogue
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink">
            {category === "all" ? "Shop" : categoryLabel(category)}
          </h1>
        </div>
        {description ? (
          <ProductCopy html={description} className="max-w-md" />
        ) : category === "all" ? (
          <p className="max-w-md text-sm leading-5 text-muted">
            Post-op recovery, daily shapewear, BBL accessories, and best sellers.
          </p>
        ) : null}
      </div>
      <div className="mt-5">
        <ShopCatalog category={category} />
      </div>
    </div>
  );
}
