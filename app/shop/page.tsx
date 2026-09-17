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
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        The edit
      </p>
      <h1 className="mt-3 font-display text-5xl text-ink">Shop recovery wear</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
        Clearer categories, real catalogue photos, and product pages with size
        and stage. Add to a demo bag — checkout is labelled as a proposal demo
        and does not take payment.
      </p>
      <div className="mt-10">
        <ShopCatalog category={category} />
      </div>
    </div>
  );
}
