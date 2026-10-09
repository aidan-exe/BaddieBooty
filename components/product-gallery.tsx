"use client";

import Image from "next/image";
import { useState } from "react";
import type { CatalogImage } from "@/lib/products";

export function ProductGallery({
  images,
  name,
}: {
  images: CatalogImage[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  if (!current) {
    return <div className="aspect-[3/4] rounded-2xl bg-brand-tint" />;
  }

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-tint">
        <Image
          src={current.src}
          alt={current.alt || name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
          className={
            current.fit === "contain" ? "object-contain" : "object-cover object-top"
          }
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((image, imageIndex) => {
            const active = imageIndex === index;
            return (
              <button
                key={image.src}
                type="button"
                onClick={() => setIndex(imageIndex)}
                aria-label={image.alt || `${name} image ${imageIndex + 1}`}
                aria-current={active}
                className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-tint ${
                  active ? "ring-2 ring-brand" : "ring-1 ring-ink/10"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="56px"
                  className={
                    image.fit === "contain" ? "object-contain" : "object-cover object-top"
                  }
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
