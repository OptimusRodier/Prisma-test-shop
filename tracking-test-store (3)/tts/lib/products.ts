import data from './products.json'
export type Product = { id: string; sku: string; name: string; description: string; brand: string; category: string; subcategory: string; price: number; salePrice: number | null; stock: number; image: string; imageFallback: string; merchant: string; productType: string; sizes: string[]; currency: string; url: string }
// Real catalogue from the Awin product feed (datafeed_45628). Prices are GBP.
export const PRODUCTS: Product[] = (data as any[]).map((p, i) => ({ ...p, salePrice: null, stock: 10 + (i % 40), productType: 'simple', currency: 'GBP', url: `/products/${p.id}` }))
export const CATEGORIES = Array.from(new Set(PRODUCTS.map(p => p.category)))
export const getProduct = (id: string) => PRODUCTS.find(p => p.id === id)
export const money = (n: number) => `£${n.toFixed(2)}`
