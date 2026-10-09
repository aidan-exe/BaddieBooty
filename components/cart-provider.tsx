"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { subscribeHydration } from "@/lib/browser-store";
import { getProduct, lineUnitPrice, type Product } from "@/lib/products";

export const CART_STORAGE_KEY = "baddie-booty-cart-v1";
const LEGACY_CART_STORAGE_KEY = "baddie-proposal-cart-v1";

export type CartLine = {
  slug: string;
  qty: number;
  size: string;
};

type CartContextValue = {
  ready: boolean;
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (slug: string, size: string, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  removeItem: (slug: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as CartLine;
  return (
    typeof line.slug === "string" &&
    typeof line.qty === "number" &&
    typeof line.size === "string"
  );
}

const serverLines: CartLine[] = [];
let cartRaw: string | null = null;
let cartLines: CartLine[] = serverLines;
const cartListeners = new Set<() => void>();

function parseLines(raw: string | null): CartLine[] {
  if (!raw) return serverLines;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return serverLines;
    return parsed.filter(isLine).filter((line) => line.qty > 0 && getProduct(line.slug));
  } catch {
    return serverLines;
  }
}

function readCartLines() {
  if (localStorage.getItem(CART_STORAGE_KEY) === null) {
    const legacy = localStorage.getItem(LEGACY_CART_STORAGE_KEY);
    if (legacy !== null) localStorage.setItem(CART_STORAGE_KEY, legacy);
  }
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (raw === cartRaw) return cartLines;
  cartRaw = raw;
  cartLines = parseLines(raw);
  return cartLines;
}

function subscribeCart(listener: () => void) {
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
}

function writeCartLines(lines: CartLine[]) {
  const raw = JSON.stringify(lines);
  localStorage.setItem(CART_STORAGE_KEY, raw);
  cartRaw = raw;
  cartLines = lines;
  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribeCart, readCartLines, () => serverLines);
  const ready = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const addItem = useCallback((slug: string, size: string, qty = 1) => {
    const current = readCartLines();
    const match = current.find((line) => line.slug === slug && line.size === size);
    const next = match
      ? current.map((line) =>
          line.slug === slug && line.size === size ? { ...line, qty: line.qty + qty } : line,
        )
      : [...current, { slug, size, qty }];
    writeCartLines(next);
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    const current = readCartLines();
    writeCartLines(
      qty <= 0
        ? current.filter((line) => !(line.slug === slug && line.size === size))
        : current.map((line) =>
            line.slug === slug && line.size === size ? { ...line, qty } : line,
          ),
    );
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    writeCartLines(readCartLines().filter((line) => !(line.slug === slug && line.size === size)));
  }, []);

  const clear = useCallback(() => writeCartLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.qty, 0),
    [lines],
  );

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const product = getProduct(line.slug);
        return sum + (product ? lineUnitPrice(product, line.size) * line.qty : 0);
      }, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      ready,
      lines,
      itemCount,
      subtotal,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      setQty,
      removeItem,
      clear,
    }),
    [ready, lines, itemCount, subtotal, drawerOpen, addItem, setQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

export function lineProduct(line: CartLine): Product | undefined {
  return getProduct(line.slug);
}
