import Image from "next/image";
import type { Product } from "@/lib/products";

export function ProductPhoto({
  product,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw",
  className = "object-cover",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <Image
      src={product.image}
      alt={product.imageAlt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
