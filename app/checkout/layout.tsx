import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout at Baddie Booty. This form does not charge a card.",
};

export default function CheckoutLayout({
  children,
}: LayoutProps<"/checkout">) {
  return children;
}
