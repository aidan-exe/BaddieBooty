import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo checkout",
  description:
    "Proposal demo checkout for Baddie Booty — does not process payment.",
};

export default function CheckoutLayout({
  children,
}: LayoutProps<"/checkout">) {
  return children;
}
