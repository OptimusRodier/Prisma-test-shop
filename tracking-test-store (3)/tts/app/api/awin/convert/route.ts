import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products'
import { voucherDiscount } from '@/lib/vouchers'
import { AWIN_CONFIG } from '@/lib/awin-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Awin Conversion API: https://help.awin.com/apidocs/conversion-api
// Env vars (Vercel > Settings > Environment Variables):
// Defaults come from lib/awin-config.ts; the env vars AWIN_API_KEY, AWIN_ADVERTISER_ID, AWIN_IS_TEST override them
const clean = (s: unknown, n: number) => String(s ?? '').replace(/\|/g, ' ').slice(0, n) // pipes are forbidden by Awin

export async function POST(req: NextRequest) {
  const key = process.env.AWIN_API_KEY || AWIN_CONFIG.apiKey, mid = process.env.AWIN_ADVERTISER_ID || AWIN_CONFIG.advertiserId
  if (!key || !mid) return NextResponse.json({ ok: false, error: 'AWIN_API_KEY / AWIN_ADVERTISER_ID are not set' }, { status: 500 })

  let b: any
  try { b = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }) }

  // awc comes from the HttpOnly cookie set by middleware.ts, never from the request body
  const awc = req.cookies.get('awc')?.value
  if (!awc) return NextResponse.json({ ok: true, skipped: 'No awc cookie: nothing to attribute to Awin' })
  const channel = req.cookies.get('aw_channel')?.value || 'aw'

  // Stateless site: rebuild the amounts from the catalogue instead of trusting client prices
  const lines = (Array.isArray(b.items) ? b.items : []).flatMap((i: any) => {
    const p = PRODUCTS.find(x => x.id === String(i.productId))
    const quantity = Math.max(1, Math.floor(Number(i.quantity) || 1))
    return p ? [{ p, quantity }] : []
  })
  if (!lines.length || !b.transactionId) return NextResponse.json({ ok: false, error: 'No valid items or transactionId' }, { status: 400 })

  const subtotal = lines.reduce((s: number, l: any) => s + l.p.price * l.quantity, 0)
  const discount = voucherDiscount(b.voucherCode || '', subtotal)
  const amount = +(subtotal - discount).toFixed(2) // after discount, before tax and shipping (Awin definition)
  const isTest = process.env.AWIN_IS_TEST !== undefined ? process.env.AWIN_IS_TEST !== 'false' : AWIN_CONFIG.isTest

  const order: Record<string, any> = {
    orderReference: encodeURIComponent(clean(b.transactionId, 50)),
    amount,
    channel,
    currency: 'GBP',
    awc,
    isTest,
    commissionGroups: [{ code: 'DEFAULT', amount }],
    custom: { '1': 's2sAPI' },
    basket: lines.map((l: any) => ({
      id: clean(l.p.id, 75), name: clean(l.p.name, 255), price: l.p.price, quantity: l.quantity,
      commissionGroupCode: 'DEFAULT', category: clean(l.p.category, 255), sku: clean(l.p.sku, 255),
    })),
  }
  if (b.voucherCode && discount > 0) order.voucher = encodeURIComponent(String(b.voucherCode))

  const res = await fetch(`https://api.awin.com/s2s/advertiser/${encodeURIComponent(mid)}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key },
    body: JSON.stringify({ orders: [order] }),
    cache: 'no-store',
  })
  const text = await res.text()
  let response: any = text
  try { response = JSON.parse(text) } catch {}

  const out = {
    ok: res.status === 200 || res.status === 202, // 206 = partial: check response.failedOrders
    status: res.status,
    isTest,
    amountCheck: { server: amount, client: b.clientAmount ?? null, match: b.clientAmount == null ? null : Math.abs(amount - Number(b.clientAmount)) < 0.01 },
    sent: order,
    response,
  }
  console.log('[awin s2s]', JSON.stringify({ ref: order.orderReference, status: res.status, isTest, amount, channel }))
  return NextResponse.json(out)
}
