"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { CartIconButton } from "@/components/add-to-cart";
import { Logo } from "@/components/logo";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const menuId = useId();

  function setOpen(next: boolean) {
    setOpenPath(next ? pathname : null);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPath(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-2">
        <Logo compact />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-9 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-brand text-white"
                    : "text-ink hover:bg-brand-tint"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={site.whatsapp}
            className="hidden min-h-9 items-center rounded-full bg-brand px-3 text-sm font-semibold text-white lg:inline-flex"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <CartIconButton />
          <button
            type="button"
            className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-ink/10 bg-cream lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="flex flex-col gap-1.5" aria-hidden="true">
              <span
                className={`block h-0.5 w-5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>
      {open ? (
        <div
          id={menuId}
          className="border-t border-sand bg-ivory px-5 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-1.5" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-10 items-center rounded-xl bg-cream px-4 text-sm font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${site.phoneTel}`}
              className="flex min-h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white"
            >
              Call {site.phoneDisplay}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
