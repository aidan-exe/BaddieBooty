import type { Metadata } from "next";
import { Poppins, Public_Sans } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { MobileDock } from "@/components/mobile-dock";
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
    default: "Baddie Booty",
    template: "%s · Baddie Booty",
  },
  description:
    "Post-op compression and shapewear from Baddie Booty in Salt Rock, KwaZulu-Natal.",
  robots: { index: false, follow: false },
  applicationName: "Baddie Booty",
  authors: [{ name: site.name }],
  icons: {
    icon: [
      { url: "/brand/favicon.ico", sizes: "any" },
      { url: "/brand/tab-icon.png", type: "image/png", sizes: "192x192" },
      { url: "/brand/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "Baddie Booty",
    description:
      "Compression, fajas, bras, boards, and pillows for recovery, from Salt Rock.",
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
      <body className="flex min-h-full flex-col bg-ivory pb-16 font-sans text-ink md:pb-0">
        <CartProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
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
