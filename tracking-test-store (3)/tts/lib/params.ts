export const TRACK_KEYS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','msclkid','awc','clickref','publisher'] as const
const KEY = 'tp_params'
export function getParams(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
// Call on every page load: merges any tracking params found in the URL into storage.
export function captureParams() {
  const q = new URLSearchParams(window.location.search)
  const cur = getParams()
  let changed = false
  TRACK_KEYS.forEach(k => { const v = q.get(k); if (v && cur[k] !== v) { cur[k] = v; changed = true } })
  if (changed) {
    localStorage.setItem(KEY, JSON.stringify(cur))
  }
  return cur
}
export const clearParams = () => localStorage.removeItem(KEY)
