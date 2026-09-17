import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bag",
  description:
    "Demo shopping bag for the Baddie Booty proposal — quantity, remove, no live payment.",
};

export default function CartLayout({ children }: LayoutProps<"/cart">) {
  return children;
}
