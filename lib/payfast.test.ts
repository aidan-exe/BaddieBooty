import assert from "node:assert/strict";
import test from "node:test";
import {
  isPayfastRangeIp,
  md5Hex,
  parseUrlEncoded,
  phpUrlEncode,
  safeEqual,
  signatureForFields,
} from "./payfast.ts";

test("matches PHP urlencode and the documented signature example", () => {
  assert.equal(phpUrlEncode("First Name"), "First+Name");
  assert.equal(phpUrlEncode("http://example.com/a b"), "http%3A%2F%2Fexample.com%2Fa+b");
  assert.equal(phpUrlEncode("Order#123"), "Order%23123");

  const fields: Array<[string, string]> = [
    ["merchant_id", "10000100"],
    ["merchant_key", "46f0cd694581a"],
    ["return_url", "http://www.yourdomain.co.za/return.php"],
    ["cancel_url", "http://www.yourdomain.co.za/cancel.php"],
    ["notify_url", "http://www.yourdomain.co.za/notify.php"],
    ["name_first", "First Name"],
    ["name_last", "Last Name"],
    ["email_address", "test@test.com"],
    ["m_payment_id", "1234"],
    ["amount", "10.00"],
    ["item_name", "Order#123"],
  ];
  const { signature } = signatureForFields(fields, "jt7NOE43FZPn", true);
  assert.equal(signature, "8317e2bbd1ae2a6f4f36837e83be4ca9");
  assert.equal(md5Hex("abc"), "900150983cd24fb0d6963f7d28e17f72");
});

test("skips blank payment fields and verifies an ITN in received order", () => {
  const fields: Array<[string, string]> = [
    ["merchant_id", "10000100"],
    ["merchant_key", "46f0cd694581a"],
    ["return_url", ""],
    ["amount", "10.00"],
  ];
  const { signature, paramString } = signatureForFields(fields, "jt7NOE43FZPn", true);
  assert.equal(paramString.includes("return_url"), false);

  const body = `m_payment_id=BB-1&pf_payment_id=99&payment_status=COMPLETE&amount_gross=10.00&merchant_id=10000100&custom_str1=flat_rate&signature=${signature}`;
  const pairs = parseUrlEncoded(
    `merchant_id=10000100&merchant_key=46f0cd694581a&amount=10.00&signature=${signature}`,
  );
  const signed: Array<[string, string]> = [];
  for (const pair of pairs) {
    if (pair.key === "signature") break;
    signed.push([pair.key, pair.value]);
  }
  const check = signatureForFields(signed, "jt7NOE43FZPn", false);
  assert.equal(safeEqual(check.signature, signature), true);
  assert.equal(parseUrlEncoded(body).find((pair) => pair.key === "amount_gross")?.value, "10.00");
});

test("recognises PayFast published source ranges", () => {
  assert.equal(isPayfastRangeIp("197.97.145.144"), true);
  assert.equal(isPayfastRangeIp("197.97.145.159"), true);
  assert.equal(isPayfastRangeIp("197.97.145.160"), false);
  assert.equal(isPayfastRangeIp("::ffff:41.74.179.200"), true);
  assert.equal(isPayfastRangeIp("102.216.36.10"), true);
  assert.equal(isPayfastRangeIp("102.216.36.130"), true);
  assert.equal(isPayfastRangeIp("144.126.193.139"), true);
  assert.equal(isPayfastRangeIp("1.1.1.1"), false);
  assert.equal(isPayfastRangeIp("not-an-ip"), false);
});
