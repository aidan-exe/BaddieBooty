import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Baddie Booty home"
      className="inline-flex shrink-0 items-center rounded-2xl bg-black/10 px-3 py-1.5 ring-2 ring-white/80"
    >
      <Image
        src="/brand/logo-wordmark.png"
        alt=""
        width={1296}
        height={484}
        preload
        className="h-9 w-auto sm:h-10"
      />
    </Link>
  );
}
