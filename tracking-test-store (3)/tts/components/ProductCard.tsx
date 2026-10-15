'use client'
import Link from 'next/link'
import { ecommerce } from '@/lib/datalayer'
import { money } from '@/lib/products'
import SafeImg from './SafeImg'
export default function ProductCard({ p, list }: { p: any; list: string }) {
  return (
    <Link href={p.url} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
      onClick={() => ecommerce('select_item', [{ item_id: p.id, item_name: p.name, price: p.price, item_brand: p.brand, item_category: p.category }], { item_list_name: list })}>
      <div className="flex aspect-square items-center justify-center bg-white p-6"><SafeImg p={p} className="max-h-full max-w-full object-contain transition group-hover:scale-105" /></div>
      <div className="flex flex-1 flex-col gap-1 border-t border-slate-100 p-4">
        <span className="text-xs text-slate-500">{p.brand} · {p.category}</span>
        <span className="line-clamp-2 text-sm font-semibold">{p.name}</span>
        <span className="mt-auto pt-2 text-lg font-bold">{money(p.price)}</span>
      </div>
    </Link>
  )
}
