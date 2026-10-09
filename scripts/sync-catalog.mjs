/**
 * Refresh the shop catalogue from the live WooCommerce store.
 *
 *   node scripts/sync-catalog.mjs
 *
 * Source: https://baddiebooty.co.za
 * Writes: data/catalog.json and public/products/<slug>/
 */

import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://baddiebooty.co.za";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = path.join(ROOT, "data", "catalog.json");
const IMAGE_ROOT = path.join(ROOT, "public", "products");
const USER_AGENT = "BaddieBootyCatalogSync/1.0";

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "h2",
  "h3",
  "h4",
  "h5",
  "a",
  "span",
  "div",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "img",
  "blockquote",
  "sup",
  "sub",
]);

function decodeEntities(value) {
  return String(value ?? "")
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&#x([0-9a-f]+);/gi, (_, num) =>
      String.fromCodePoint(parseInt(num, 16)),
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function collapseWhitespace(value) {
  return decodeEntities(value).replace(/\s+/g, " ").trim();
}

function visibleText(html) {
  return collapseWhitespace(String(html ?? "").replace(/<[^>]+>/g, " "));
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function slugify(value) {
  return decodeEntities(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function money(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100) / 100;
}

function fromMinor(prices) {
  const unit = 10 ** Number(prices?.currency_minor_unit ?? 2);
  return {
    price: money(Number(prices?.price ?? 0) / unit),
    regularPrice: money(Number(prices?.regular_price ?? prices?.price ?? 0) / unit),
    salePrice: money(Number(prices?.sale_price ?? 0) / unit),
  };
}

async function request(url, { binary = false } = {}, attempt = 0) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: binary ? "*/*" : "application/json, text/html, */*",
      },
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return response;
  } catch (error) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
      return request(url, { binary }, attempt + 1);
    }
    throw new Error(`${url}: ${error instanceof Error ? error.message : error}`);
  }
}

async function requestJson(url) {
  const response = await request(url);
  return { json: await response.json(), headers: response.headers };
}

async function requestText(url) {
  const response = await request(url);
  return response.text();
}

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  let total = 0;
  let totalPages = 1;
  while (page <= totalPages) {
    const { json, headers } = await requestJson(
      `${ORIGIN}/wp-json/wc/store/v1/products?per_page=100&page=${page}`,
    );
    total = Number(headers.get("x-wp-total") || json.length);
    totalPages = Number(headers.get("x-wp-totalpages") || 1);
    if (!Array.isArray(json)) {
      throw new Error("Store API products response was not a list");
    }
    products.push(...json);
    page += 1;
  }
  return { products, total };
}

async function fetchCategories() {
  const categories = [];
  let page = 1;
  let totalPages = 1;
  let total = 0;
  while (page <= totalPages) {
    const { json, headers } = await requestJson(
      `${ORIGIN}/wp-json/wc/store/v1/products/categories?per_page=100&page=${page}`,
    );
    total = Number(headers.get("x-wp-total") || json.length);
    totalPages = Number(headers.get("x-wp-totalpages") || 1);
    if (!Array.isArray(json)) {
      throw new Error("Store API categories response was not a list");
    }
    categories.push(...json);
    page += 1;
  }
  return { categories, total };
}

async function fetchSitemapProductUrls() {
  const index = await requestText(`${ORIGIN}/sitemap_index.xml`);
  const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    decodeEntities(match[1]),
  );
  const productMap = sitemaps.find((url) => url.includes("product-sitemap"));
  if (!productMap) return [];
  const xml = await requestText(productMap);
  return [
    ...new Set(
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((match) => decodeEntities(match[1]))
        .filter((url) => /\/product\/[^/]+\/?$/.test(url)),
    ),
  ];
}

function extractAttribute(html, name) {
  const token = `${name}="`;
  const start = html.indexOf(token);
  if (start < 0) return null;
  const from = start + token.length;
  const end = html.indexOf('"', from);
  if (end < 0) return null;
  return html.slice(from, end);
}

function parseVariations(html) {
  const raw = extractAttribute(html, "data-product_variations");
  if (!raw || raw === "false") return [];
  const decoded = decodeEntities(raw);
  const parsed = JSON.parse(decoded);
  return Array.isArray(parsed) ? parsed : [];
}

function extractTag(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? collapseWhitespace(match[1].replace(/<[^>]+>/g, " ")) : "";
}

