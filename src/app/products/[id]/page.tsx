import { notFound } from 'next/navigation'
import dbConnect from '@/db/connect'
import Product from '@/models/Product'
import Image from 'next/image'
import AddToCartButton from '@/components/AddToCartButton'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await dbConnect()
  const product = await Product.findById(id).lean()
  if (!product) return notFound()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {product.imageUrls[0] ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
            <Image src={product.imageUrls[0]} alt={product.name} fill 
        className="object-cover" />
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center 
        rounded-lg mb-6">
            <span className="text-gray-400">이미지 없음</span>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-3xl text-blue-600 font-bold mb-4">{product.price.toLocaleString()}원</p>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-gray-400 text-sm">재고: {product.stock}개</p>
        <AddToCartButton productId={String(product._id)} stock={product.stock} />
      </div>
    </main>
  )
}