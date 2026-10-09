# Baddie Booty

Next.js shop for Baddie Booty in Salt Rock. The catalogue in `data/catalog.json` is mirrored from the WooCommerce store at [baddiebooty.co.za](https://baddiebooty.co.za/). Checkout charges through PayFast.

Routes: `/` `/shop` `/shop/[slug]` `/cart` `/checkout` `/checkout/success` `/checkout/cancel` `/checkout/failed` `/about` `/contact` `/privacy`

The bag stays in the browser under `baddie-booty-cart-v1`. Guest checkout details stay under `baddie-booty-checkout-v1`.

```bash
npm install
npm run dev
npm test
npm run build
```

## PayFast

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `PAYFAST_SNAPSHOT_SECRET` | Server-only HMAC key for the cart snapshot. Required everywhere |
| `PAYFAST_MERCHANT_ID` | Merchant id from the PayFast dashboard |
| `PAYFAST_MERCHANT_KEY` | Merchant key from the PayFast dashboard |
| `PAYFAST_PASSPHRASE` | Passphrase salt from that same account |
| `PAYFAST_SANDBOX` | `true` posts to `sandbox.payfast.co.za`. `false` posts to live PayFast |
| `PAYFAST_SITE_URL` | Optional origin for the return, cancel, and notify URLs |

`PAYFAST_SNAPSHOT_SECRET` has to be set or checkout shows “Payments are unavailable right now.” Generate one with `openssl rand -hex 32`. On Vercel production, `PAYFAST_SANDBOX` also has to be exactly `true` or `false`. Preview and local dev default to sandbox when it is unset.

Sandbox with no merchant id uses PayFast's public test merchant (`10000100` / `46f0cd694581a`). That shared merchant accepts an unsigned form and rejects signatures, including the sample passphrase `jt7NOE43FZPn` in PayFast's docs. A merchant's own sandbox account uses the passphrase saved on that account, and the payment form is signed. Live mode (`PAYFAST_SANDBOX=false`) requires the merchant id, key, and passphrase, rejects `10000100`, and always checks the PayFast signature. Do not commit live keys.

The server prices every order from the catalogue. Flat rate is R180 (Durban dispatch, 2–5 working days). Overnight Shipping is R280. The coupon field stays on the checkout page, and `coupons` in `lib/pricing.ts` is an empty list, so any code currently returns “That is not a valid code.” Add the studio's WooCommerce codes to that array when you have them: `code` (matched ignoring case), `type` of `percent` or `fixed`, `amount` (percent points, or whole rands for a fixed discount), and `label`. Discounts apply to merchandise only. Shipping is unchanged.

Each payment form carries an HMAC of the merchant id, order id, amount, shipping method, coupon, and cart snapshot, keyed with `PAYFAST_SNAPSHOT_SECRET`. `POST /api/payfast/notify` checks that HMAC before it trusts the echoed cart, so a buyer who edits the amount and the snapshot together, or replays a paid snapshot under another order id, is rejected. When a passphrase is set, or whenever sandbox is off, it also checks the PayFast MD5 signature. It checks the caller IP against PayFast's published ranges and hostnames, recomputes the amount from the catalogue, then confirms the payload with PayFast's validate endpoint. Order status is appended to the application log (`baddie-order` lines, plus `.data/orders.jsonl` when the disk is writable). There is no database. The return page does not clear the bag on its own and does not treat the visit as payment confirmation. When the receipt matches the order in the URL, the buyer can clear the bag. The notify URL has to be public HTTPS. Deployment Protection on a preview will block PayFast, so ITNs need a production deployment or a preview with protection disabled. Tests need Node `>=22.6`.
