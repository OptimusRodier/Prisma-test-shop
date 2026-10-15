'use client'
import { useEffect, useState } from 'react'
import { push } from '@/lib/datalayer'
export default function ThankYou() {
  const [l, setL] = useState<any>(null)
  useEffect(() => {
    const s = sessionStorage.getItem('tp_last_lead'); if (!s) return
    const lead = JSON.parse(s); setL(lead)
    if (sessionStorage.getItem('tp_lead_fired') !== lead.id) { // avoid duplicate event on reload
      push('generate_lead', { lead_id: lead.id, lead_type: lead.type, value: 0, currency: 'GBP' }); sessionStorage.setItem('tp_lead_fired', lead.id)
    }
  }, [])
  if (!l) return <p>No recent submission found.</p>
  return (<div className="panel mx-auto max-w-xl"><h1 className="mb-2 text-2xl font-bold">Thank you</h1>
    <p>Lead ID: <b>{l.id}</b></p><p>Submitted: {new Date(l.createdAt).toLocaleString()}</p>
    <pre className="bg-slate-100 rounded-lg p-3 text-sm mt-3">{JSON.stringify(l, null, 2)}</pre></div>)
}
