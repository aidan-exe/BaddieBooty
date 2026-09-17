export const categories = [
  { id: "all", label: "All" },
  { id: "compression", label: "Compression" },
  { id: "bras", label: "Bras" },
  { id: "boards-pillows", label: "Boards & Pillows" },
  { id: "bodysuits", label: "Bodysuits" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: Exclude<CategoryId, "all">;
  bestseller: boolean;
  blurb: string;
  detail: string;
  image: string;
  imageAlt: string;
  stage: string;
  sizes: string[];
  sourceUrl: string;
  wearNotes: string[];
};

const garmentSizes = ["S", "M", "L", "XL", "2XL", "3XL"];

export const products: Product[] = [
  {
    slug: "post-surgery-liposuction-ab-board",
    name: "Post Surgery Liposuction AB Board",
    price: 600,
    category: "boards-pillows",
    bestseller: true,
    blurb: "A firm abdominal board for structured rest while you recover.",
    detail:
      "Designed to sit smoothly under a faja. Choose with Tiara if you are pairing it with a stage 1 or stage 2 garment. Photography from the live Baddie Booty catalogue.",
    image: "/products/ab-board.jpg",
    imageAlt: "Post Surgery Liposuction AB Board from Baddie Booty",
    stage: "Accessory",
    sizes: ["One size"],
    sourceUrl:
      "https://baddiebooty.co.za/product/post-surgery-liposuction-ab-board/",
    wearNotes: [
      "Wear under a faja as your practitioner advises.",
      "One-size board. Message the studio if you want pairing help.",
    ],
  },
  {
    slug: "post-surgical-compression-bra",
    name: "Post-Surgical Compression Bra & Posture Corrector",
    price: 699,
    category: "bras",
    bestseller: true,
    blurb: "Soft, steady support across the chest and upper back.",
    detail:
      "A recovery-care bra with a posture-minded cut and front-closure feel. Sizes follow the live shop range. Confirm staging with your care team. This is not a clinical device.",
    image: "/products/compression-bra.jpg",
    imageAlt: "Adjustable front-closure compression vest by Baddie Booty",
    stage: "Stages 1 and 2",
    sizes: garmentSizes,
    sourceUrl:
      "https://baddiebooty.co.za/product/baddie-booty-post-surgical-compression-bra-posture-corrector/",
    wearNotes: [
      "Front-closure style for easier on-and-off during early days.",
      "Ask Tiara if you are between sizes or wearing drains.",
    ],
  },
  {
    slug: "butt-lift-support-pillow",
    name: "Butt Lift Support Pillow",
    price: 950,
    category: "boards-pillows",
    bestseller: true,
    blurb: "A shaped cushion for sitting more comfortably after a BBL.",
    detail:
      "Meant for how you sit at home, not a medical device. Follow your surgeon’s sitting guidance first. Image from the current Baddie Booty store.",
    image: "/products/support-pillow.jpg",
    imageAlt: "Butt Lift Support Pillow from Baddie Booty",
    stage: "Accessory",
    sizes: ["One size"],
    sourceUrl: "https://baddiebooty.co.za/product/butt-lift-support-pillow/",
    wearNotes: [
      "Use as a sitting cushion, not as treatment.",
      "Follow your surgeon’s sitting and travel rules first.",
    ],
  },
  {
    slug: "full-body-post-surgery-seamless-faja",
    name: "Full Body Post-Surgery Seamless Faja",
    price: 800,
    category: "compression",
    bestseller: true,
    blurb: "Seamless full-body compression that follows every defined curve.",
    detail:
      "A studio staple for post-op days. Live checkout, variants, and South African shipping arrive with a paid WooCommerce rebuild. Photo from baddiebooty.co.za.",
    image: "/products/seamless-faja.png",
    imageAlt: "Full Body Post-Surgery Seamless Faja",
    stage: "Stage 1",
    sizes: garmentSizes,
    sourceUrl:
      "https://baddiebooty.co.za/product/stage-1-full-body-post-surgery-bodysuit/",
    wearNotes: [
      "Seamless full-body hold for early recovery wardrobes.",
      "Size using the live S to 3XL range. WhatsApp if you need a read.",
    ],
  },
  {
    slug: "post-surgery-abdominal-compression-board",
    name: "Post Surgery Abdominal Compression Board",
    price: 600,
    category: "boards-pillows",
    bestseller: false,
    blurb: "A second board option for abdominal compression and rest.",
    detail:
      "Pair with a faja for a smoother front. Prices shown match the live catalogue. Photography from the current store.",
    image: "/products/abdominal-board.png",
    imageAlt: "Post Surgery Abdominal Compression Board",
    stage: "Accessory",
    sizes: ["One size"],
    sourceUrl:
      "https://baddiebooty.co.za/product/post-surgery-abdominal-compression-board/",
    wearNotes: [
      "Slide under a garment for a flatter front while you rest.",
      "Not a substitute for surgical aftercare.",
    ],
  },
  {
    slug: "extreme-tummy-control-girdle-bodysuit",
    name: "Extreme Tummy Control Girdle Corset Bodysuit",
    price: 800,
    category: "bodysuits",
    bestseller: true,
    blurb: "A sculpting bodysuit with firm tummy control for later-stage wear.",
    detail:
      "Closer to daily shapewear energy, still recovery-aware. Not a substitute for clinical advice.",
    image: "/products/tummy-bodysuit.jpg",
    imageAlt: "Extreme Tummy Control Girdle Corset Bodysuit",
    stage: "Stages 2 and 3",
    sizes: garmentSizes,
    sourceUrl:
      "https://baddiebooty.co.za/product/extreme-tummy-control-girdle-corset-bodysuit/",
    wearNotes: [
      "Firm tummy control for later-stage or daily shapewear days.",
      "If you are newly post-op, ask before jumping to this hold.",
    ],
  },
  {
    slug: "levanta-cola-compression-faja",
    name: "Levanta Cola Compression Faja (Mid-Thigh)",
    price: 750,
    category: "compression",
    bestseller: false,
    blurb: "Mid-thigh faja with a lift-minded cut through the hips.",
    detail:
      "From the current shop. Mid-thigh length with a levanta-cola cut. Photo from the live product page.",
    image: "/products/levanta-cola.jpg",
    imageAlt: "Levanta Cola Compression Faja (Mid-Thigh)",
    stage: "Stage 2",
    sizes: garmentSizes,
    sourceUrl:
      "https://baddiebooty.co.za/product/baddie-booty-levanta-cola-compression-faja-mid-thigh/",
    wearNotes: [
      "Mid-thigh length with a lift-minded hip cut.",
      "Message the studio for colour and size confirmation.",
    ],
  },
  {
    slug: "high-compression-stage-3-waist-trainer",
    name: "High Compression Stage 3 Waist Trainer",
    price: 1190,
    category: "compression",
    bestseller: true,
    blurb: "Stage 3 waist training with a cinched, hourglass-minded hold.",
    detail:
      "Intended for later recovery stages when your practitioner says you are ready. Confirm staging with your care team.",
    image: "/products/waist-trainer.jpg",
    imageAlt: "High Compression Stage 3 Faja Waist Trainer",
    stage: "Stage 3",
    sizes: garmentSizes,
    sourceUrl:
      "https://baddiebooty.co.za/product/high-compression-stage-3-faja-waist-trainer/",
    wearNotes: [
      "Later-stage waist trainer, not first-week wear.",
      "Confirm with your practitioner before sizing down.",
    ],
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

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
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

export function categoryLabel(category: Product["category"]) {
  switch (category) {
    case "compression":
      return "Compression";
    case "bras":
      return "Bras";
    case "boards-pillows":
      return "Boards & Pillows";
    case "bodysuits":
      return "Bodysuits";
  }
}