function extractMarkdown(html) {
  const marker = 'class="markdown';
  const classAt = html.indexOf(marker);
  if (classAt < 0) return null;
  const start = html.lastIndexOf("<div", classAt);
  if (start < 0) return null;
  const tag = /<div\b[^>]*>/i.exec(html.slice(start));
  if (!tag) return null;
  let cursor = start + tag[0].length;
  let depth = 1;
  while (cursor < html.length && depth > 0) {
    const next = html.slice(cursor).search(/<\/?div\b/i);
    if (next < 0) return null;
    const at = cursor + next;
    if (html.startsWith("</", at)) depth -= 1;
    else depth += 1;
    const close = html.indexOf(">", at);
    if (close < 0) return null;
    if (depth === 0) return html.slice(start + tag[0].length, at);
    cursor = close + 1;
  }
  return null;
}

function sanitizeHtml(html) {
  const source = extractMarkdown(html) ?? String(html ?? "");
  const withoutDanger = source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form|svg)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|svg)\b[^>]*\/?>/gi, "");

  return withoutDanger
    .replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (match, tag, attrs = "") => {
      const name = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return "";
      if (match.startsWith("</")) return `</${name}>`;
      if (name === "br") return "<br />";
      if (name === "img") {
        const src =
          /src\s*=\s*"([^"]+)"/i.exec(attrs)?.[1] ??
          /src\s*=\s*'([^']+)'/i.exec(attrs)?.[1];
        if (!src) return "";
        const alt =
          /alt\s*=\s*"([^"]*)"/i.exec(attrs)?.[1] ??
          /alt\s*=\s*'([^']*)'/i.exec(attrs)?.[1] ??
          /title\s*=\s*"([^"]*)"/i.exec(attrs)?.[1] ??
          "";
        return `<img src="${escapeAttr(decodeEntities(src))}" alt="${escapeAttr(decodeEntities(alt))}" />`;
      }
      if (name === "a") {
        const href =
          /href\s*=\s*"([^"]+)"/i.exec(attrs)?.[1] ??
          /href\s*=\s*'([^']+)'/i.exec(attrs)?.[1];
        if (!href || !/^https?:\/\//i.test(decodeEntities(href))) return "<a>";
        return `<a href="${escapeAttr(decodeEntities(href))}" rel="noreferrer">`;
      }
      return `<${name}>`;
    })
    .replace(/(<(?!img\b|br\b)([a-z0-9]+)\b[^>]*>\s*<\/\2>\s*)+/gi, "")
    .trim();
}

function isLogo(url) {
  return /logo|favicon|icon/i.test(url);
}

function isImageFile(url) {
  return /\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(url);
}

function fullSizeUrl(url) {
  const clean = url.split("?")[0];
  return clean.replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp|gif)$)/i, "");
}

function usefulAlt(alt, title, fallback) {
  const candidate = collapseWhitespace(alt || "") || collapseWhitespace(title || "");
  if (!candidate) return fallback;
  const fileLike =
    /^(img[_-]?\d.*|[0-9a-f]{8}-[0-9a-f-]{20,})$/i.test(candidate) ||
    /\.(jpe?g|png|webp|gif)$/i.test(candidate);
  return fileLike ? fallback : candidate;
}

function productRegion(html) {
  const start = Math.min(
    ...["themify_builder_content", "type-product"]
      .map((marker) => html.indexOf(marker))
      .filter((index) => index >= 0),
  );
  if (!Number.isFinite(start)) return html;
  let end = html.length;
  for (const marker of ["wp_footer", "</body>"]) {
    const at = html.indexOf(marker, start);
    if (at > start) end = Math.min(end, at);
  }
  return html.slice(start, end);
}

function collectContentImages(html) {
  const slice = productRegion(html);
  const images = [];
  const pattern = /<img\b[^>]*>/gi;
  for (const match of slice.matchAll(pattern)) {
    const tag = match[0];
    const src =
      /src\s*=\s*"([^"]+)"/i.exec(tag)?.[1] ??
      /data-src\s*=\s*"([^"]+)"/i.exec(tag)?.[1];
    if (!src) continue;
    let absolute = decodeEntities(src);
    if (!absolute.startsWith(ORIGIN)) continue;
    if (!isImageFile(absolute) || isLogo(absolute)) continue;
    absolute = fullSizeUrl(absolute);
    const alt = usefulAlt(
      /alt\s*=\s*"([^"]*)"/i.exec(tag)?.[1] ?? "",
      /title\s*=\s*"([^"]*)"/i.exec(tag)?.[1] ?? "",
      "",
    );
    images.push({ src: absolute, alt });
  }
  return images;
}

