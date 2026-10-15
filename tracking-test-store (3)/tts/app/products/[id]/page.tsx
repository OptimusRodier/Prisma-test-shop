import { notFound } from 'next/navigation'
import ProductView from '@/components/ProductView'
import { getProduct } from '@/lib/products'
export default function Product({ params }: { params: { id: string } }) {
  const p = getProduct(params.id)
  if (!p) notFound()
  return <ProductView p={p} />
}
