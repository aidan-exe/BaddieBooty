import Link from "next/link";
import { ProductPhoto } from "@/components/product-photo";
import { QuickAdd } from "@/components/quick-add";
import type { Product } from "@/lib/products";
import { categoryLabel } from "@/lib/products";
import { formatZar } from "@/lib/site";

export const productGridClass =
  "grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand/80 bg-cream">
      <Link
        href={`/shop/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden bg-brand-tint"
      >
        <ProductPhoto
          product={product}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
        />
        {product.bestseller ? (
          <p className="absolute left-2 top-2 rounded-full bg-ivory/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
            Best seller
          </p>
        ) : null}
        <p className="absolute bottom-2 left-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white">
          {product.stage}
        </p>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-bright">
          {categoryLabel(product.category)}
        </p>
        <h3 className="font-display text-[15px] leading-snug text-ink">
          <Link href={`/shop/${product.slug}`} className="hover:text-brand">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto pt-1 font-display text-lg text-brand">
          {formatZar(product.price)}
        </p>
        <div className="flex gap-1.5">
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex min-h-9 flex-1 items-center justify-center rounded-full border border-ink/10 bg-ivory px-2 text-xs font-semibold text-ink"
          >
            Details
          </Link>
          <QuickAdd product={product} />
        </div>
      </div>
    </article>
  );
}
