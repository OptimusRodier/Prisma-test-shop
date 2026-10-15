'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCart } from '@/lib/cart'
import { BOOKING_URL } from '@/lib/booking'
export default function Header() {
  const [n, setN] = useState(0)
  useEffect(() => { const u = () => setN(getCart().filter(l => !l.saved).reduce((s, l) => s + l.qty, 0)); u(); window.addEventListener('cart:update', u); window.addEventListener('storage', u); return () => { window.removeEventListener('cart:update', u); window.removeEventListener('storage', u) } }, [])
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">tracklab<span className="text-[#2B50F5]">.</span>store</Link>
        <form action="/products" className="hidden flex-1 md:block"><input name="q" placeholder="Search products" className="!rounded-full !bg-slate-100 !border-transparent" /></form>
        <nav className="ml-auto flex items-center gap-5 text-sm font-medium">
          <Link href="/products">Shop</Link><Link href="/lead">Get a quote</Link><a href={BOOKING_URL} className="rounded-full border border-[#2B50F5] px-3 py-1 text-[#2B50F5] hover:bg-[#2B50F5] hover:text-white">Book now</a>
          <Link href="/cart" className="btn !py-1.5">Basket ({n})</Link>
        </nav>
      </div>
    </header>
  )
}
