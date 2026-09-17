import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        404
      </p>
      <h1 className="mt-3 font-display text-5xl">That page took a rest day.</h1>
      <p className="mt-4 text-muted">
        This proposal includes Home, Shop, product pages, Bag, Demo checkout,
        About, and Contact.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-brand px-6 text-sm font-semibold text-white"
      >
        Back home
      </Link>
    </div>
  );
}
