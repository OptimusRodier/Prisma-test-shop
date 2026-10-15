'use client'
import { useEffect, useState } from 'react'
import { getConsent, setConsent, Consent } from '@/lib/datalayer'
export default function ConsentBanner() {
  const [show, setShow] = useState(false), [custom, setCustom] = useState(false)
  const [c, setC] = useState<Consent>({ analytics: false, ads: false, personalization: false })
  useEffect(() => {
    const s = getConsent()
    if (s) { setConsent(s) } else setShow(true) // restore stored state on each load
  }, [])
  const save = (v: Consent) => { setConsent(v); setShow(false) }
  if (!show) return null
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t shadow-lg p-4" role="dialog" aria-label="Cookie consent">
      <p className="text-sm mb-3">We use cookies for analytics and advertising. Choose what you allow.</p>
      {custom && (['analytics','ads','personalization'] as const).map(k => (
        <label key={k} className="mr-4 text-sm"><input type="checkbox" checked={c[k]} onChange={e => setC({ ...c, [k]: e.target.checked })} /> {k}</label>
      ))}
      <div className="mt-3 flex gap-2">
        <button className="btn !py-1.5" onClick={() => save({ analytics: true, ads: true, personalization: true })}>Accept</button>
        <button className="btn-ghost !py-1.5" onClick={() => save({ analytics: false, ads: false, personalization: false })}>Reject</button>
        {custom ? <button className="btn-ghost !py-1.5" onClick={() => save(c)}>Save choices</button>
                : <button className="btn-ghost !py-1.5" onClick={() => setCustom(true)}>Customize</button>}
      </div>
    </div>
  )
}
