import type { Product } from "@/lib/products";
import { formatZar } from "@/lib/site";

export function ProductPrice({ product }: { product: Product }) {
  if (product.maxPrice > product.price) {
    return (
      <span>
        {formatZar(product.price)} – {formatZar(product.maxPrice)}
      </span>
    );
  }
  if (product.onSale && product.regularPrice > product.price) {
    return (
      <span>
        <span className="mr-2 text-base text-muted line-through">
          {formatZar(product.regularPrice)}
        </span>
        {formatZar(product.price)}
      </span>
    );
  }
  return <span>{formatZar(product.price)}</span>;
}
