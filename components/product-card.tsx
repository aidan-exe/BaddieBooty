import Link from "next/link";
import { ProductArt } from "@/components/product-art";
import type { Product } from "@/lib/products";
import { formatZar } from "@/lib/site";

type ProductCardProps = {
  product: Product;
  actionHref?: string;
  actionLabel?: string;
  onSave?: (product: Product) => void;
  saved?: boolean;
};

export function ProductCard({
  product,
  actionHref = `/contact?product=${product.slug}`,
  actionLabel = "Enquire",
  onSave,
  saved = false,
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-sand/80 bg-cream shadow-[0_18px_40px_-28px_rgba(44,24,16,0.45)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductArt
          art={product.art}
          className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
        />
        {product.bestseller ? (
          <p className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-wine">
            Best seller
          </p>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose">
          {labelFor(product.category)}
        </p>
        <h3 className="font-display text-2xl leading-tight text-espresso">
          {product.name}
        </h3>
        <p className="text-sm leading-6 text-mocha">{product.blurb}</p>
        <p className="mt-auto pt-2 font-display text-3xl text-wine">
          {formatZar(product.price)}
        </p>
        <p className="text-xs text-mocha/80">
          Illustrative ZAR · checkout coming with rebuild
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={actionHref}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-wine px-4 text-sm font-semibold text-ivory transition hover:bg-espresso"
          >
            {actionLabel}
          </Link>
          {onSave ? (
            <button
              type="button"
              onClick={() => onSave(product)}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-espresso/15 bg-ivory px-4 text-sm font-semibold text-espresso transition hover:border-wine/40"
            >
              {saved ? "Saved" : "Save in preview"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function labelFor(category: Product["category"]) {
  switch (category) {
    case "compression":
      return "Compression";
    case "bras":
      return "Bras";
    case "boards-pillows":
      return "Boards & Pillows";
    case "bodysuits":
      return "Bodysuits";
  }
}
