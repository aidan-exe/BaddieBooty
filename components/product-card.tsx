import Link from "next/link";
import { ProductPhoto } from "@/components/product-photo";
import { QuickAdd } from "@/components/quick-add";
import type { Product } from "@/lib/products";
import { categoryLabel } from "@/lib/products";
import { formatZar } from "@/lib/site";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-sand/80 bg-cream shadow-[0_18px_40px_-28px_rgba(28,26,27,0.45)]">
      <Link
        href={`/shop/${product.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-brand-tint"
      >
        <ProductPhoto
          product={product}
          priority={priority}
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {product.bestseller ? (
          <p className="absolute left-4 top-4 rounded-full bg-ivory/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            Best seller
          </p>
        ) : null}
        <p className="absolute bottom-4 left-4 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">
          {product.stage}
        </p>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-bright">
          {categoryLabel(product.category)}
        </p>
        <h3 className="font-display text-xl leading-tight text-ink">
          <Link href={`/shop/${product.slug}`} className="hover:text-brand">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm leading-6 text-muted">{product.blurb}</p>
        <p className="mt-auto pt-2 font-display text-2xl text-brand">
          {formatZar(product.price)}
        </p>
        <p className="text-xs text-muted">ZAR · demo bag, no live payment</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-ink/10 bg-ivory px-4 text-sm font-semibold text-ink transition hover:border-brand/40"
          >
            View details
          </Link>
          <QuickAdd product={product} />
        </div>
      </div>
    </article>
  );
}
