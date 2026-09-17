import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 text-ink"
      aria-label="Baddie Booty home"
    >
      <Image
        src="/brand/logo.png"
        alt=""
        width={1760}
        height={1333}
        className="h-11 w-auto sm:h-12"
        priority
      />
      {compact ? (
        <span className="sr-only">Baddie Booty</span>
      ) : (
        <span className="hidden leading-none sm:block">
          <span className="block font-display text-lg tracking-wide">
            Baddie Booty
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
            Recovery care
          </span>
        </span>
      )}
    </Link>
  );
}
