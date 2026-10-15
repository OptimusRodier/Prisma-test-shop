'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { push } from '@/lib/datalayer'
const F = [['firstName','First name'],['lastName','Last name'],['email','Email'],['phone','Telephone'],['country','Country'],['city','City'],['source','Source'],['message','Message']]
export default function LeadForm() {
  const r = useRouter(), [d, setD] = useState<Record<string, string>>({ type: 'Contact request', country: 'GB' })
  useEffect(() => { const t = new URLSearchParams(location.search).get('type'); if (t) setD(x => ({ ...x, type: t })); push('view_item', { lead_type: t }) }, [])
  const go = (e: React.MouseEvent) => { e.preventDefault(); sessionStorage.setItem('tp_lead_draft', JSON.stringify(d)); push('lead_form_submit', { lead_type: d.type }); r.push('/lead/review') }
  return (<div className="panel max-w-md space-y-3"><h1 className="text-2xl font-bold my-4">{d.type}</h1>
    {F.map(([k, l]) => <label key={k} className="block">{l}{k === 'message' ? <textarea value={d[k] || ''} onChange={e => setD({ ...d, [k]: e.target.value })} /> : <input value={d[k] || ''} onChange={e => setD({ ...d, [k]: e.target.value })} />}</label>)}
    <button className="btn" onClick={go}>Review</button></div>)
}
