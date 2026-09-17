"use client";

import { FormEvent, useState } from "react";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

export function ContactForm({ initialProduct = "" }: { initialProduct?: string }) {
  const selected = products.some((product) => product.slug === initialProduct)
    ? initialProduct
    : "";
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setName(String(data.get("name") || "Baddie"));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sand bg-cream px-5 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
          Concept form
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink">
          Thanks, {name}. Nothing was sent.
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          This is a client-side preview only. Nothing is sent to an inbox. Reach Tiara
          on {site.phoneDisplay} or {site.email} for a real conversation.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 inline-flex min-h-10 items-center rounded-full border border-ink/15 px-5 text-sm font-semibold"
        >
          Reset preview form
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border border-sand bg-cream p-4 sm:p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        Preview enquiry
      </p>
      <p className="text-sm leading-6 text-muted">
        Looks like a real form. It does not send. Use call, WhatsApp, or email
        for the studio.
      </p>
      <label className="block space-y-1.5 text-sm font-medium text-ink">
        Name
        <input
          required
          name="name"
          autoComplete="name"
          className="min-h-10 w-full rounded-xl border border-ink/10 bg-ivory px-4 text-base font-normal outline-none ring-brand/30 focus:ring-2"
        />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-ink">
        Email
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="min-h-10 w-full rounded-xl border border-ink/10 bg-ivory px-4 text-base font-normal outline-none ring-brand/30 focus:ring-2"
        />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-ink">
        Phone
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          className="min-h-10 w-full rounded-xl border border-ink/10 bg-ivory px-4 text-base font-normal outline-none ring-brand/30 focus:ring-2"
        />
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-ink">
        Piece you are curious about
        <select
          name="product"
          defaultValue={selected}
          className="min-h-10 w-full rounded-xl border border-ink/10 bg-ivory px-4 text-base font-normal outline-none ring-brand/30 focus:ring-2"
        >
          <option value="">Not sure yet</option>
          {products.map((product) => (
            <option key={product.slug} value={product.slug}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5 text-sm font-medium text-ink">
        Message
        <textarea
          required
          name="message"
          rows={5}
          className="w-full rounded-xl border border-ink/10 bg-ivory px-4 py-2.5 text-base font-normal outline-none ring-brand/30 focus:ring-2"
          placeholder="Tell Tiara where you are in recovery. No medical details required."
        />
      </label>
      <button
        type="submit"
        className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-brand text-sm font-semibold text-white sm:w-auto sm:px-8"
      >
        Show preview confirmation
      </button>
    </form>
  );
}
