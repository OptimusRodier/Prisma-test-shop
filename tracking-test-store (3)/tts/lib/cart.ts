export type CartLine = { id: string; name: string; price: number; qty: number; variant: string; brand?: string; category?: string; saved?: boolean }
const K = 'tp_cart'
export const getCart = (): CartLine[] => { try { return JSON.parse(localStorage.getItem(K) || '[]') } catch { return [] } }
export const saveCart = (c: CartLine[]) => { localStorage.setItem(K, JSON.stringify(c)); window.dispatchEvent(new Event('cart:update')) }
export const toItem = (l: CartLine) => ({ item_id: l.id, item_name: l.name, price: l.price, quantity: l.qty, item_brand: l.brand, item_category: l.category, item_variant: l.variant })
