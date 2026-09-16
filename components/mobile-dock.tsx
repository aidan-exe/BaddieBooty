import Link from "next/link";
import { site } from "@/lib/site";

export function MobileDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-ivory/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/shop"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-wine text-sm font-semibold text-ivory"
        >
          Shop
        </Link>
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-espresso/15 text-sm font-semibold"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
