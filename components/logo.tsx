import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3 text-espresso"
      aria-label="Baddie Booty home"
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-wine text-ivory shadow-sm">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <path
            d="M8 22c4-9 12-9 16 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M10 14c2.4-4.5 9.6-4.5 12 0"
            fill="none"
            stroke="#E8B4B8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-[1.65rem] tracking-wide">
          Baddie Booty
        </span>
        {compact ? null : (
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-rose">
            Recovery care
          </span>
        )}
      </span>
    </Link>
  );
}
