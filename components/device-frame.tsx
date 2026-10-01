import Image from "next/image";

export function DeviceFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="mx-auto w-full max-w-3xl">
      <div className="rounded-[1.35rem] bg-ink p-2 shadow-[0_16px_40px_rgba(28,26,27,0.16)] sm:p-3">
        <div className="mb-2 flex items-center gap-1.5 px-1.5">
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-brand-tint">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover object-top"
          />
        </div>
      </div>
      <div className="mx-auto h-3 w-28 rounded-b-xl bg-ink sm:w-40" />
      <div className="mx-auto h-1.5 w-44 rounded-b-md bg-[#3a3538] sm:w-64" />
    </figure>
  );
}
