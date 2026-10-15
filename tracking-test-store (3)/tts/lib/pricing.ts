export const SHIPPING = { standard: 5.9, express: 12.9 } as const
export type ShipMethod = keyof typeof SHIPPING
export function totals(subtotal: number, discount: number, method: ShipMethod) {
  const net = Math.max(0, subtotal - discount)
  const shipping = subtotal === 0 ? 0 : method === 'express' ? SHIPPING.express : net > 100 ? 0 : SHIPPING.standard
  const tax = +(net * 0.2).toFixed(2)
  return { subtotal: +subtotal.toFixed(2), discount: +discount.toFixed(2), shipping, tax, total: +(net + shipping + tax).toFixed(2) }
}
