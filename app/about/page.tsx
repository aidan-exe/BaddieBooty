import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Baddie Booty is a Salt Rock studio for post-op compression and shapewear.",
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
      <div className="mt-5 overflow-hidden rounded-2xl bg-brand px-6 py-8">
        <Image
          src="/brand/logo-wordmark.png"
          alt="Baddie Booty logo, Curvas Ampulheta"
          width={1296}
          height={484}
          className="mx-auto h-16 w-auto sm:h-20"
        />
      </div>
      <div className="mt-5 space-y-3 text-sm leading-6 text-muted">
        <p>
          Baddie Booty is a post-op compression and shapewear studio in{" "}
          {site.location}. The voice is warm on purpose. Recovery is already a
          lot, so the wardrobe should feel like backup, not a lecture.
        </p>
        <p>
          The pieces span post-surgery fajas, compression bras, abdominal
          boards, BBL pillows, bodysuits, and later stage waist trainers. Some
          baddies are newly post-op. Some want daily shapewear. The shop makes
          that difference obvious on a phone.
        </p>
      </div>

      <section className="mt-8 rounded-2xl bg-cream p-5">
        <h2 className="font-display text-2xl text-ink">What we will not claim</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Compression can feel supportive. It is not a guarantee of surgical
          outcome, circulation change, or risk reduction. Follow your surgeon.
          Baddie Booty is recovery care retail: a studio that helps you choose
          garments, not a clinic.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="font-display text-2xl">Talk to the studio</h2>
        <p className="text-sm leading-6 text-muted">
          Size, stage, and pairing questions go to Tiara. Call, WhatsApp, or
          email {site.email}. The shop is here when you are ready to choose.
        </p>
      </section>

      <Link
        href="/contact"
        className="mt-6 inline-flex min-h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
      >
        Contact the studio
      </Link>
    </div>
  );
}
