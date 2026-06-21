import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import dbConnect from '@/db/connect'
import Wishlist from '@/models/Wishlist'
import Product from '@/models/Product'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import AddToCartButton from '@/components/AddToCartButton'
import WishlistButton from '@/components/WishlistButton'

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  await dbConnect()
  const wishlistItems = await Wishlist.find({ userId: session.user.id }).lean()
  const productIds = wishlistItems.map(w => w.productId)
  const products = await Product.find({ _id: { $in: productIds } }).lean()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">찜 목록</h1>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">찜한 상품이 없습니다.</p>
          <Link href="/" className="text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            쇼핑 계속하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={String(product._id)} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col p-0 gap-0">
              <Link href={`/products/${String(product._id)}`} className="block flex-1 relative">
                {product.imageUrls[0] ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={product.imageUrls[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">이미지 없음</span>
                  </div>
                )}
                <WishlistButton productId={String(product._id)} initialWishlisted={true} />
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
    </main>
  )
}