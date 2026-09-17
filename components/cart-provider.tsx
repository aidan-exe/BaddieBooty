"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "@/lib/products";

export const CART_STORAGE_KEY = "baddie-proposal-cart-v1";

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

function readStore(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLine).filter((line) => line.qty > 0 && getProduct(line.slug));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setLines(readStore());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

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
    setLines((current) => {
      const match = current.find((line) => line.slug === slug && line.size === size);
      if (match) {
        return current.map((line) =>
          line.slug === slug && line.size === size
            ? { ...line, qty: line.qty + qty }
            : line,
        );
      }
      return [...current, { slug, size, qty }];
    });
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((slug: string, size: string, qty: number) => {
    setLines((current) => {
      if (qty <= 0) {
        return current.filter((line) => !(line.slug === slug && line.size === size));
      }
      return current.map((line) =>
        line.slug === slug && line.size === size ? { ...line, qty } : line,
      );
    });
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    setLines((current) =>
      current.filter((line) => !(line.slug === slug && line.size === size)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.qty, 0),
    [lines],
  );

  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const product = getProduct(line.slug);
        return sum + (product ? product.price * line.qty : 0);
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
