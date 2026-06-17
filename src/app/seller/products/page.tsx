'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  categoryId: { _id: string; name: string } | null
  description: string
  price: number
  stock: number
  imageUrls: string[]
  revenue: number
}

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [openStock, setOpenStock] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/seller/products')
      .then((res) => {
        if (res.status === 401 || res.status === 403) { router.push('/'); return null }
        return res.json()
      })
      .then((data) => { if (data) setProducts(data) })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <main className="container mx-auto px-4 py-8">로딩 중...</main>

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Link href="/seller/products/new" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          상품 등록+
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">등록된 상품이 없습니다.</p>
          <Link href="/seller/products/new" className="bg-black text-white px-4 py-2 rounded-lg">
            상품 등록+
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  {product.imageUrls[0] ? (
                    <Image src={product.imageUrls[0]} alt={product.name} fill sizes="80px" className="object-cover rounded" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">없음</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{product.name}</h2>
                  {product.categoryId && (
                    <p className="text-xs text-gray-400">{product.categoryId.name}</p>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                  <p className="text-blue-600 font-bold">₩{product.price.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/seller/products/${product._id}/edit`} className="border px-3 py-1.5 rounded text-sm hover:bg-gray-50">
                    상품 수정
                  </Link>
                  <button
                    onClick={() => setOpenStock(openStock === product._id ? null : product._id)}
                    className="border px-3 py-1.5 rounded text-sm hover:bg-gray-50"
                  >
                    재고 확인{openStock === product._id ? '▲' : '▼'}
                  </button>
                </div>
              </div>
              {openStock === product._id && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">현재 재고</p>
                    <p className="font-bold">{product.stock}개</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">가격</p>
                    <p className="font-bold">₩{product.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">총 수입</p>
                    <p className="font-bold text-blue-600">₩{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}