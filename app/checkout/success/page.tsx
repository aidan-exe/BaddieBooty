import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutResult } from "@/components/checkout-result";

export const metadata: Metadata = {
  title: "Order received",
  description: "PayFast has returned you from the Baddie Booty payment page.",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p className="px-5 py-10 text-center text-sm text-muted">Loading order…</p>}>
      <CheckoutResult mode="success" />
    </Suspense>
  );
}
