'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CartLine, getCart, toItem } from '@/lib/cart'
import { ecommerce, push } from '@/lib/datalayer'
import { getParams } from '@/lib/params'
import { totals, ShipMethod } from '@/lib/pricing'
import { applyVoucher, markVoucherUsed } from '@/lib/vouchers'
const ADDR = [['firstName','First name'],['lastName','Last name'],['address','Address'],['city','City'],['zip','Postcode'],['country','Country']]
export default function Checkout() {
  const r = useRouter()
  const [cart, setCart] = useState<CartLine[]>([]), [email, setEmail] = useState(''), [phone, setPhone] = useState('')
  const [bill, setBill] = useState<Record<string, string>>({ country: 'GB' }), [ship, setShip] = useState<Record<string, string>>({ country: 'GB' }), [same, setSame] = useState(true)
  const [method, setMethod] = useState<ShipMethod>('standard'), [code, setCode] = useState(''), [v, setV] = useState<any>(null)
  const [card, setCard] = useState('4242 4242 4242 4242'), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { const c = getCart().filter(l => !l.saved); setCart(c); if (c.length) ecommerce('begin_checkout', c.map(toItem)) }, [])
  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0)
  const t = totals(subtotal, v?.ok ? v.discount : 0, method)
  const apply = () => {
    const x = applyVoucher(code, subtotal)
    setV(x); if (x.ok) push('apply_coupon', { coupon: x.code, discount: x.discount })
  }
  const pay = async () => {
    if (!email || !bill.firstName || !bill.address) return setErr('Email, name and address are required.')
    setErr(''); setBusy(true)
    const items = cart.map(toItem)
    ecommerce('add_shipping_info', items, { shipping_tier: method, coupon: v?.ok ? v.code : undefined })
    ecommerce('add_payment_info', items, { payment_type: 'card', coupon: v?.ok ? v.code : undefined })
    const n = card.replace(/\s/g, '')
    const outcome = n === '4242424242424242' ? 'success' : n === '4000000000000002' ? 'declined' : n === '4000002500003155' ? 'pending' : 'invalid'
    setBusy(false)
    if (outcome === 'declined' || outcome === 'invalid') {
      const reason = outcome === 'declined' ? 'Your card was declined.' : 'Use one of the test cards listed on the page.'
      push('payment_failed', { error: reason }); return r.push(`/checkout/failure?reason=${encodeURIComponent(reason)}`)
    }
    const stamp = Date.now().toString().slice(-8)
    const order = { id: `ORD-${stamp}`, transactionId: `TXN-${stamp}`, status: outcome === 'pending' ? 'Pending' : 'Completed', email, phone, billing: bill, shippingAddress: same ? bill : ship,
      shippingMethod: method, voucherCode: v?.ok ? v.code : null, ...t, tracking: getParams(), createdAt: new Date().toISOString(),
      items: cart.map(l => ({ productId: l.id, name: l.name, brand: l.brand, category: l.category, price: l.price, quantity: l.qty, variant: l.variant })) }
    localStorage.setItem(`tp_order_${order.id}`, JSON.stringify(order))
    if (v?.ok) markVoucherUsed(v.code)
    r.push(`/checkout/${outcome}?order=${order.id}`)
  }
  const addr = (s: Record<string, string>, set: (x: Record<string, string>) => void) => ADDR.map(([k, l]) => <label key={k} className="block">{l}<input value={s[k] || ''} onChange={e => set({ ...s, [k]: e.target.value })} /></label>)
  if (!cart.length) return <p className="my-4">Your cart is empty.</p>
  return (<div className="grid md:grid-cols-2 gap-8 items-start"><div className="space-y-3 panel">
    <h1 className="text-2xl font-bold my-4">Guest checkout</h1>
    <label className="block">Email<input value={email} onChange={e => setEmail(e.target.value)} /></label>
    <label className="block">Phone<input value={phone} onChange={e => setPhone(e.target.value)} /></label>
    <h2 className="font-bold">Billing address</h2>{addr(bill, setBill)}
    <label><input type="checkbox" className="!w-auto" checked={same} onChange={e => setSame(e.target.checked)} /> Ship to billing address</label>
    {!same && <><h2 className="font-bold">Shipping address</h2>{addr(ship, setShip)}</>}
    <h2 className="font-bold">Shipping</h2>
    <select value={method} onChange={e => setMethod(e.target.value as ShipMethod)}><option value="standard">Standard (free over £100, else £5.90)</option><option value="express">Express (£12.90)</option></select>
  </div><div className="space-y-2 panel">
    <h2 className="font-bold my-4">Order summary</h2>
    {cart.map((l, i) => <div key={i} className="flex justify-between text-sm"><span>{l.name} ({l.variant}) × {l.qty}</span><span>£{(l.price * l.qty).toFixed(2)}</span></div>)}
    <div className="flex gap-2"><input value={code} onChange={e => setCode(e.target.value)} placeholder="Voucher code" /><button className="btn-ghost" onClick={apply}>Apply</button></div>
    {v && !v.ok && <p className="text-red-600 text-sm">{v.error}</p>}
    <div className="flex justify-between"><span>Subtotal</span><span>£{t.subtotal.toFixed(2)}</span></div>
    {t.discount > 0 && <div className="flex justify-between text-green-700"><span>Discount ({v.code})</span><span>-£{t.discount.toFixed(2)}</span></div>}
    <div className="flex justify-between"><span>Shipping</span><span>£{t.shipping.toFixed(2)}</span></div>
    <div className="flex justify-between"><span>Tax (20%)</span><span>£{t.tax.toFixed(2)}</span></div>
    <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>£{t.total.toFixed(2)}</span></div>
    <h2 className="font-bold pt-4">Payment (test mode)</h2>
    <input value={card} onChange={e => setCard(e.target.value)} />
    <div className="text-xs text-gray-600">Test cards, click to use:
      {[['4242 4242 4242 4242', 'Success'], ['4000 0000 0000 0002', 'Declined'], ['4000 0025 0000 3155', '3DS / pending']].map(([n, l]) => <button key={n} className="underline block" onClick={() => setCard(n)}>{l}: {n}</button>)}</div>
    {err && <p className="text-red-600 text-sm">{err}</p>}
    <button disabled={busy} className="btn w-full" onClick={pay}>{busy ? 'Processing…' : `Pay £${t.total.toFixed(2)}`}</button>
  </div></div>)
}
