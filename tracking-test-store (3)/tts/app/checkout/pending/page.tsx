'use client'
import { useEffect, useState } from 'react'
export default function Pending() {
  const [id, setId] = useState('')
  useEffect(() => setId(new URLSearchParams(location.search).get('order') || ''), [])
  return <div className="panel mx-auto max-w-xl"><h1 className="mb-2 text-2xl font-bold">Payment pending</h1><p>Order <b>{id}</b> is awaiting 3-D Secure confirmation. The purchase event is not fired until payment completes.</p></div>
}
