import type { Metadata } from "next";
import { Poppins, Public_Sans } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { MobileDock } from "@/components/mobile-dock";
import { ProposalBanner } from "@/components/proposal-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Baddie Booty — Proposal Concept",
    template: "%s · Baddie Booty",
  },
  description:
    "A proposal concept website by Aidan for Baddie Booty: post-op compression and shapewear from Salt Rock, KwaZulu-Natal. Not the live store.",
  robots: { index: false, follow: false },
  applicationName: "Baddie Booty Proposal",
  authors: [{ name: site.designer }],
  openGraph: {
    title: "Baddie Booty — Proposal Concept",
    description:
      "Fresh take on the Baddie Booty shop experience — recovery-care, clearer UX, demo bag only.",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      className={`${publicSans.variable} ${publicSans.className} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory pb-24 font-sans text-ink md:pb-0">
        <CartProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <ProposalBanner />
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MobileDock />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
