'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  categoryId: { _id: string; categoryName: string } | null
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
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const res = await fetch(`/api/seller/products/${deleteTarget._id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts(products.filter((p) => p._id !== deleteTarget._id))
      setDeleteTarget(null)
      setDeleteInput('')
    }
    setDeleteLoading(false)
  }

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
                  <div className="flex-1">
                    <h2 className="font-semibold">{product.name}</h2>
                    {product.categoryId && (
                      <p className="text-xs text-gray-400">{product.categoryId.categoryName}</p>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                    <p className="text-blue-600 font-bold">₩{product.price.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setDeleteTarget(product); setDeleteInput('') }}
                      className="border border-red-300 text-red-500 px-3 py-1.5 rounded text-sm hover:bg-red-50"
                    >
                      등록 취소
                    </button>
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
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">등록 취소</h2>
              <button
                onClick={() => { setDeleteTarget(null); setDeleteInput('') }}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none"
              >×</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              확인을 위해 아래에 <span className="font-semibold">{deleteTarget.name}</span> 을 입력해주세요.
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="상품명 입력"
              className="w-full border rounded px-3 py-2 text-sm mb-4"
            />
            <button
              onClick={handleDelete}
              disabled={deleteInput !== deleteTarget.name || deleteLoading}
              className="w-full bg-red-600 text-white py-2 rounded text-sm font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {deleteLoading ? '처리 중...' : '등록 취소'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}