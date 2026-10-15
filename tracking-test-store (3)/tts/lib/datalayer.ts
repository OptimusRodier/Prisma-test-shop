import { getParams } from './params'
declare global { interface Window { dataLayer: Record<string, any>[]; gtag?: (...a: any[]) => void } }

export type Item = { item_id: string; item_name: string; price: number; quantity?: number; item_brand?: string; item_category?: string; item_variant?: string }

export function push(event: string, data: Record<string, any> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  if (data.ecommerce) window.dataLayer.push({ ecommerce: null }) // GA4 best practice: clear before ecommerce events
  window.dataLayer.push({ event, ...data, tracking_params: getParams() })
}

export const ecommerce = (event: string, items: Item[], extra: Record<string, any> = {}) =>
  push(event, { ecommerce: { currency: 'GBP', value: +items.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0).toFixed(2), items, ...extra } })

export type Consent = { analytics: boolean; ads: boolean; personalization: boolean }
const CK = 'tp_consent'
export const getConsent = (): Consent | null => { try { return JSON.parse(localStorage.getItem(CK) || 'null') } catch { return null } }
const gm = (b: boolean) => (b ? 'granted' : 'denied')
export function setConsent(c: Consent) {
  localStorage.setItem(CK, JSON.stringify(c))
  const state = { analytics_storage: gm(c.analytics), ad_storage: gm(c.ads), ad_user_data: gm(c.ads), ad_personalization: gm(c.ads && c.personalization) }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(['consent', 'update', state] as any) // gtag-style command so GTM Consent Mode picks it up
  push('consent_update', { consent: state })
}
