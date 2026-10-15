import Link from 'next/link'
import { LEAD_TYPES } from '@/components/leadTypes'
export default function LeadLanding() {
  return (<>
    <h1 className="text-3xl font-bold my-4">Get a quote</h1>
    <div className="grid md:grid-cols-3 gap-4">{LEAD_TYPES.map(t => <Link key={t} href={`/lead/form?type=${encodeURIComponent(t)}`} className="panel font-semibold transition hover:border-[#2B50F5]">{t}</Link>)}</div>
  </>)
}
