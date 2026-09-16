"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Logo compact />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-wine text-ivory"
                    : "text-espresso hover:bg-sand/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`tel:${site.phoneTel}`}
            className="inline-flex min-h-11 items-center rounded-full border border-espresso/15 px-4 text-sm font-semibold text-espresso"
          >
            Call
          </a>
          <a
            href={site.whatsapp}
            className="inline-flex min-h-11 items-center rounded-full bg-wine px-4 text-sm font-semibold text-ivory"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-espresso/15 bg-cream lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="flex flex-col gap-1.5" aria-hidden="true">
            <span
              className={`block h-0.5 w-5 bg-espresso transition ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-espresso transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-espresso transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>
      {open ? (
        <div
          id={menuId}
          className="border-t border-sand bg-ivory px-5 py-6 lg:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-12 items-center rounded-2xl bg-cream px-4 text-base font-semibold text-espresso"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${site.phoneTel}`}
              className="flex min-h-12 items-center rounded-2xl bg-wine px-4 text-base font-semibold text-ivory"
            >
              Call {site.phoneDisplay}
            </a>
            <a
              href={site.whatsapp}
              className="flex min-h-12 items-center rounded-2xl border border-wine/30 px-4 text-base font-semibold text-wine"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Tiara
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
