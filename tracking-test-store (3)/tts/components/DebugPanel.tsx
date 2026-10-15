'use client'
import { useEffect, useState } from 'react'
export default function DebugPanel() {
  const [on, setOn] = useState(false), [, tick] = useState(0)
  useEffect(() => { setOn(new URLSearchParams(location.search).get('debug') === 'true'); const t = setInterval(() => tick(n => n + 1), 1000); return () => clearInterval(t) }, [])
  if (!on) return null
  const dump = (s: Storage) => Object.fromEntries(Object.keys(s).map(k => [k, s.getItem(k)]))
  const ls = dump(localStorage), ss = dump(sessionStorage)
  const sec = (t: string, d: unknown) => <details open><summary className="font-bold">{t}</summary><pre className="whitespace-pre-wrap break-all">{JSON.stringify(d, null, 1)}</pre></details>
  return (
    <div className="fixed top-0 right-0 w-[420px] max-h-screen overflow-auto bg-black/90 text-green-300 text-xs p-3 z-[100]">
      <b>DEBUG</b>
      {sec('Consent', ls.tp_consent ? JSON.parse(ls.tp_consent) : 'not set')}
      {sec('Tracking params', ls.tp_params ? JSON.parse(ls.tp_params) : {})}
      {sec('Order / Lead IDs', { lastOrder: ss.tp_last_order ?? null, lastLead: ss.tp_last_lead ? JSON.parse(ss.tp_last_lead).id : null })}
      {sec('dataLayer (latest 15)', (window.dataLayer || []).slice(-15))}
      {sec('Cookies', document.cookie)}
      {sec('localStorage', ls)}
      {sec('sessionStorage', ss)}
    </div>
  )
}
