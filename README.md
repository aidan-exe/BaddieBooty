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
| `PAYFAST_MERCHANT_ID` | Merchant id from the PayFast dashboard |
| `PAYFAST_MERCHANT_KEY` | Merchant key from the PayFast dashboard |
| `PAYFAST_PASSPHRASE` | Passphrase salt. Leave unset only when the dashboard passphrase is empty |
| `PAYFAST_SANDBOX` | `true` posts to `sandbox.payfast.co.za`. `false` posts to live PayFast |
| `PAYFAST_SITE_URL` | Optional origin for the return, cancel, and notify URLs |

When `PAYFAST_SANDBOX` is not `false` and the merchant id is unset, the app uses PayFast's public sandbox merchant (`10000100` / `46f0cd694581a`) and posts to `sandbox.payfast.co.za`. That test merchant accepts the payment form without a signature. PayFast's docs also show the sample passphrase `jt7NOE43FZPn`, and signatures made with it are rejected by the sandbox, so leave `PAYFAST_PASSPHRASE` empty until you use a merchant account that has a passphrase saved. A non-empty passphrase adds the MD5 signature to the payment form and the ITN route checks it. Set `PAYFAST_SANDBOX=false` plus the live credentials before taking real payments. Do not commit live keys.

The server prices every order from the catalogue. Flat rate is R180 (Durban dispatch, 2–5 working days). Overnight Shipping is R280. The coupon `BADDIE10` is a local 10% stub: the public Woo Store API does not list the studio's coupons.

`POST /api/payfast/notify` is the ITN endpoint. When `PAYFAST_PASSPHRASE` is set, it checks the MD5 signature with that passphrase. It always checks the caller IP against PayFast's published ranges and hostnames, recomputes the amount from the catalogue using the cart snapshot echoed in the ITN, then confirms the payload with PayFast's validate endpoint. Order status is appended to the application log (`baddie-order` lines, plus `.data/orders.jsonl` when the disk is writable). There is no database: the snapshot is enough to recompute the total, and Vercel instances do not share a filesystem. The notify URL has to be public HTTPS. Deployment Protection on a preview will block PayFast, so ITNs need a production deployment or a preview with protection disabled.

Set the live passphrase to an empty value in the environment only when the PayFast dashboard passphrase is empty. A mismatch is the usual cause of a rejected signature.
