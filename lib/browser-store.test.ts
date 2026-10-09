import assert from "node:assert/strict";
import test from "node:test";
import {
  CLEAR_GRANT_KEY,
  consumeClearGrantFrom,
  payfastReferrer,
  writeClearGrantTo,
} from "./browser-store.ts";

function memoryStore() {
  const values = new Map<string, string>();
  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    removeItem(key: string) {
      values.delete(key);
    },
  };
}

test("recognises a PayFast return referrer", () => {
  assert.equal(payfastReferrer("https://sandbox.payfast.co.za/eng/process"), true);
  assert.equal(payfastReferrer("https://www.payfast.co.za/eng/process/finish"), true);
  assert.equal(payfastReferrer("https://payfast.co.za/"), true);
  assert.equal(payfastReferrer("https://w1w.payfast.co.za/"), true);
  assert.equal(payfastReferrer(""), false);
  assert.equal(payfastReferrer("https://baddie-booty.vercel.app/checkout/success?order=BB-1"), false);
  assert.equal(payfastReferrer("https://payfast.co.za.evil.com/"), false);
  assert.equal(payfastReferrer("https://evilpayfast.co.za/"), false);
  assert.equal(payfastReferrer("https://not-payfast.co.za/"), false);
  assert.equal(payfastReferrer("not a url"), false);
});

test("a clear grant matches one order and is then gone", () => {
  const store = memoryStore();
  writeClearGrantTo(store, "BB-1");
  assert.equal(store.getItem(CLEAR_GRANT_KEY), "BB-1");
  assert.equal(consumeClearGrantFrom(store, "BB-OTHER"), false);
  assert.equal(store.getItem(CLEAR_GRANT_KEY), "BB-1");
  assert.equal(consumeClearGrantFrom(store, "BB-1"), true);
  assert.equal(store.getItem(CLEAR_GRANT_KEY), null);
  assert.equal(consumeClearGrantFrom(store, "BB-1"), false);
  assert.equal(consumeClearGrantFrom(store, ""), false);
});
