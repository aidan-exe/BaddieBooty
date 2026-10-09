import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutResult } from "@/components/checkout-result";

export const metadata: Metadata = {
  title: "Returned from PayFast",
  description: "PayFast sent you back to Baddie Booty. Your bag is unchanged.",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<p className="px-5 py-10 text-center text-sm text-muted">Loading…</p>}>
      <CheckoutResult mode="success" />
    </Suspense>
  );
}
