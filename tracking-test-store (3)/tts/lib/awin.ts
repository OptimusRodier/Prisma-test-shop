// Client helper: asks our own /api/awin/convert route to send the order to Awin's Conversion API.
// Awin wants the server call 10-60 s after the client-side tag, so we wait 15 s, and send immediately if the visitor leaves earlier.
export const AWIN_S2S_DELAY_MS = 15_000
const SENT = 'tp_awin_s2s_sent'

export function scheduleAwinS2S(o: any) {
  const body = JSON.stringify({
    transactionId: o.transactionId,
    voucherCode: o.voucherCode || null,
    clientAmount: +(o.subtotal - o.discount).toFixed(2), // for the server-vs-client amount check only
    items: o.items.map((i: any) => ({ productId: i.productId, quantity: i.quantity })),
  })
  let t: ReturnType<typeof setTimeout>
  const send = () => {
    clearTimeout(t)
    if (sessionStorage.getItem(SENT) === o.transactionId) return
    sessionStorage.setItem(SENT, o.transactionId)
    fetch('/api/awin/convert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
      .then(r => r.json())
      .then(j => { console.log('[awin s2s]', j); sessionStorage.setItem('tp_awin_s2s_result', JSON.stringify(j)) })
      .catch(e => console.warn('[awin s2s] failed', e))
  }
  t = setTimeout(send, AWIN_S2S_DELAY_MS)
  window.addEventListener('pagehide', send)
}
