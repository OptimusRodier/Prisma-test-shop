import { NextRequest, NextResponse } from 'next/server'

// Server-side capture of the Awin click ID, so the Conversion API route can read it later.
// - awc         : Awin click checksum (HttpOnly + Secure, as Awin's docs recommend)
// - aw_channel  : last paid click referrer ('aw' = Awin, 'other' = any other paid/campaign source)
// TEST-SITE SIMPLIFICATION: cookies are set without checking consent. On a client site, gate this on consent.
const MAX_AGE = 60 * 60 * 24 * 30 // keep equal to the attribution window configured in Awin
const OTHER_CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid']

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const q = req.nextUrl.searchParams
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: MAX_AGE }

  const awc = q.get('awc')
  const src = (q.get('utm_source') || '').toLowerCase()
  const isAwin = !!awc || src === 'awin' || src === 'aw'
  const isOther = OTHER_CLICK_IDS.some(k => q.get(k)) || (!!src && src !== 'awin' && src !== 'aw')

  if (awc) res.cookies.set('awc', awc, opts)
  if (isAwin) res.cookies.set('aw_channel', 'aw', opts)
  else if (isOther) res.cookies.set('aw_channel', 'other', opts) // last click wins
  return res
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'] }
