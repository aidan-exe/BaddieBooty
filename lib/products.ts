export const categories = [
  { id: "all", label: "All" },
  { id: "compression", label: "Compression" },
  { id: "bras", label: "Bras" },
  { id: "boards-pillows", label: "Boards & Pillows" },
  { id: "bodysuits", label: "Bodysuits" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type ProductArt =
  | "ab-board"
  | "bra"
  | "pillow"
  | "faja"
  | "board"
  | "bodysuit"
  | "levanta"
  | "trainer";

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: Exclude<CategoryId, "all">;
  art: ProductArt;
  bestseller: boolean;
  blurb: string;
  detail: string;
};

export const products: Product[] = [
  {
    slug: "post-surgery-liposuction-ab-board",
    name: "Post Surgery Liposuction AB Board",
    price: 600,
    category: "boards-pillows",
    art: "ab-board",
    bestseller: true,
    blurb: "A firm abdominal board for structured rest while you recover.",
    detail:
      "Designed to sit smoothly under a faja. Proposal preview — sizes and fit notes would be confirmed with Tiara before a live rebuild.",
  },
  {
    slug: "post-surgical-compression-bra",
    name: "Post-Surgical Compression Bra & Posture Corrector",
    price: 699,
    category: "bras",
    art: "bra",
    bestseller: true,
    blurb: "Soft, steady support across the chest and upper back.",
    detail:
      "A recovery-care bra with a posture-minded cut. This concept card uses placeholder art, not live product photography.",
  },
  {
    slug: "butt-lift-support-pillow",
    name: "Butt Lift Support Pillow",
    price: 950,
    category: "boards-pillows",
    art: "pillow",
    bestseller: true,
    blurb: "A shaped cushion for sitting more comfortably after a BBL.",
    detail:
      "Meant for how you sit at home — not a medical device. Follow your surgeon’s sitting guidance first.",
  },
  {
    slug: "full-body-post-surgery-seamless-faja",
    name: "Full Body Post-Surgery Seamless Faja",
    price: 800,
    category: "compression",
    art: "faja",
    bestseller: true,
    blurb: "Seamless full-body compression that follows every defined curve.",
    detail:
      "A studio staple for post-op days. Live checkout, variants, and South African shipping arrive with a paid WooCommerce rebuild.",
  },
  {
    slug: "post-surgery-abdominal-compression-board",
    name: "Post Surgery Abdominal Compression Board",
    price: 600,
    category: "boards-pillows",
    art: "board",
    bestseller: false,
    blurb: "A second board option for abdominal compression and rest.",
    detail:
      "Pair with a faja for a smoother front. Prices shown are illustrative placeholders for this proposal.",
  },
  {
    slug: "extreme-tummy-control-girdle-bodysuit",
    name: "Extreme Tummy Control Girdle Corset Bodysuit",
    price: 800,
    category: "bodysuits",
    art: "bodysuit",
    bestseller: true,
    blurb: "A sculpting bodysuit with firm tummy control for later-stage wear.",
    detail:
      "Closer to daily shapewear energy — still recovery-aware. Not a substitute for clinical advice.",
  },
  {
    slug: "levanta-cola-compression-faja",
    name: "Levanta Cola Compression Faja (Mid-Thigh)",
    price: 750,
    category: "compression",
    art: "levanta",
    bestseller: false,
    blurb: "Mid-thigh faja with a lift-minded cut through the hips.",
    detail:
      "From the current shop feel. Placeholder price for this concept preview.",
  },
  {
    slug: "high-compression-stage-3-waist-trainer",
    name: "High Compression Stage 3 Waist Trainer",
    price: 1190,
    category: "compression",
    art: "trainer",
    bestseller: true,
    blurb: "Stage 3 waist training with a cinched, hourglass-minded hold.",
    detail:
      "Intended for later recovery stages when your practitioner says you are ready. Confirm staging with your care team.",
  },
];

export function readCategory(value: string | null | undefined): CategoryId {
  return categories.some((item) => item.id === value)
    ? (value as CategoryId)
    : "all";
}

export function bestsellers() {
  return products.filter((product) => product.bestseller);
}
