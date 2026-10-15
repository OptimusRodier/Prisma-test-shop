'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ecommerce } from '@/lib/datalayer'
import { getCart, saveCart } from '@/lib/cart'
import { money } from '@/lib/products'
import SafeImg from './SafeImg'
export default function ProductView({ p }: { p: any }) {
  const [size, setSize] = useState(p.sizes.includes('M') ? 'M' : p.sizes[0] || ''), [qty, setQty] = useState(1), [added, setAdded] = useState(false)
  const variant = size || 'Default'
  const item = (q = qty) => ({ item_id: p.id, item_name: p.name, price: p.price, quantity: q, item_brand: p.brand, item_category: p.category, item_variant: variant })
  useEffect(() => { ecommerce('view_item', [item(1)]) }, []) // eslint-disable-line
  const add = () => {
    const cart = getCart(), ex = cart.find(l => l.id === p.id && l.variant === variant && !l.saved)
    if (ex) ex.qty += qty; else cart.push({ id: p.id, name: p.name, price: p.price, qty, variant, brand: p.brand, category: p.category })
    saveCart(cart); ecommerce('add_to_cart', [item()]); setAdded(true)
  }
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-white p-10"><SafeImg p={p} className="max-h-full max-w-full object-contain" /></div>
      <div className="space-y-4 self-center">
        <Link href={`/products?category=${encodeURIComponent(p.category)}`} className="text-sm text-[#2B50F5]">{p.category}</Link>
        <h1 className="text-3xl font-bold leading-tight">{p.name}</h1>
        <p className="text-3xl font-bold">{money(p.price)} <span className="text-sm font-normal text-slate-500">inc. VAT</span></p>
        <p className="text-slate-600">{p.description}</p>
        <p className="text-xs text-slate-500">Product ID {p.id} · SKU {p.sku} · {p.stock} in stock</p>
        {p.sizes.length > 0 && <label className="block text-sm font-medium">Size<select value={size} onChange={e => setSize(e.target.value)}>{p.sizes.map((s: string) => <option key={s}>{s}</option>)}</select></label>}
        <label className="block text-sm font-medium">Quantity<input type="number" min={1} max={p.stock} value={qty} onChange={e => setQty(Math.max(1, +e.target.value || 1))} className="!w-24" /></label>
        <button className="btn w-full md:w-auto" onClick={add}>Add to basket</button>
        {added && <p className="text-sm text-green-700">Added to your basket. <Link className="underline" href="/cart">View basket</Link></p>}
      </div>
    </div>
  )
}
