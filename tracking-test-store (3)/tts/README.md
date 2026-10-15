# Tracking Test Store

Next.js 14 store and lead-gen funnel for GTM / GA4 / affiliate testing.

## Local setup
```bash
npm install
cp .env.example .env     # set NEXT_PUBLIC_GTM_ID
npm run dev
```

## Vercel
Set `NEXT_PUBLIC_GTM_ID` in Project Settings and deploy. No database or other services needed.

## GTM location
`app/layout.tsx`: Consent Mode defaults run first, then the GTM head snippet, then the noscript iframe right after `<body>`. Container ID defaults to `GTM-P8BV7VTS`; override with `NEXT_PUBLIC_GTM_ID`.

## Consent
Defaults are denied. The banner stores `tp_consent` in localStorage, sends a `['consent','update',{...}]` command and a `consent_update` event. Choices are restored on every page load.

## DataLayer events implemented
| Event | Fired from |
|---|---|
| page_view | every route change (components/Tracker) |
| view_item | product page; lead form |
| select_item | product card click |
| add_to_cart / remove_from_cart | product page / cart |
| view_cart | cart page |
| apply_coupon | cart, on valid voucher |
| search | product search results |
| begin_checkout, add_shipping_info, add_payment_info | /checkout (the last two fire on Pay) |
| purchase | /checkout/success, once per order (value, tax, shipping, coupon, transaction_id, items) |
| payment_failed | declined card |
| generate_lead | /lead/thank-you (once per lead) |
| lead_form_submit, lead_review | lead funnel steps |
| consent_update | consent banner |

Ecommerce events use the GA4 shape (`ecommerce.items[]`) with `ecommerce: null` pushed first. Every push also carries `tracking_params` (utm_*, gclid, gbraid, wbraid, fbclid, msclkid, awc, clickref, publisher).

## Debug panel
Add `?debug=true` to any URL.

## Voucher codes
WELCOME10 (10%, one-time), SUMMER15 (15%, expires in 90 days), TEST25 (€25 off), VIP50 (50%), EXPIRED5 (expired, for negative tests).

## Checkout and leads
No database. The 100-product catalog (real products from the Awin feed `datafeed_45628`, GBP) and voucher codes live in code (`lib/products.json`, `lib/vouchers.ts`). Checkout is guest-only; the card is simulated with Stripe test numbers (4242… success, 4000 0000 0000 0002 declined, 4000 0025 0000 3155 pending). Order and lead IDs are generated in the browser (`ORD-`/`TXN-`/`LEAD-` + timestamp digits), kept only in localStorage/sessionStorage so the confirmation pages can display them. One-time voucher use is tracked in localStorage.

Scope stops at tracking the `purchase` and `generate_lead` events.
