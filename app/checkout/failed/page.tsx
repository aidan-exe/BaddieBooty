import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutResult } from "@/components/checkout-result";

export const metadata: Metadata = {
  title: "Payment failed",
  description: "PayFast did not complete this Baddie Booty payment.",
};

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={<p className="px-5 py-10 text-center text-sm text-muted">Loading…</p>}>
      <CheckoutResult mode="failed" />
    </Suspense>
  );
}