function ancestorSlugs(categoryIds, categories) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const slugs = [];
  const seen = new Set();
  function add(category) {
    if (!category || seen.has(category.slug)) return;
    seen.add(category.slug);
    slugs.push(category.slug);
    if (category.parent) add(byId.get(category.parent));
  }
  for (const id of categoryIds) add(byId.get(id));
  return slugs;
}

function stockTextFromHtml(html, inStock) {
  const plain = visibleText(html).replace(/\s+/g, " ").trim();
  if (!plain || /^read more$/i.test(plain)) return inStock ? "" : "Out of stock";
  return plain;
}

function parseSelects(html) {
  const tableAt = html.indexOf('class="variations"');
  if (tableAt < 0) return [];
  const region = html.slice(tableAt, tableAt + 30000);
  const selects = [];
  for (const row of region.split(/<tr\b/i).slice(1)) {
    const key = /name="(attribute_[^"]+)"/i.exec(row)?.[1];
    if (!key) continue;
    const label = collapseWhitespace(
      (/<label[^>]*>([\s\S]*?)<\/label>/i.exec(row)?.[1] ?? key.replace(/^attribute_/, "")).replace(
        /<[^>]+>/g,
        " ",
      ),
    );
    const options = [];
    for (const match of row.matchAll(/<option[^>]*value="([^"]*)"[^>]*>/gi)) {
      const value = collapseWhitespace(decodeEntities(match[1]));
      if (value) options.push(value);
    }
    selects.push({ key, label, options });
  }
  return selects;
}

function cartesian(attributes) {
  let combos = [{}];
  for (const attribute of attributes) {
    combos = combos.flatMap((combo) =>
      attribute.options.map((option) => ({ ...combo, [attribute.name]: option })),
    );
  }
  return combos;
}

function fitFor(url, alt) {
  return /size[\s_-]?chart/i.test(`${url} ${alt}`) ? "contain" : "cover";
}

function localFileName(remoteUrl, index) {
  const url = new URL(remoteUrl);
  const parts = url.pathname.split("/").filter(Boolean);
  const file = parts.at(-1) ?? `image-${index}.jpg`;
  const folder = parts.at(-2) ?? "img";
  return `${String(index).padStart(2, "0")}-${folder}-${file}`.replace(
    /[^a-zA-Z0-9._-]/g,
    "",
  );
}

async function downloadImage(remoteUrl, destination) {
  const response = await request(remoteUrl, { binary: true });
  const type = response.headers.get("content-type") ?? "";
  const bytes = Buffer.from(await response.arrayBuffer());
  const looksImage =
    type.startsWith("image/") ||
    bytes.subarray(0, 3).toString("hex") === "ffd8ff" ||
    bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" ||
    bytes.subarray(0, 4).toString("ascii") === "RIFF" ||
    bytes.subarray(0, 3).toString("ascii") === "GIF";
  if (!looksImage || bytes.length < 32) {
    throw new Error(`not an image (${type || "unknown type"}, ${bytes.length} bytes)`);
  }
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  return bytes.length;
}

function attributeNameForKey(key, attributes) {
  const raw = key.replace(/^attribute_/, "");
  const found = attributes.find((attribute) => {
    const slug = slugify(attribute.name);
    return slug === raw || slug === raw.replace(/^pa-/, "") || slug === raw.replace(/^pa_/, "");
  });
  return found?.name ?? raw;
}

function variantFromSource(source, attributes, { placeholder = false } = {}) {
  const inStock = placeholder ? false : Boolean(source?.is_in_stock);
  const price = money(source?.display_price ?? source?.price ?? 0);
  const regularPrice = money(source?.display_regular_price ?? source?.regularPrice ?? price);
  const onSale = !placeholder && price < regularPrice;
  const purchasable = !placeholder && source?.is_purchasable !== false && inStock;
  return {
    id: source?.variation_id ?? source?.id ?? 0,
    attributes,
    price,
    regularPrice,
    salePrice: onSale ? price : null,
    onSale,
    inStock,
    purchasable,
    stockText: placeholder
      ? "Unavailable"
      : stockTextFromHtml(source?.availability_html || source?.stockText || "", inStock),
    sku: source?.sku || "",
  };
}

