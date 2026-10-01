import Link from "next/link";
import { Logo } from "@/components/logo";
import { PaymentMarks } from "@/components/payment-marks";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-header text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
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
                Bag
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
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-3">
        <p className="mx-auto max-w-6xl text-[11px] text-brand-mist">
          © 2026 Baddie Booty · {site.location}
        </p>
      </div>
      <div className="border-t border-white/10 px-5 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lavender">
            Payment options
          </p>
          <PaymentMarks />
        </div>
      </div>
    </footer>
  );
}
