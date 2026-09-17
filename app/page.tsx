import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { bestsellers } from "@/lib/products";
import { site } from "@/lib/site";

const trust = [
  {
    title: "Salt Rock studio",
    body: "A South African shop you can actually call — not a faceless marketplace.",
  },
  {
    title: "Stage-aware edit",
    body: "Fajas, bras, boards, and pillows labelled by recovery stage.",
  },
  {
    title: "Talk to Tiara",
    body: "WhatsApp-ready sizing help before you commit to a hold.",
  },
  {
    title: "Demo bag, real UX",
    body: "Add, update qty, remove. Payments wait for a paid rebuild.",
  },
];

const benefits = [
  {
    title: "Holds your curves",
    body: "Compression that follows a real body — photographed from her current catalogue, not a generic mannequin story.",
  },
  {
    title: "Rest, then rise",
    body: "Boards and pillows for how you sit, lie, and move through early days.",
  },
  {
    title: "Stage by stage",
    body: "Bras, fajas, bodysuits, and trainers as your wardrobe changes. No invented clinical results.",
  },
  {
    title: "A person on the line",
    body: "Questions about size or staging go to the studio, not a chatbot.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden px-5 pb-16 pt-10 sm:pt-16">
        <div className="pointer-events-none absolute -right-16 top-8 h-72 w-72 rounded-full bg-lavender/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-brand-tint blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
              Post-op compression · {site.location}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] text-ink sm:text-7xl">
              {site.greeting}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Soft structure for recovery. High-quality compression and
              shapewear that fit every defined curve — with a calmer shop,
              clearer product pages, and a bag you can actually use on a phone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-7 text-sm font-semibold text-white"
              >
                Shop the edit
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink/15 bg-cream px-7 text-sm font-semibold"
              >
                Talk to Tiara
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-brand-header shadow-2xl">
              <div className="relative aspect-[5/4]">
                <Image
                  src="/brand/studio-raina.jpg"
                  alt="Baddie Booty studio photography from the live store"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-white sm:p-8">
                <p className="font-display text-3xl leading-tight">
                  Recovery care, not chaos.
                </p>
                <p className="mt-3 text-sm leading-6 text-lavender">
                  Same Baddie voice and catalogue photos — rebuilt so pieces are
                  easy to find, trust, and bag. Live payments stay on the
                  current store until a paid rebuild.
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-brand-mist">Studio</dt>
                    <dd className="mt-1 font-semibold">Salt Rock</dd>
                  </div>
                  <div>
                    <dt className="text-brand-mist">Care line</dt>
                    <dd className="mt-1 font-semibold">{site.phoneDisplay}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sand bg-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item) => (
            <div key={item.title}>
              <div className="mb-3 h-1.5 w-12 rounded-full bg-brand" />
              <p className="font-display text-xl text-brand-header">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Our best sellers
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">
              The recovery wardrobe
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-brand underline-offset-4 hover:underline"
          >
            View all pieces
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {bestsellers()
            .slice(0, 6)
            .map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                priority={index < 2}
              />
            ))}
        </div>
      </section>

      <section className="bg-brand-header px-5 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lavender">
            Why baddies stay
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl sm:text-5xl">
            Recovery benefits, said like a friend.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {benefits.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-lavender">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-brand-mist">
            Garments here are recovery-care products, not medical treatment.
            Always follow your surgeon or practitioner. This proposal does not
            make clinical promises.
          </p>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-brand px-6 py-10 text-white sm:flex-row sm:items-center sm:px-10">
          <div>
            <h2 className="font-display text-4xl">Ready when you are, Baddie.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-lavender">
              Open a product, add it to the demo bag, then message the studio.
              Cards and courier rates land with the paid rebuild.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center rounded-full bg-white px-7 text-sm font-semibold text-brand"
          >
            Start in the shop
          </Link>
        </div>
      </section>
    </div>
  );
}
