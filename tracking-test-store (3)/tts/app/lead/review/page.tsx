'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getParams } from '@/lib/params'
import { push } from '@/lib/datalayer'
export default function Review() {
  const r = useRouter(), [d, setD] = useState<Record<string, string>>({}), [err, setErr] = useState('')
  useEffect(() => { setD(JSON.parse(sessionStorage.getItem('tp_lead_draft') || '{}')); push('lead_review') }, [])
  const submit = async () => {
    if (!d.firstName || !d.lastName || !d.email || !d.country) return setErr('First name, last name, email and country are required.')
    const lead = { ...d, id: `LEAD-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString(), tracking: getParams() }
    sessionStorage.setItem('tp_last_lead', JSON.stringify(lead)); sessionStorage.removeItem('tp_lead_draft'); r.push('/lead/thank-you')
  }
  return (<div className="panel max-w-md"><h1 className="text-2xl font-bold my-4">Review your details</h1>
    <pre className="bg-slate-100 rounded-lg p-3 text-sm">{JSON.stringify(d, null, 2)}</pre>{err && <p className="text-red-600">{err}</p>}
    <button className="btn-ghost mr-2" onClick={() => r.back()}>Edit</button><button className="btn" onClick={submit}>Confirm</button></div>)
}
