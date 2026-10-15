import './globals.css'
import Link from 'next/link'
import Script from 'next/script'
import { Manrope, Bricolage_Grotesque } from 'next/font/google'
import Tracker from '@/components/Tracker'
import ConsentBanner from '@/components/ConsentBanner'
import DebugPanel from '@/components/DebugPanel'
import Header from '@/components/Header'
import { BOOKING_URL } from '@/lib/booking'
const body = Manrope({ subsets: ['latin'], variable: '--font-body' })
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' })
const GTM = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P8BV7VTS'
export const metadata = { title: 'tracklab.store' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}><head>
      {/* 1. Consent Mode defaults (denied) must run before GTM */}
      <Script id="consent-default" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html:
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
         gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});` }} />
      {/* 2. GTM head snippet */}
      <Script id="gtm" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html:
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');` }} />
    </head><body>
      {/* 3. GTM noscript, immediately after <body> */}
      <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} /></noscript>
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">{children}</main>
      <footer className="mt-16 bg-[#0E1726] py-10 text-sm text-slate-300"><div className="mx-auto flex max-w-6xl flex-wrap gap-6 px-4">
        <span className="font-display text-lg font-bold text-white">tracklab.store</span>
        <span className="text-slate-400">A test shop for tracking and attribution. Nothing here is real: payments are simulated.</span>
        <Link href="/products" className="ml-auto">Shop</Link><Link href="/lead">Get a quote</Link><a href={BOOKING_URL}>Book now</a></div></footer>
      <Tracker /><ConsentBanner /><DebugPanel />
    </body></html>
  )
}
