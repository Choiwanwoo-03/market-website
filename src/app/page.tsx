import Link from 'next/link'
import dbConnect from '@/db/connect'
import Product from '@/models/Product'
import Image from 'next/image'
import SearchBar from '@/components/SearchBar'
import { Suspense } from 'react'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string; minPrice?: string; maxPrice?: string }>
}) {
  const { keyword, minPrice, maxPrice } = await searchParams
  await dbConnect()

  const query: Record<string, unknown> = {}
  if (keyword) query.name = { $regex: keyword, $options: 'i' }
  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {}
    if (minPrice) priceFilter.$gte = Number(minPrice)
    if (maxPrice) priceFilter.$lte = Number(maxPrice)
    query.price = priceFilter
  }

  const products = await Product.find(query).sort({ _id: -1 }).lean()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
      <Suspense>
        <SearchBar />
      </Suspense>
      {products.length === 0 ? (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link key={String(product._id)} href={`/products/${String(product._id)}`} className="block">
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {product.imageUrls[0] ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={product.imageUrls[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={index === 0}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">이미지 없음</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-blue-600 font-bold">{product.price.toLocaleString()}원</p>
                  {product.stock === 0 ? (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-semibold">품절</span>
                  ) : (
                    <p className="text-gray-400 text-xs mt-1">재고: {product.stock}개</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}