import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Baddie Booty uses checkout details to deliver an order.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-display text-3xl">Privacy</h1>
      <div className="mt-4 space-y-4 text-sm leading-6 text-muted">
        <p>
          Guest checkout collects your name, contact details, delivery address, and order notes
          so the Salt Rock studio can pack and send the order. Card numbers stay with PayFast.
          This shop never receives them.
        </p>
        <p>
          The bag stays in this browser under the key baddie-booty-cart-v1. Checkout details
          stay under baddie-booty-checkout-v1 so the form can be filled in again on this device.
          Clearing site data removes both.
        </p>
        <p>
          PayFast sends a server notification when a payment is confirmed, cancelled, or fails.
          That notification, together with the order details, is written to the application log
          so the studio can fulfil the order.
        </p>
        <p>
          Questions go to{" "}
          <a className="font-semibold text-brand" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          or {site.phoneDisplay}.
        </p>
      </div>
    </div>
  );
}
