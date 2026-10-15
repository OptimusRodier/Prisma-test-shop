const day = 864e5
const VOUCHERS: Record<string, { type: 'PERCENT' | 'FIXED'; value: number; expires?: number; oneTime?: boolean }> = {
  WELCOME10: { type: 'PERCENT', value: 10, oneTime: true },
  SUMMER15: { type: 'PERCENT', value: 15, expires: Date.now() + 90 * day },
  TEST25: { type: 'FIXED', value: 25 },
  VIP50: { type: 'PERCENT', value: 50 },
  EXPIRED5: { type: 'FIXED', value: 5, expires: Date.now() - day },
}
const USED = 'tp_used_vouchers'
const used = (): string[] => { try { return JSON.parse(localStorage.getItem(USED) || '[]') } catch { return [] } }
export const markVoucherUsed = (code: string) => localStorage.setItem(USED, JSON.stringify([...used(), code]))
export function applyVoucher(raw: string, subtotal: number) {
  const code = raw.trim().toUpperCase(), v = VOUCHERS[code]
  if (!v) return { ok: false as const, error: 'Unknown code' }
  if (v.expires && v.expires < Date.now()) return { ok: false as const, error: 'Code expired' }
  if (v.oneTime && used().includes(code)) return { ok: false as const, error: 'Code already used (clear localStorage to reset)' }
  const discount = Math.min(subtotal, v.type === 'PERCENT' ? subtotal * v.value / 100 : v.value)
  return { ok: true as const, code, discount: +discount.toFixed(2) }
}

// Pure version (no localStorage) so the server can recompute the discount. Returns 0 for unknown/expired codes.
export function voucherDiscount(raw: string, subtotal: number) {
  const v = VOUCHERS[raw.trim().toUpperCase()]
  if (!v || (v.expires && v.expires < Date.now())) return 0
  return +Math.min(subtotal, v.type === 'PERCENT' ? subtotal * v.value / 100 : v.value).toFixed(2)
}
