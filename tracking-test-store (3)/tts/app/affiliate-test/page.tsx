'use client'
import { useEffect, useState } from 'react'
import { captureParams, clearParams, getParams } from '@/lib/params'
export default function AffiliateTest() {
  const [p, setP] = useState<Record<string, string>>({}), [awc, setAwc] = useState('123'), [clickref, setClickref] = useState('test'), [publisher, setPublisher] = useState('999')
  useEffect(() => setP(getParams()), [])
  const link = typeof window !== 'undefined' ? `${location.origin}/products?awc=${awc}&clickref=${clickref}&publisher=${publisher}` : ''
  return (<div className="space-y-3 panel max-w-lg">
    <h1 className="text-2xl font-bold my-4">Affiliate simulation</h1>
    <label>awc<input value={awc} onChange={e => setAwc(e.target.value)} /></label>
    <label>clickref<input value={clickref} onChange={e => setClickref(e.target.value)} /></label>
    <label>publisher<input value={publisher} onChange={e => setPublisher(e.target.value)} /></label>
    <a className="btn" href={link}>Land on the store with these values</a>
    <h2 className="font-bold pt-4">Persisted values</h2>
    <pre className="bg-slate-100 rounded-lg p-3 text-sm">{JSON.stringify(p, null, 2)}</pre>
    <button className="btn-ghost" onClick={() => { clearParams(); setP({}) }}>Clear</button>{' '}
    <button className="btn-ghost" onClick={() => setP(captureParams())}>Refresh</button>
  </div>)
}
