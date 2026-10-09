import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { isPayfastSandbox } from "@/lib/payfast";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Guest checkout for Baddie Booty. Pay with PayFast.",
};

export default function CheckoutPage() {
  return <CheckoutForm sandbox={isPayfastSandbox()} />;
}