function buildVariants(product, htmlVariations, parentPrice, selects) {
  const apiAttributes = product.attributes ?? [];
  const labelForKey = new Map((selects ?? []).map((select) => [select.key, select.label]));

  function labelFor(key) {
    return labelForKey.get(key) ?? attributeNameForKey(key, apiAttributes);
  }

  function canonical(label, raw) {
    const text = collapseWhitespace(decodeEntities(raw ?? ""));
    if (!text) return "";
    const select = (selects ?? []).find((item) => item.label === label);
    return select?.options.find((option) => option.toLowerCase() === text.toLowerCase()) ?? text;
  }

  const specific = [];
  const wildcards = [];
  for (const variation of htmlVariations) {
    if (variation.variation_is_visible === false || variation.variation_is_active === false) continue;
    const concrete = {};
    let wild = false;
    for (const [key, rawValue] of Object.entries(variation.attributes ?? {})) {
      const label = labelFor(key);
      const value = canonical(label, rawValue);
      if (!value) {
        wild = true;
        continue;
      }
      concrete[label] = value;
    }
    if (wild) wildcards.push({ variation, concrete });
    else if (Object.keys(concrete).length > 0) specific.push({ variation, concrete });
  }

  let attributes = (selects ?? [])
    .filter((select) => select.options.length > 0)
    .map((select) => ({ name: select.label, options: select.options }));

  if (attributes.length === 0) {
    const names = [];
    for (const item of specific) {
      for (const name of Object.keys(item.concrete)) {
        if (!names.includes(name)) names.push(name);
      }
    }
    attributes = names.map((name) => ({
      name,
      options: [...new Set(specific.map((item) => item.concrete[name]).filter(Boolean))],
    }));
  }

  const parentSource = {
    variation_id: product.id,
    display_price: parentPrice.price,
    display_regular_price: parentPrice.regularPrice,
    is_in_stock: Boolean(product.is_in_stock),
    is_purchasable: product.is_purchasable !== false,
    availability_html: product.stock_availability?.text || "",
    sku: product.sku || "",
  };

  let variants = [];
  if (attributes.length === 0) {
    variants = [variantFromSource(parentSource, {})];
  } else {
    const exact = new Map(
      specific.map((item) => [
        attributes.map((attribute) => item.concrete[attribute.name] ?? "").join("|"),
        item,
      ]),
    );
    let synthetic = 0;
    for (const combo of cartesian(attributes)) {
      const key = attributes.map((attribute) => combo[attribute.name] ?? "").join("|");
      const match = exact.get(key);
      if (match) {
        variants.push(variantFromSource(match.variation, combo));
        continue;
      }
      const wildcard = wildcards
        .filter((item) =>
          Object.entries(item.concrete).every(([name, value]) => combo[name] === value),
        )
        .sort(
          (left, right) => Object.keys(right.concrete).length - Object.keys(left.concrete).length,
        )[0];
      if (wildcard) {
        variants.push(variantFromSource(wildcard.variation, combo));
        continue;
      }
      synthetic += 1;
      variants.push(
        variantFromSource(
          {
            ...parentSource,
            variation_id: -synthetic,
            is_in_stock: false,
            is_purchasable: false,
          },
          combo,
          { placeholder: true },
        ),
      );
    }
  }

  const seen = new Map();
  for (const variant of variants) {
    const parts = attributes.map((attribute) => variant.attributes[attribute.name]).filter(Boolean);
    let label = parts.join(" / ") || "One size";
    const count = seen.get(label) ?? 0;
    seen.set(label, count + 1);
    if (count > 0) label = `${label} (#${variant.id})`;
    variant.label = label;
  }

  return { variants, attributes };
}

function rewriteImages(html, replacements) {
  let next = html;
  for (const [remote, local] of replacements) {
    const ext = remote.match(/\.(jpe?g|png|webp|gif)$/i)?.[0] ?? "";
    const stem = remote.slice(0, remote.length - ext.length);
    const pattern = new RegExp(
      `${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:-\\d+x\\d+)?${ext.replace(".", "\\.")}`,
      "gi",
    );
    next = next.replace(pattern, local);
  }
  return next;
}

async function removeStaleImages(written) {
  async function walk(directory) {
    let entries = [];
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        const left = await readdir(full);
        if (left.length === 0) await rm(full, { recursive: true });
      } else if (!written.has(full)) {
        await rm(full);
      }
    }
  }
  await walk(IMAGE_ROOT);
}

