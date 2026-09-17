"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { site } from "@/lib/site";

export function MobileDock() {
  const { itemCount, openDrawer, ready } = useCart();
  const count = ready ? itemCount : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-ivory/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-3 gap-2">
        <Link
          href="/shop"
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
        >
          Shop
        </Link>
        <button
          type="button"
          onClick={openDrawer}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-ink/10 text-sm font-semibold"
        >
          Bag{count > 0 ? ` · ${count}` : ""}
        </button>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-ink/10 text-sm font-semibold"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
