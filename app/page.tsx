import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { bestsellers } from "@/lib/products";
import { site } from "@/lib/site";

const benefits = [
  {
    title: "Holds your curves",
    body: "Catalogue photos of real compression, not a generic mannequin story.",
  },
  {
    title: "Rest, then rise",
    body: "Boards and pillows for how you sit, lie, and move through early days.",
  },
  {
    title: "Stage by stage",
    body: "Bras, fajas, bodysuits, and trainers as the wardrobe changes.",
  },
  {
    title: "A person on the line",
    body: "Size or staging questions go to the studio, not a chatbot.",
  },
];

const heroShots = [
  {
    href: "/shop/full-body-post-surgery-seamless-faja",
    src: "/products/seamless-faja.png",
    alt: "Full Body Post-Surgery Seamless Faja",
  },
  {
    href: "/shop/post-surgical-compression-bra",
    src: "/products/compression-bra.jpg",
    alt: "Post-surgical compression bra",
  },
  {
    href: "/shop/high-compression-stage-3-waist-trainer",
    src: "/products/waist-trainer.jpg",
    alt: "Stage 3 waist trainer",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="px-5 pb-6 pt-6 sm:pt-8">
        <div className="mx-auto grid max-w-6xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Post-op compression · {site.location}
            </p>
            <h1 className="mt-2 font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
              {site.greeting}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
              Compression and shapewear for every defined curve. Calmer shop,
              real photos, a bag you can use on a phone.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/shop"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
              >
                Shop the edit
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-ink/15 bg-cream px-5 text-sm font-semibold"
              >
                Talk to Tiara
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {heroShots.map((shot) => (
              <Link
                key={shot.href}
                href={shot.href}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-tint"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 33vw, 18vw"
                  className="object-cover object-top"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Best sellers
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl">
              Shop the recovery wardrobe
            </h2>
          </div>
          <Link
            href="/shop"
            className="shrink-0 text-sm font-semibold text-brand underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {bestsellers()
            .slice(0, 8)
            .map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                priority={index < 4}
              />
            ))}
        </div>
      </section>

      <section className="bg-brand-header px-5 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl sm:text-3xl">
            Recovery care, said like a friend.
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <h3 className="font-display text-lg">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-lavender">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-brand-mist">
            Recovery-care products, not medical treatment. Follow your surgeon.
            This proposal does not make clinical promises.
          </p>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 rounded-2xl bg-brand px-5 py-6 text-white sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="font-display text-2xl">Ready when you are, Baddie.</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-lavender">
              Open a product, add it to the demo bag. Cards and courier rates
              land with the paid rebuild.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex min-h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-brand"
          >
            Start in the shop
          </Link>
        </div>
      </section>
    </div>
  );
}
