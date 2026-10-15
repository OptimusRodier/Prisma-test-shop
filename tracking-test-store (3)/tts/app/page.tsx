import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import SafeImg from '@/components/SafeImg'
import { PRODUCTS, CATEGORIES } from '@/lib/products'
export default function Home() {
  const hero = [PRODUCTS.find(p => p.category === 'TV & Audio'), PRODUCTS.find(p => p.category === 'Headphones'), PRODUCTS.find(p => p.category === 'Keyboards'), PRODUCTS.find(p => p.category === 'Smart Home')].filter(Boolean) as typeof PRODUCTS
  return (<div className="space-y-12">
    <section className="grid items-center gap-8 overflow-hidden rounded-3xl bg-[#0E1726] p-8 text-white md:grid-cols-2 md:p-12">
      <div className="space-y-5">
        <h1 className="text-4xl font-extrabold leading-[1.05] md:text-6xl">Tech, audio and clothing, delivered.</h1>
        <p className="max-w-md text-slate-300">One hundred real products from our partner feed. Free delivery over £100.</p>
        <div className="flex gap-3"><Link href="/products" className="btn">Shop all products</Link><Link href="/lead" className="btn-ghost !bg-transparent !text-white !border-slate-500">Get a quote</Link></div>
      </div>
      <div className="grid grid-cols-2 gap-3">{hero.map(p => <Link key={p.id} href={p.url} className="flex aspect-square items-center justify-center rounded-2xl bg-white p-5"><SafeImg p={p} className="max-h-full max-w-full object-contain" /></Link>)}</div>
    </section>
    <section><h2 className="mb-4 text-2xl font-bold">Shop by category</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{CATEGORIES.map(c => <Link key={c} href={`/products?category=${encodeURIComponent(c)}`} className="panel !p-5 font-semibold transition hover:border-[#2B50F5]">{c}<div className="text-xs font-normal text-slate-500">{PRODUCTS.filter(p => p.category === c).length} products</div></Link>)}</div></section>
    <section><h2 className="mb-4 text-2xl font-bold">Featured</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{PRODUCTS.filter((_, i) => i % 12 === 0).slice(0, 8).map(p => <ProductCard key={p.id} p={p} list="Home featured" />)}</div></section>
  </div>)
}
