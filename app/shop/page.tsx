import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop-catalog";
import { readCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Baddie Booty compression, bras, boards, pillows, and bodysuits.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = readCategory(params.category);

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            The edit
          </p>
          <h1 className="mt-1 font-display text-3xl text-ink">Shop recovery wear</h1>
        </div>
        <p className="max-w-md text-sm leading-5 text-muted">
          Compression, bras, boards, and bodysuits for recovery days.
        </p>
      </div>
      <div className="mt-5">
        <ShopCatalog category={category} />
      </div>
    </div>
  );
}
