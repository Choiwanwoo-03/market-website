import { notFound } from 'next/navigation'
import Link from 'next/link'
import dbConnect from '@/db/connect'
import Product from '@/models/Product'
import Category from '@/models/Category'
import User from '@/models/User'
import Wishlist from '@/models/Wishlist'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ProductGallery from '@/components/ProductGallery'
import ProductActions from '@/components/ProductActions'
import ProductTabs from '@/components/ProductTabs'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await dbConnect()

  const product = await Product.findById(id).lean()
  if (!product) return notFound()

  const session = await getServerSession(authOptions)

  const [category, seller, wishlistItem] = await Promise.all([
    Category.findById(product.categoryId).lean(),
    User.findById(product.sellerId).lean(),
    session ? Wishlist.findOne({ userId: session.user.id, productId: id }).lean() : null,
  ])

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        ← 상품 목록으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <ProductGallery imageUrls={product.imageUrls} productName={product.name} />

        <div>
          {category && (
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 mb-3">
              {category.categoryName}
            </span>
          )}
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          {seller && (
            <p className="text-sm text-gray-500 mb-4">
              <span className="text-gray-400 mr-1">판매자</span>
              {seller.storeName ?? seller.name}
            </p>
          )}

          <hr className="border-gray-100 mb-4" />

          <p className="text-3xl font-bold text-blue-600 mb-1">
            ₩{product.price.toLocaleString()}
          </p>
          {product.stock === 0 ? (
            <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-semibold mb-4">
              품절
            </span>
          ) : (
            <p className="text-xs text-gray-400 mb-4">재고 {product.stock}개</p>
          )}

          <hr className="border-gray-100 mb-4" />

          <ProductActions
            productId={String(product._id)}
            stock={product.stock}
            initialWishlisted={!!wishlistItem}
          />

          <div className="mt-4 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-500">
            🚚 30,000원 이상 무료배송 · 내일 도착 예정
          </div>
        </div>
      </div>

      <ProductTabs description={product.description} />
    </main>
  )
}