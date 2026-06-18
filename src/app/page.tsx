import Link from 'next/link'
import dbConnect from '@/db/connect'
import Product from '@/models/Product'
import Category from '@/models/Category'
import Image from 'next/image'
import SearchBar from '@/components/SearchBar'
import AddToCartButton from '@/components/AddToCartButton'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Suspense } from 'react'
import Pagination from '@/components/Pagination'
import CategoryTabs from '@/components/CategoryTabs'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string; categoryId?: string }>
}) {
  const { sort, page: pageParam, categoryId } = await searchParams
  const query: Record<string, unknown> = {}
  if (categoryId) query.categoryId = categoryId
  const ITEMS_PER_PAGE = 8
  const page = Math.max(1, Number(pageParam) || 1)
  const sortQuery: Record<string, 1 | -1> =
  sort === 'price_asc' ? { price: 1 } :
  sort === 'price_desc' ? { price: -1 } :
  { _id: -1 }
    
  await dbConnect()
  void Category

  const [products, total, categories] = await Promise.all([
    Product.find(query).sort(sortQuery).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).lean(),
    Product.countDocuments(query),
    Category.find().sort({ categoryName: 1 }).lean(),
  ])
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
      <Suspense>
        <CategoryTabs
          categories={categories.map((c) => ({ _id: String(c._id), name: c.categoryName }))}
          basePath="/"
        />
      </Suspense>
      <Suspense>
        <SearchBar categories={categories.map((c) => ({ _id: String(c._id), name: c.categoryName }))} basePath="/" />
      </Suspense>
      {products.length === 0 ? (
        <p className="text-gray-500">등록된 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card key={String(product._id)} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col p-0 gap-0">
              <Link href={`/products/${String(product._id)}`} className="block flex-1">
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
                <CardContent className="px-4 pt-4 pb-3">
                  <h2 className="font-semibold text-lg mb-1">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-blue-600 font-bold">₩{product.price.toLocaleString()}</p>
                  {product.stock === 0 ? (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-semibold">품절</span>
                  ) : (
                    <p className="text-gray-400 text-xs mt-1">재고: {product.stock}개</p>
                  )}
                </CardContent>
              </Link>
              <CardFooter className="px-4 py-3">
                <AddToCartButton
                  productId={String(product._id)}
                  stock={product.stock}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </main>
  )
}