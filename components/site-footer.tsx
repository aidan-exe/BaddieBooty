import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-header text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-3">
        <div className="space-y-3">
          <Image
            src="/brand/logo-long.png"
            alt="Baddie Booty"
            width={1313}
            height={525}
            className="h-9 w-auto brightness-0 invert"
          />
          <p className="max-w-sm text-sm leading-5 text-lavender">
            Compression, fajas, bras, boards, and pillows for recovery, from a
            Salt Rock studio that calls you Baddie on purpose.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-mist">
            Browse
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories
              .filter((category) => category.id !== "all")
              .map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/shop?category=${category.id}`}
                    className="hover:text-lavender"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/about" className="hover:text-lavender">
                About the brand
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-lavender">
                Demo bag
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-mist">
            Studio
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6">
            <li>{site.location}</li>
            <li>
              <a className="hover:text-lavender" href={`tel:${site.phoneTel}`}>
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-lavender" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a
                className="hover:text-lavender"
                href={site.liveStore}
                target="_blank"
                rel="noreferrer"
              >
                Live store (current)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4">
        <div className="mx-auto max-w-6xl space-y-2 text-sm leading-5 text-lavender">
          <p className="rounded-xl bg-white/10 px-3 py-3 text-white">
            This website is a <strong>proposal concept</strong> by{" "}
            {site.designer} for Baddie Booty (owner Tiara). It is{" "}
            <strong>not the live store</strong>. A WooCommerce rebuild with
            secure checkout, payments, and South African shipping is a{" "}
            <strong>paid engagement</strong>, not included in this preview.
          </p>
          <p className="text-xs text-brand-mist">
            Product photos, logo, and lifestyle images are Baddie Booty brand
            assets sourced from baddiebooty.co.za for this client proposal only.
            Catalogue names and ZAR prices follow the current shop.
          </p>
        </div>
      </div>
    </footer>
  );
}
