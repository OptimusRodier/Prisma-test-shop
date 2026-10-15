'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { captureParams } from '@/lib/params'
import { push } from '@/lib/datalayer'
export default function Tracker() {
  const path = usePathname()
  useEffect(() => { captureParams(); push('page_view', { page_location: location.href, page_path: path, page_title: document.title }) }, [path])
  return null
}
