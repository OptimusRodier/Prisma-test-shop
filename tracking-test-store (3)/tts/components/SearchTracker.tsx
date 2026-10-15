'use client'
import { useEffect } from 'react'
import { push } from '@/lib/datalayer'
export default function SearchTracker({ q }: { q: string }) { useEffect(() => { push('search', { search_term: q }) }, [q]); return null }
