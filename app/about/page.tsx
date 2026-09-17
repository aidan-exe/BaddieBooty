import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Proposal copy for Baddie Booty — a Salt Rock recovery-care studio for compression and shapewear.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
        The studio
      </p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
        Built for baddies in recovery.
      </h1>
      <div className="relative mt-5 overflow-hidden rounded-2xl bg-brand">
        <Image
          src="/brand/logo.png"
          alt="Baddie Booty logo — Curvas Ampulheta"
          width={1760}
          height={1333}
          className="mx-auto h-auto w-full max-w-xs"
        />
      </div>
      <div className="mt-5 space-y-3 text-sm leading-6 text-muted">
        <p>
          Baddie Booty is a post-op compression and shapewear studio in{" "}
          {site.location}. The voice is warm on purpose: Hey Baddie — because
          recovery is already a lot, and the wardrobe should feel like backup,
          not a lecture.
        </p>
        <p>
          This about page is proposal copy written for a concept site. It keeps
          the brand’s care, curves, and catalogue energy without repeating the
          live store word-for-word, and without inventing clinical results.
        </p>
        <p>
          The pieces span post-surgery fajas, compression bras, abdominal
          boards, BBL pillows, bodysuits, and later-stage waist trainers. Some
          baddies are newly post-op. Some want daily shapewear. The shop should
          make that difference obvious on a phone.
        </p>
      </div>

      <section className="mt-8 rounded-2xl bg-cream p-5">
        <h2 className="font-display text-2xl text-ink">What we will not claim</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Compression can feel supportive. It is not a guarantee of surgical
          outcome, circulation change, or risk reduction. Follow your surgeon.
          Baddie Booty is recovery-care retail — a studio that helps you choose
          garments, not a clinic.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-2xl">Why rebuild the site</h2>
        <p className="text-sm leading-6 text-muted">
          The live store already has the heart. A paid engagement would carry
          that catalogue into a calmer Next.js shop: exact brand purple, real
          photography, product pages, a working bag, and South African shipping
          — replacing the current WooCommerce friction without losing the Baddie
          voice.
        </p>
        <p className="text-sm leading-6 text-muted">
          This preview stops before payments on purpose. Owner Tiara can walk
          the pages, feel the tone, and decide what a rebuild should include.
        </p>
      </section>

      <Link
        href="/contact"
        className="mt-6 inline-flex min-h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
      >
        Talk through a rebuild
      </Link>
    </div>
  );
}
