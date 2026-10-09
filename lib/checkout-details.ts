export const CHECKOUT_STORAGE_KEY = "baddie-booty-checkout-v1";

export const provinces = [
  { code: "EC", name: "Eastern Cape" },
  { code: "FS", name: "Free State" },
  { code: "GP", name: "Gauteng" },
  { code: "KZN", name: "KwaZulu-Natal" },
  { code: "LP", name: "Limpopo" },
  { code: "MP", name: "Mpumalanga" },
  { code: "NC", name: "Northern Cape" },
  { code: "NW", name: "North West" },
  { code: "WC", name: "Western Cape" },
] as const;

export type ProvinceCode = (typeof provinces)[number]["code"];

export type AddressDraft = {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postcode: string;
  phone: string;
};

export type BillingDraft = AddressDraft & { email: string };

export type CheckoutDraft = {
  billing: BillingDraft;
  shipping: AddressDraft;
  shipToDifferent: boolean;
  notes: string;
};

export type NormalizedAddress = {
  firstName: string;
  lastName: string;
  company: string;
  country: "ZA";
  address1: string;
  address2: string;
  city: string;
  province: ProvinceCode;
  provinceName: string;
  postcode: string;
  phone: string;
};

export type NormalizedCheckout = {
  billing: NormalizedAddress & { email: string };
  shipping: NormalizedAddress;
  shipToDifferent: boolean;
  notes: string;
};

export function emptyAddress(province = "KZN"): AddressDraft {
  return {
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    province,
    postcode: "",
    phone: "",
  };
}

export function emptyCheckoutDraft(): CheckoutDraft {
  return {
    billing: { ...emptyAddress(), email: "" },
    shipping: emptyAddress(),
    shipToDifferent: false,
    notes: "",
  };
}

export function normalizeSaPhone(input: string) {
  const compact = input.replace(/[\s().-]/g, "");
  if (/^0[1-8]\d{8}$/.test(compact)) return compact;
  if (/^\+27[1-8]\d{8}$/.test(compact)) return `0${compact.slice(3)}`;
  if (/^27[1-8]\d{8}$/.test(compact)) return `0${compact.slice(2)}`;
  return null;
}

export function normalizePostcode(input: string) {
  const compact = input.replace(/\s/g, "");
  return /^\d{4}$/.test(compact) ? compact : null;
}

function provinceByCode(code: string) {
  return provinces.find((province) => province.code === code) ?? null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function cleanLine(value: string, max: number) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed || trimmed.length > max || /[\u0000-\u001F]/.test(trimmed)) return null;
  return trimmed;
}

function cleanOptional(value: string, max: number) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  if (trimmed.length > max || /[\u0000-\u001F]/.test(trimmed)) return null;
  return trimmed;
}

function validateAddress(prefix: "billing" | "shipping", input: unknown, errors: Record<string, string>) {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const firstName = cleanLine(readString(source.firstName), 100);
  const lastName = cleanLine(readString(source.lastName), 100);
  const company = cleanOptional(readString(source.company), 100);
  const address1 = cleanLine(readString(source.address1), 200);
  const address2 = cleanOptional(readString(source.address2), 200);
  const city = cleanLine(readString(source.city), 100);
  const province = provinceByCode(readString(source.province).trim());
  const postcode = normalizePostcode(readString(source.postcode));
  const phone = normalizeSaPhone(readString(source.phone));

  if (!firstName) errors[`${prefix}.firstName`] = "Enter a first name.";
  if (!lastName) errors[`${prefix}.lastName`] = "Enter a last name.";
  if (company === null) errors[`${prefix}.company`] = "Company name is too long.";
  if (!address1 || address1.length < 3) {
    errors[`${prefix}.address1`] = "Enter the house number and street name.";
  }
  if (address2 === null) errors[`${prefix}.address2`] = "Apartment or unit is too long.";
  if (!city || city.length < 2) errors[`${prefix}.city`] = "Enter a town or city.";
  if (!province) errors[`${prefix}.province`] = "Choose a province.";
  if (!postcode) errors[`${prefix}.postcode`] = "Enter a 4-digit South African postcode.";
  if (!phone) {
    errors[`${prefix}.phone`] = "Enter a South African number, like 082 123 4567 or +27 82 123 4567.";
  }

  if (!firstName || !lastName || company === null || !address1 || address2 === null || !city || !province || !postcode || !phone) {
    return null;
  }

  const normalized: NormalizedAddress = {
    firstName,
    lastName,
    company,
    country: "ZA",
    address1,
    address2,
    city,
    province: province.code,
    provinceName: province.name,
    postcode,
    phone,
  };
  return normalized;
}

export function validateCustomer(input: unknown):
  | { ok: true; value: NormalizedCheckout }
  | { ok: false; errors: Record<string, string> } {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const errors: Record<string, string> = {};
  const billing = validateAddress("billing", source.billing, errors);
  const billingSource =
    source.billing && typeof source.billing === "object"
      ? (source.billing as Record<string, unknown>)
      : {};
  const email = readString(billingSource.email).trim();
  if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors["billing.email"] = "Enter a valid email address.";
  }

  const shipToDifferent = source.shipToDifferent === true;
  const shipping = shipToDifferent ? validateAddress("shipping", source.shipping, errors) : null;
  const notesResult = cleanOptional(readString(source.notes), 500);
  if (notesResult === null) errors.notes = "Order notes need to be 500 characters or fewer.";

  if (!billing || errors["billing.email"] || (shipToDifferent && !shipping) || notesResult === null) {
    return { ok: false, errors };
  }

  const shippingAddress: NormalizedAddress = shipToDifferent && shipping
    ? shipping
    : {
        firstName: billing.firstName,
        lastName: billing.lastName,
        company: billing.company,
        country: "ZA",
        address1: billing.address1,
        address2: billing.address2,
        city: billing.city,
        province: billing.province,
        provinceName: billing.provinceName,
        postcode: billing.postcode,
        phone: billing.phone,
      };

  return {
    ok: true,
    value: {
      billing: { ...billing, email },
      shipping: shippingAddress,
      shipToDifferent,
      notes: notesResult,
    },
  };
}

function asAddress(value: unknown, fallback: AddressDraft): AddressDraft {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const province = readString(source.province);
  return {
    firstName: readString(source.firstName).slice(0, 100),
    lastName: readString(source.lastName).slice(0, 100),
    company: readString(source.company).slice(0, 100),
    address1: readString(source.address1).slice(0, 200),
    address2: readString(source.address2).slice(0, 200),
    city: readString(source.city).slice(0, 100),
    province: provinceByCode(province) ? province : fallback.province,
    postcode: readString(source.postcode).slice(0, 12),
    phone: readString(source.phone).slice(0, 24),
  };
}

export function readCheckoutDraft(raw: string | null): CheckoutDraft {
  const fallback = emptyCheckoutDraft();
  if (!raw) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return fallback;
    const source = parsed as Record<string, unknown>;
    const billing = asAddress(source.billing, fallback.billing);
    const billingSource =
      source.billing && typeof source.billing === "object"
        ? (source.billing as Record<string, unknown>)
        : {};
    return {
      billing: { ...billing, email: readString(billingSource.email).slice(0, 100) },
      shipping: asAddress(source.shipping, fallback.shipping),
      shipToDifferent: source.shipToDifferent === true,
      notes: readString(source.notes).slice(0, 500),
    };
  } catch {
    return fallback;
  }
}
