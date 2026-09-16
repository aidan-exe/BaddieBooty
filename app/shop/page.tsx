import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop-catalog";
import { readCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Baddie Booty compression, bras, boards & pillows, and bodysuits. Proposal concept — no live checkout.",
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
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">
        The edit
      </p>
      <h1 className="mt-3 font-display text-5xl text-espresso">
        Shop recovery wear
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-mocha">
        Clearer categories, calmer cards, and an enquire path that does not fake
        a basket. Secure checkout and South African shipping are marked as
        coming with the WooCommerce rebuild.
      </p>
      <div className="mt-10">
        <ShopCatalog category={category} />
      </div>
    </div>
  );
}
