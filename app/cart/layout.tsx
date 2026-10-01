import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bag",
  description:
    "Your Baddie Booty bag. Update quantity, remove a piece, then checkout.",
};

export default function CartLayout({ children }: LayoutProps<"/cart">) {
  return children;
}
