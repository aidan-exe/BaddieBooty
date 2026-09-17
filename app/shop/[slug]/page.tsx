import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
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
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/shop" className="font-semibold text-brand hover:underline">
          Shop
        </Link>
        <span className="px-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-tint">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-bright">
            {categoryLabel(product.category)} · {product.stage}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 font-display text-4xl text-brand">
            {formatZar(product.price)}
          </p>
          <p className="mt-4 text-base leading-7 text-muted">{product.detail}</p>
          <ul className="mt-6 space-y-2 text-sm leading-6 text-ink">
            {product.wearNotes.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-[1.5rem] border border-sand bg-cream p-5">
            <ProductPurchase product={product} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
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
          <p className="mt-6 text-xs leading-5 text-muted">
            Recovery-care retail, not medical treatment. Follow your surgeon.
            Photo sourced from baddiebooty.co.za for this proposal.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl">You may also like</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
