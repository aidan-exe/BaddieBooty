import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop-catalog";
import { readCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Baddie Booty compression, bras, boards & pillows, and bodysuits. Proposal concept — demo bag only.",
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
          Real catalogue photos. Demo bag only — no live payment.
        </p>
      </div>
      <div className="mt-5">
        <ShopCatalog category={category} />
      </div>
    </div>
  );
}
