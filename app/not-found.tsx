import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl">That page took a rest day.</h1>
      <p className="mt-3 text-sm text-muted">
        This proposal includes Home, Shop, product pages, Bag, Demo checkout,
        About, and Contact.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex min-h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
      >
        Back home
      </Link>
    </div>
  );
}
