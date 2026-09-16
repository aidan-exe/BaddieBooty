import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Baddie Booty in Salt Rock, KwaZulu-Natal — phone, email, and a concept enquiry form.",
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
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">
        Salt Rock studio
      </p>
      <h1 className="mt-3 font-display text-5xl text-espresso">
        Come through, Baddie.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-mocha">
        Call, WhatsApp, or email the studio. The form on this page is a
        client-side UI only — it does not hit a server.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="h-fit space-y-5 rounded-[1.75rem] bg-espresso p-6 text-ivory sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
              Location
            </p>
            <p className="mt-2 text-lg">{site.location}</p>
            <p className="text-sm text-blush">{site.country}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-champagne">
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
            className="inline-flex min-h-12 items-center rounded-full bg-ivory px-5 text-sm font-semibold text-wine"
          >
            Open WhatsApp
          </a>
        </aside>
          <ContactForm initialProduct={initialProduct} />
      </div>
    </div>
  );
}
