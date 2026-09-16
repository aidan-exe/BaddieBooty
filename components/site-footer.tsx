import Link from "next/link";
import { Logo } from "@/components/logo";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-espresso text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <div className="brightness-0 invert">
            <Logo />
          </div>
          <p className="max-w-sm text-sm leading-6 text-blush">
            Compression, fajas, bras, boards, and pillows for recovery — from a
            Salt Rock studio that calls you Baddie on purpose.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
            Browse
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories
              .filter((category) => category.id !== "all")
              .map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/shop?category=${category.id}`}
                    className="hover:text-blush"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/about" className="hover:text-blush">
                About the brand
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne">
            Studio
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6">
            <li>{site.location}</li>
            <li>
              <a className="hover:text-blush" href={`tel:${site.phoneTel}`}>
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-blush" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a
                className="hover:text-blush"
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
      <div className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto max-w-6xl space-y-3 text-sm leading-6 text-blush">
          <p className="rounded-2xl bg-white/5 px-4 py-4 text-ivory">
            This website is a <strong>proposal concept</strong> by{" "}
            {site.designer} for Baddie Booty (owner Tiara). It is{" "}
            <strong>not the live store</strong>. A WooCommerce rebuild with
            secure checkout, payments, and South African shipping is a{" "}
            <strong>paid engagement</strong> — not included in this preview.
          </p>
          <p className="text-xs text-blush/80">
            Product names and illustrative ZAR prices follow the current
            catalogue feel. Photography is original CSS/SVG placeholder art —
            no live-store images were copied.
          </p>
        </div>
      </div>
    </footer>
  );
}
