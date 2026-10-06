import catalogJson from "@/data/catalog.json";

export type CatalogImage = {
  src: string;
  alt: string;
  fit: "cover" | "contain";
};

export type CatalogAttribute = {
  name: string;
  options: string[];
};

export type CatalogVariant = {
  id: number;
  attributes: Record<string, string>;
  label: string;
  price: number;
  regularPrice: number;
  salePrice: number | null;
  onSale: boolean;
  inStock: boolean;
  purchasable: boolean;
  stockText: string;
  sku: string;
};

export type CatalogCategory = {
  id: number;
  slug: string;
  name: string;
  description: string;
  parent: number;
  count: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  sourceUrl: string;
  price: number;
  regularPrice: number;
  salePrice: number | null;
  maxPrice: number;
  onSale: boolean;
  inStock: boolean;
  purchasable: boolean;
  stockText: string;
  sku: string;
  bestseller: boolean;
  category: string;
  categories: string[];
  shortDescription: string;
  description: string;
  images: CatalogImage[];
  image: string;
  imageAlt: string;
  attributes: CatalogAttribute[];
  variants: CatalogVariant[];
  sizes: string[];
};

export type Catalog = {
  source: string;
  syncedAt: string;
  liveProductCount: number;
  liveCategoryCount: number;
  categories: CatalogCategory[];
  products: Product[];
  unmirrored: { product: string; url?: string; reason: string }[];
};

export const catalog = catalogJson as Catalog;

export const categories = [
  { id: "all", label: "All", description: "" },
  ...catalog.categories.map((category) => ({
    id: category.slug,
    label: category.name,
    description: category.description,
  })),
];

export const products: Product[] = catalog.products;

export function readCategory(value: string | null | undefined) {
  if (!value || value === "all") return "all";
  return categories.some((item) => item.id === value) ? value : "all";
}

export function bestsellers() {
  return products.filter((product) => product.bestseller);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function categoryLabel(slug: string) {
  return categories.find((category) => category.id === slug)?.label ?? slug;
}

export function categoryDescription(slug: string) {
  return categories.find((category) => category.id === slug)?.description ?? "";
}

export function relatedProducts(slug: string, limit = 3) {
  const current = getProduct(slug);
  if (!current) return products.slice(0, limit);
  const same = products.filter(
    (product) => product.slug !== slug && product.category === current.category,
  );
  const rest = products.filter(
    (product) => product.slug !== slug && product.category !== current.category,
  );
  return [...same, ...rest].slice(0, limit);
}

export function defaultVariant(product: Product) {
  return (
    product.variants.find((variant) => variant.purchasable && variant.inStock) ??
    product.variants[0]
  );
}

export function variantFor(product: Product, selected: Record<string, string>) {
  if (product.attributes.length === 0) return product.variants[0];
  return product.variants.find((variant) =>
    product.attributes.every(
      (attribute) => variant.attributes[attribute.name] === selected[attribute.name],
    ),
  );
}

export function lineUnitPrice(product: Product, size: string) {
  return product.variants.find((variant) => variant.label === size)?.price ?? product.price;
}

export function plainText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(Number(num)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}
