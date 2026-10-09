import assert from "node:assert/strict";
import test from "node:test";
import {
  decodeCartSnapshot,
  discountCents,
  encodeCartSnapshot,
  findCoupon,
  formatPayfastAmount,
  mergeQty,
  parsePayfastAmount,
} from "./pricing.ts";

test("formats PayFast amounts with two decimals", () => {
  assert.equal(formatPayfastAmount(78000), "780.00");
  assert.equal(formatPayfastAmount(6990), "69.90");
  assert.equal(parsePayfastAmount("780.00"), 78000);
  assert.equal(parsePayfastAmount("69.9"), 6990);
  assert.equal(parsePayfastAmount("10"), 1000);
  assert.equal(parsePayfastAmount("10.999"), null);
});

test("applies a percent coupon to merchandise only and has no live codes", () => {
  const coupon = { code: "EXAMPLE", type: "percent" as const, amount: 10, label: "10% off" };
  assert.equal(discountCents(69900, coupon), 6990);
  assert.equal(discountCents(0, coupon), 0);
  assert.equal(findCoupon("EXAMPLE"), null);
  assert.equal(findCoupon(""), null);
});

test("merges duplicate lines before a quantity cap would see them", () => {
  const lines = [
    { productId: 1, qty: 15, label: "S" },
    { productId: 1, qty: 6, label: "S" },
    { productId: 1, qty: 2, label: "M" },
  ];
  assert.deepEqual(
    mergeQty(lines, (left, right) => left.productId === right.productId && left.label === right.label),
    [
      { productId: 1, qty: 21, label: "S" },
      { productId: 1, qty: 2, label: "M" },
    ],
  );
});

test("round-trips a cart snapshot and splits long carts", () => {
  const lines = [
    { productId: 661, qty: 1, label: "one size" },
    { productId: 1121, qty: 2, label: "S / Black" },
  ];
  const chunks = encodeCartSnapshot(lines);
  assert.equal(chunks.length, 1);
  assert.deepEqual(decodeCartSnapshot(chunks), lines);

  const many = Array.from({ length: 40 }, (_, index) => ({
    productId: 1000 + index,
    qty: 1,
    label: "S / Black",
  }));
  const split = encodeCartSnapshot(many);
  assert.ok(split.length > 1);
  assert.ok(split.every((chunk) => chunk.length <= 255));
  assert.deepEqual(decodeCartSnapshot(split), many);
});
