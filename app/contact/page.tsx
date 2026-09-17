import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Baddie Booty in Salt Rock, KwaZulu-Natal. Phone, email, and a concept enquiry form.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  const slug = params.product ?? "";
  const initialProduct = products.some((product) => product.slug === slug)
    ? slug
    : "";
  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
        Salt Rock studio
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        Come through, Baddie.
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Call, WhatsApp, or email the studio. The form on this page is a
        client-side UI only. It does not hit a server.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="h-fit space-y-4 rounded-2xl bg-brand-header p-5 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender">
              Location
            </p>
            <p className="mt-2 text-lg">{site.location}</p>
            <p className="text-sm text-brand-mist">{site.country}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender">
              Phone
            </p>
            <a
              href={`tel:${site.phoneTel}`}
              className="mt-2 block text-lg underline-offset-4 hover:underline"
            >
              {site.phoneDisplay}
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lavender">
              Email
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 block text-lg underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
          </div>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-brand"
          >
            Open WhatsApp
          </a>
        </aside>
        <ContactForm initialProduct={initialProduct} />
      </div>
    </div>
  );
}
