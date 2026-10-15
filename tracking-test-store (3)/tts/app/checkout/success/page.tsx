'use client'
import { useEffect, useState } from 'react'
import { push } from '@/lib/datalayer'
import { saveCart } from '@/lib/cart'
import { scheduleAwinS2S } from '@/lib/awin'
export default function Success() {
  const [o, setO] = useState<any>(null)
  useEffect(() => {
    const id = new URLSearchParams(location.search).get('order'); if (!id) return
    Promise.resolve(JSON.parse(localStorage.getItem(`tp_order_${id}`) || 'null')).then(order => {
      if (!order) return
      setO(order); sessionStorage.setItem('tp_last_order', order.id); saveCart([])
      if (sessionStorage.getItem('tp_purchase_fired') === order.id) return // no duplicate purchase on reload
      sessionStorage.setItem('tp_purchase_fired', order.id)
      push('purchase', { ecommerce: { net_value: +(order.subtotal - order.discount).toFixed(2),
discount: order.discount,transaction_id: order.transactionId, order_id: order.id, value: order.total, tax: order.tax, shipping: order.shipping, currency: 'GBP',
        coupon: order.voucherCode || undefined, items: order.items.map((i: any) => ({ item_id: i.productId, item_name: i.name, price: i.price, quantity: i.quantity, item_brand: i.brand, item_category: i.category, item_variant: i.variant })) } })
      scheduleAwinS2S(order) // server-side Conversion API call (15 s later, or on page leave)
    })
  }, [])
  if (!o) return <p className="my-4">Loading order…</p>
  return (<div className="panel mx-auto max-w-xl space-y-1"><h1 className="mb-2 text-2xl font-bold">Payment successful</h1>
    <p>Order ID: <b>{o.id}</b></p><p>Transaction ID: <b>{o.transactionId}</b></p><p>Status: {o.status}</p>
    <p>Total: £{o.total.toFixed(2)}{o.voucherCode && ` (voucher ${o.voucherCode})`}</p>
    <ul className="list-disc ml-5">{o.items.map((i: any) => <li key={i.productId}>{i.name} × {i.quantity}</li>)}</ul></div>)
}
