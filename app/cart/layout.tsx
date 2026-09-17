import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bag",
  description:
    "Demo shopping bag for the Baddie Booty proposal. Quantity, remove, no live payment.",
};

export default function CartLayout({ children }: LayoutProps<"/cart">) {
  return children;
}
