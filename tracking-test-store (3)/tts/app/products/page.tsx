import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import SearchTracker from '@/components/SearchTracker'
import { PRODUCTS, CATEGORIES } from '@/lib/products'
export const dynamic = 'force-dynamic'
export default function Products({ searchParams }: { searchParams: { category?: string; q?: string; sort?: string } }) {
  const { category, q, sort } = searchParams
  let list = PRODUCTS.filter(p => (!category || p.category === category) && (!q || p.name.toLowerCase().includes(q.toLowerCase())))
  if (sort === 'asc') list = [...list].sort((a, b) => a.price - b.price); if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price)
  const href = (c?: string) => `/products?${new URLSearchParams({ ...(c ? { category: c } : {}), ...(q ? { q } : {}), ...(sort ? { sort } : {}) })}`
  return (<div className="grid gap-8 md:grid-cols-[200px_1fr]">
    <aside className="space-y-1 text-sm"><h2 className="mb-2 font-bold">Categories</h2>
      {[undefined, ...CATEGORIES].map(c => <Link key={c ?? 'all'} href={href(c)} className={`block rounded-lg px-3 py-2 ${c === category ? 'bg-[#2B50F5] text-white' : 'hover:bg-white'}`}>{c ?? 'All products'}</Link>)}</aside>
    <div>
      <form className="mb-4 flex flex-wrap items-center gap-2"><input name="q" defaultValue={q} placeholder="Search products" className="!w-64" />
        {category && <input type="hidden" name="category" value={category} />}
        <select name="sort" defaultValue={sort || ''} className="!w-48"><option value="">Featured</option><option value="asc">Price: low to high</option><option value="desc">Price: high to low</option></select>
        <button className="btn-ghost">Apply</button><span className="ml-auto text-sm text-slate-500">{list.length} products</span></form>
      {q && <SearchTracker q={q} />}
      {list.length === 0 && <p className="panel">No products match that search.</p>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{list.map(p => <ProductCard key={p.id} p={p} list={category || 'All products'} />)}</div>
    </div></div>)
}