async function main() {
  const [{ products: rawProducts, total: liveProductCount }, { categories: rawCategories, total: liveCategoryCount }, sitemapUrls] =
    await Promise.all([fetchAllProducts(), fetchCategories(), fetchSitemapProductUrls()]);

  const categories = rawCategories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: collapseWhitespace(category.name),
    description: sanitizeHtml(category.description || ""),
    parent: category.parent || 0,
    count: category.count ?? 0,
  }));

  const unmirrored = [];
  const sitemapSlugs = new Set(
    sitemapUrls.map((url) => url.replace(/\/$/, "").split("/").pop()),
  );
  const apiSlugs = new Set(rawProducts.map((product) => product.slug));
  for (const url of sitemapUrls) {
    const slug = url.replace(/\/$/, "").split("/").pop();
    if (!apiSlugs.has(slug)) {
      unmirrored.push({
        product: slug,
        url,
        reason: "Listed in the product sitemap but missing from the public Store API.",
      });
    }
  }
  for (const product of rawProducts) {
    if (sitemapSlugs.size > 0 && !sitemapSlugs.has(product.slug)) {
      unmirrored.push({
        product: product.slug,
        url: product.permalink,
        reason: "Returned by the Store API but missing from the product sitemap.",
      });
    }
  }

  const products = [];
  const writtenImages = new Set();

  for (const product of rawProducts) {
    const notes = [];
    let html = "";
    try {
      html = await requestText(product.permalink);
    } catch (error) {
      notes.push(
        `Could not open the live product page (${error instanceof Error ? error.message : error}). Variant stock was taken from the Store API only.`,
      );
    }

    const parentPrice = fromMinor(product.prices);
    let htmlVariations = [];
    if (html) {
      try {
        htmlVariations = parseVariations(html);
      } catch (error) {
        notes.push(
          `Could not read variation prices from the product page (${error instanceof Error ? error.message : error}).`,
        );
      }
    }

    if ((product.variations?.length ?? 0) > 0 && htmlVariations.length === 0) {
      notes.push(
        "The product page did not include per-variant prices. Each size uses the parent price from the Store API.",
      );
      for (const variation of product.variations ?? []) {
        const attributes = {};
        for (const attribute of variation.attributes ?? []) {
          if (attribute.value) attributes[`attribute_${slugify(attribute.name)}`] = attribute.value;
        }
        if (Object.keys(attributes).length === 0) continue;
        htmlVariations.push({
          variation_id: variation.id,
          attributes,
          display_price: parentPrice.price,
          display_regular_price: parentPrice.regularPrice,
          is_in_stock: Boolean(product.is_in_stock),
          is_purchasable: product.is_purchasable !== false,
          availability_html: product.stock_availability?.text || "",
          sku: "",
          variation_is_visible: true,
          variation_is_active: true,
        });
      }
    }

    const selects = html ? parseSelects(html) : [];
    const built = buildVariants(product, htmlVariations, parentPrice, selects);

    const pageName = html ? extractTag(html, "h1") : "";
    const name = pageName || collapseWhitespace(product.name);

    const remoteImages = [];
    const seenRemote = new Set();
    function pushImage(src, alt) {
      const full = fullSizeUrl(src || "");
      if (!full || seenRemote.has(full) || isLogo(full)) return;
      seenRemote.add(full);
      remoteImages.push({ src: full, alt: usefulAlt(alt, "", name) });
    }
    for (const image of product.images ?? []) {
      if (image.src) pushImage(image.src, usefulAlt(image.alt, image.name, name));
    }
    for (const source of [html, product.description, product.short_description]) {
      if (!source) continue;
      for (const image of collectContentImages(source)) pushImage(image.src, image.alt || name);
    }

    const images = [];
    const replacements = new Map();
    for (const [index, image] of remoteImages.entries()) {
      const fileName = localFileName(image.src, index + 1);
      const destination = path.join(IMAGE_ROOT, product.slug, fileName);
      const localSrc = `/products/${product.slug}/${fileName}`;
      try {
        await downloadImage(image.src, destination);
        writtenImages.add(destination);
        const fit = fitFor(image.src, image.alt);
        const alt =
          fit === "contain" && (!image.alt || image.alt === name)
            ? "Size chart"
            : image.alt || name;
        images.push({
          src: localSrc,
          alt,
          fit,
        });
        replacements.set(image.src, localSrc);
      } catch (error) {
        notes.push(
          `Image ${image.src} was not saved (${error instanceof Error ? error.message : error}).`,
        );
      }
    }

    const categoryIds = (product.categories ?? []).map((category) => category.id);
    const categorySlugs = ancestorSlugs(categoryIds, categories);
    const primary =
      categorySlugs.find((slug) => slug !== "best-sellers") ?? categorySlugs[0] ?? "";

    let shortDescription = rewriteImages(
      sanitizeHtml(product.short_description || ""),
      replacements,
    );
    let description = rewriteImages(sanitizeHtml(product.description || ""), replacements);
    const rawShort = visibleText(product.short_description || "");
    const rawLong = visibleText(product.description || "");
    if (rawShort.length > 40 && visibleText(shortDescription).length < rawShort.length * 0.6) {
      notes.push("Short description lost text while cleaning the live HTML.");
    }
    if (rawLong.length > 40 && visibleText(description).length < rawLong.length * 0.6) {
      notes.push("Full description lost text while cleaning the live HTML.");
    }
    if (/baddiebooty\.co\.za\/wp-content\/uploads/i.test(`${shortDescription}\n${description}`)) {
      notes.push("A description image still points at the live store.");
    }

    const prices = built.variants.map((variant) => variant.price);
    const regulars = built.variants.map((variant) => variant.regularPrice);
    const price = prices.length ? Math.min(...prices) : parentPrice.price;
    const maxPrice = prices.length ? Math.max(...prices) : parentPrice.price;
    const regularPrice = regulars.length ? Math.min(...regulars) : parentPrice.regularPrice;
    const onSale = built.variants.some((variant) => variant.onSale);
    const inStock = built.variants.some((variant) => variant.inStock && variant.purchasable);

    if (!name) {
      unmirrored.push({
        product: product.slug,
        url: product.permalink,
        reason: "The live product has no name.",
      });
      continue;
    }

    products.push({
      id: product.id,
      slug: product.slug,
      name,
      sourceUrl: product.permalink,
      price,
      regularPrice,
      salePrice: onSale ? price : null,
      maxPrice,
      onSale,
      inStock,
      purchasable: product.is_purchasable !== false && inStock,
      stockText: collapseWhitespace(product.stock_availability?.text || ""),
      sku: product.sku || "",
      bestseller: categorySlugs.includes("best-sellers"),
      category: primary,
      categories: categorySlugs,
      shortDescription,
      description,
      images,
      image: images[0]?.src ?? "",
      imageAlt: images[0]?.alt || name,
      attributes: built.attributes,
      variants: built.variants,
      sizes: built.variants.map((variant) => variant.label),
    });

    if (notes.length > 0) {
      unmirrored.push({
        product: name,
        url: product.permalink,
        reason: notes.join(" "),
      });
    }

    const priceNumbers = [
      ...new Set(
        (html.match(/woocommerce-Price-amount[\s\S]*?<\/span>/g) ?? [])
          .map((snippet) => visibleText(snippet).replace(/[^\d.,]/g, "").replace(/,/g, ""))
          .filter(Boolean)
          .map(Number)
          .filter((amount) => Number.isFinite(amount)),
      ),
    ];
    if (
      priceNumbers.length > 0 &&
      !priceNumbers.some((amount) => Math.abs(amount - price) < 0.01 || Math.abs(amount - maxPrice) < 0.01)
    ) {
      unmirrored.push({
        product: name,
        url: product.permalink,
        reason: `Live page price (${priceNumbers.join(", ")}) does not match synced price ${price}.`,
      });
    }

    process.stdout.write(`synced ${product.slug} (${built.variants.length} variants, ${images.length} images)\n`);
  }

  await removeStaleImages(writtenImages);

  const catalog = {
    source: ORIGIN,
    syncedAt: new Date().toISOString(),
    liveProductCount,
    liveCategoryCount,
    categories,
    products,
    unmirrored,
  };

  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, `${JSON.stringify(catalog, null, 2)}\n`);

  const summary = {
    liveProductCount,
    ourProductCount: products.length,
    liveCategoryCount,
    ourCategoryCount: categories.length,
    sitemapProductCount: sitemapUrls.length,
    unmirrored,
  };
  process.stdout.write(`\n${JSON.stringify(summary, null, 2)}\n`);
  if (products.length !== liveProductCount) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
