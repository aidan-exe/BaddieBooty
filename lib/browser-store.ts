export const RECEIPT_KEY = "baddie-booty-checkout-receipt-v1";
export const CLEAR_GRANT_KEY = "baddie-booty-clear-bag-v1";
export const CLEARED_ORDER_KEY = "baddie-booty-cleared-order-v1";

/** Subscribe callback for a client-only `useSyncExternalStore` snapshot. */
export function subscribeHydration() {
  return () => {};
}

const clearListeners = new Set<() => void>();

export function subscribeClearState(listener: () => void) {
  clearListeners.add(listener);
  return () => clearListeners.delete(listener);
}

function notifyClearState() {
  clearListeners.forEach((listener) => listener());
}

type GrantStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

/** True when the browser arrived from PayFast's own host. */
export function payfastReferrer(referrer: string) {
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return host === "payfast.co.za" || host.endsWith(".payfast.co.za");
  } catch {
    return false;
  }
}

export function writeClearGrantTo(store: GrantStore, orderId: string) {
  store.setItem(CLEAR_GRANT_KEY, orderId);
}

/** Removes the grant once when it matches this order. A second call does not match. */
export function consumeClearGrantFrom(store: GrantStore, orderId: string) {
  if (!orderId || store.getItem(CLEAR_GRANT_KEY) !== orderId) return false;
  store.removeItem(CLEAR_GRANT_KEY);
  return true;
}

export function writeClearGrant(orderId: string) {
  writeClearGrantTo(sessionStorage, orderId);
}

export function consumeClearGrant(orderId: string) {
  return consumeClearGrantFrom(sessionStorage, orderId);
}

export function markBagCleared(orderId: string) {
  sessionStorage.setItem(CLEARED_ORDER_KEY, orderId);
  notifyClearState();
}

export function readClearedOrder() {
  return sessionStorage.getItem(CLEARED_ORDER_KEY);
}
