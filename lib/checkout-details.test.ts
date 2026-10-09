import assert from "node:assert/strict";
import test from "node:test";
import { normalizePostcode, normalizeSaPhone, validateCustomer } from "./checkout-details.ts";

test("accepts South African phone formats", () => {
  assert.equal(normalizeSaPhone("082 123 4567"), "0821234567");
  assert.equal(normalizeSaPhone("082-123-4567"), "0821234567");
  assert.equal(normalizeSaPhone("+27 82 123 4567"), "0821234567");
  assert.equal(normalizeSaPhone("+27821234567"), "0821234567");
  assert.equal(normalizeSaPhone("27821234567"), "0821234567");
  assert.equal(normalizeSaPhone("(031) 555 1234"), "0315551234");
  assert.equal(normalizeSaPhone("082 123 456"), null);
  assert.equal(normalizeSaPhone("+1 555 123 4567"), null);
  assert.equal(normalizeSaPhone("0921234567"), null);
});

test("accepts 4-digit postcodes", () => {
  assert.equal(normalizePostcode("4390"), "4390");
  assert.equal(normalizePostcode("43 90"), "4390");
  assert.equal(normalizePostcode("439"), null);
  assert.equal(normalizePostcode("43901"), null);
  assert.equal(normalizePostcode("ABCD"), null);
});

test("requires billing fields and skips shipping until requested", () => {
  const missing = validateCustomer({ billing: {}, shipToDifferent: false, notes: "" });
  assert.equal(missing.ok, false);
  if (!missing.ok) {
    assert.ok(missing.errors["billing.firstName"]);
    assert.ok(missing.errors["billing.postcode"]);
    assert.ok(missing.errors["billing.phone"]);
    assert.equal(missing.errors["shipping.city"], undefined);
  }

  const ok = validateCustomer({
    billing: {
      firstName: "Tiara",
      lastName: "Naidoo",
      company: "",
      address1: "12 Salt Rock Road",
      address2: "",
      city: "Salt Rock",
      province: "KZN",
      postcode: "4390",
      phone: "+27 68 134 6074",
      email: "tiara@baddiebooty.co.za",
    },
    shipToDifferent: false,
    notes: "Leave at the studio gate.",
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.value.billing.phone, "0681346074");
    assert.equal(ok.value.billing.provinceName, "KwaZulu-Natal");
    assert.equal(ok.value.shipping.city, "Salt Rock");
    assert.equal(ok.value.shipping.country, "ZA");
  }
});
