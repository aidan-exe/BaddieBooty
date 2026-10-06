import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard, productGridClass } from "@/components/product-card";
import { ProductCopy } from "@/components/product-copy";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import {
  categoryLabel,
  getProduct,
  plainText,
  products,
  relatedProducts,
} from "@/lib/products";
import { site } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Piece not found" };
  const description =
    plainText(product.shortDescription) || plainText(product.description) || product.name;
  return {
    title: product.name,
    description: description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = relatedProducts(product.slug);

  return (
    <div className="mx-auto max-w-6xl px-5 py-6">
      <nav className="text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/shop" className="font-semibold text-brand hover:underline">
          Shop
        </Link>
        {product.category ? (
          <>
            <span className="px-2">/</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="font-semibold text-brand hover:underline"
            >
              {categoryLabel(product.category)}
            </Link>
          </>
        ) : null}
        <span className="px-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-16">
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
            {product.categories.map((slug, index) => (
              <span key={slug}>
                {index > 0 ? <span className="px-1.5 text-sand">·</span> : null}
                <Link href={`/shop?category=${slug}`} className="hover:underline">
                  {categoryLabel(slug)}
                </Link>
              </span>
            ))}
          </p>
          <h1 className="mt-1.5 font-display text-3xl leading-tight text-ink">
            {product.name}
          </h1>
          {product.shortDescription ? (
            <ProductCopy html={product.shortDescription} className="mt-3 text-ink" />
          ) : null}
          <div className="mt-5 rounded-2xl border border-sand bg-cream p-4">
            <ProductPurchase product={product} />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand underline-offset-4 hover:underline"
            >
              WhatsApp for size help
            </a>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">
            Recovery-care retail, not medical treatment. Follow your surgeon.
          </p>
        </div>
      </div>

      {product.description ? (
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-2xl text-ink">Description</h2>
          <ProductCopy html={product.description} className="mt-3" />
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-2xl">You may also like</h2>
        <div className={`mt-4 ${productGridClass}`}>
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
