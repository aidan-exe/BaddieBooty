import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutResult } from "@/components/checkout-result";

export const metadata: Metadata = {
  title: "Payment cancelled",
  description: "The PayFast payment was cancelled. Your bag is unchanged.",
};

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<p className="px-5 py-10 text-center text-sm text-muted">Loading…</p>}>
      <CheckoutResult mode="cancel" />
    </Suspense>
  );
}
