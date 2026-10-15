'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
export default function Failure() {
  const [m, setM] = useState('')
  useEffect(() => setM(new URLSearchParams(location.search).get('reason') || 'Payment failed'), [])
  return <div className="panel mx-auto max-w-xl"><h1 className="mb-2 text-2xl font-bold">Payment failed</h1><p>{m}</p><Link className="underline" href="/checkout">Try again</Link></div>
}
