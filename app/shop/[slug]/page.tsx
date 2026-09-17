import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard, productGridClass } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import {
  categoryLabel,
  getProduct,
  products,
  relatedProducts,
} from "@/lib/products";
import { formatZar, site } from "@/lib/site";

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
  return {
    title: product.name,
    description: product.blurb,
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
        <span className="px-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative h-[22rem] overflow-hidden rounded-2xl bg-brand-tint lg:sticky lg:top-16 lg:h-[28rem]">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-top"
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
            {categoryLabel(product.category)} · {product.stage}
          </p>
          <h1 className="mt-1.5 font-display text-3xl leading-tight text-ink">
            {product.name}
          </h1>
          <p className="mt-2 font-display text-3xl text-brand">
            {formatZar(product.price)}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">{product.detail}</p>
          <ul className="mt-4 space-y-1.5 text-sm leading-5 text-ink">
            {product.wearNotes.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
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
            <span className="text-brand-mist">·</span>
            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted underline-offset-4 hover:underline"
            >
              Live store listing
            </a>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">
            Recovery-care retail, not medical treatment. Follow your surgeon.
            Photo sourced from baddiebooty.co.za for this proposal.
          </p>
        </div>
      </div>

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
