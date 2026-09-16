export const site = {
  name: "Baddie Booty",
  tagline: "Post-op compression & shapewear, made for recovery days.",
  greeting: "Hey Baddie!",
  location: "Salt Rock, KwaZulu-Natal",
  country: "South Africa",
  phoneDisplay: "+27 68 134 6074",
  phoneTel: "+27681346074",
  email: "Tiara@baddiebooty.co.za",
  whatsapp: "https://wa.me/27681346074",
  liveStore: "https://baddiebooty.co.za/",
  designer: "Aidan Lottering",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function formatZar(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}
