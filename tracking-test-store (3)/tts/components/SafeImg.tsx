'use client'
import { useState } from 'react'
// Shows the merchant image; falls back to the Awin-hosted copy if it fails to load.
export default function SafeImg({ p, className = '' }: { p: { image: string; imageFallback: string; name: string }; className?: string }) {
  const [src, setSrc] = useState(p.image)
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={p.name} loading="lazy" referrerPolicy="no-referrer" className={className} onError={() => p.imageFallback && src !== p.imageFallback && setSrc(p.imageFallback)} />
}
