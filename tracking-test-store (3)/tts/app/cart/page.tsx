'use client'
import { useEffect, useState } from 'react'
import { CartLine, getCart, saveCart, toItem } from '@/lib/cart'
import { ecommerce, push } from '@/lib/datalayer'
import { applyVoucher } from '@/lib/vouchers'
export default function Cart() {
  const [cart, setCart] = useState<CartLine[]>([]), [code, setCode] = useState(''), [v, setV] = useState<any>(null), [msg, setMsg] = useState(''), [ship, setShip] = useState<'standard' | 'express'>('standard')
  useEffect(() => { const c = getCart(); setCart(c); ecommerce('view_cart', c.filter(l => !l.saved).map(toItem)) }, [])
  const update = (c: CartLine[]) => { setCart(c); saveCart(c) }
  const active = cart.filter(l => !l.saved)
  const subtotal = active.reduce((s, l) => s + l.price * l.qty, 0)
  const discount = v?.ok ? Math.min(v.discount, subtotal) : 0
  const shipping = active.length ? (ship === 'express' ? 12.9 : subtotal - discount > 100 ? 0 : 5.9) : 0
  const tax = (subtotal - discount) * 0.2 // 20% VAT shown as included-style estimate
  const total = subtotal - discount + shipping + tax
  const remove = (i: number) => { ecommerce('remove_from_cart', [toItem(cart[i])]); update(cart.filter((_, j) => j !== i)) }
  const apply = () => {
    const r = applyVoucher(code, subtotal)
    setV(r); setMsg(r.ok ? '' : r.error!); if (r.ok) push('apply_coupon', { coupon: r.code, discount: r.discount })
  }
  return (<>
    <h1 className="text-2xl font-bold my-4">Basket</h1>
    {cart.length === 0 && <p>Your cart is empty.</p>}
    {cart.map((l, i) => (
      <div key={i} className="flex items-center gap-4 border-b py-2">
        <div className="flex-1">{l.name}<div className="text-sm text-gray-500">{l.variant}{l.saved && ' · saved for later'}</div></div>
        {!l.saved && <input className="!w-16" type="number" min={1} value={l.qty} onChange={e => update(cart.map((x, j) => j === i ? { ...x, qty: Math.max(1, +e.target.value || 1) } : x))} />}
        <div>£{(l.price * l.qty).toFixed(2)}</div>
        <button className="underline text-sm" onClick={() => update(cart.map((x, j) => j === i ? { ...x, saved: !x.saved } : x))}>{l.saved ? 'Move to cart' : 'Save for later'}</button>
        <button className="underline text-sm" onClick={() => remove(i)}>Remove</button>
      </div>))}
    {active.length > 0 && <div className="panel max-w-sm ml-auto mt-6 space-y-2">
      <div className="flex gap-2"><input value={code} onChange={e => setCode(e.target.value)} placeholder="Voucher (WELCOME10, SUMMER15, TEST25, VIP50)" /><button className="btn-ghost" onClick={apply}>Apply</button></div>
      {msg && <p className="text-red-600 text-sm">{msg}</p>}
      <select value={ship} onChange={e => setShip(e.target.value as any)}><option value="standard">Standard (free over £100, else £5.90)</option><option value="express">Express (£12.90)</option></select>
      <div className="flex justify-between"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
      {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount ({v.code})</span><span>-£{discount.toFixed(2)}</span></div>}
      <div className="flex justify-between"><span>Shipping</span><span>£{shipping.toFixed(2)}</span></div>
      <div className="flex justify-between"><span>Tax (20%)</span><span>£{tax.toFixed(2)}</span></div>
      <div className="flex justify-between font-bold border-t pt-2"><span>Total</span><span>£{total.toFixed(2)}</span></div>
      <a className="btn w-full" href="/checkout">Checkout as guest</a>
    </div>}
  </>)
}
