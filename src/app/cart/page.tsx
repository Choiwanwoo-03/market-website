'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

interface CartItem {
  _id: string
  quantity: number
  productId: {
    _id: string
    name: string
    price: number
    imageUrls: string[]
    stock: number
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { refreshCart } = useCart()

  useEffect(() => {
    fetch('/api/cart')
      .then((res) => {
        if (res.status === 401) { router.push('/auth/login'); return null }
        return res.json()
      })
      .then((data) => { if (data) setItems(data) })
      .finally(() => setLoading(false))
  }, [router])

  async function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return
    await fetch(`/api/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })
    setItems((prev) => prev.map((item) => item._id === id ? { ...item, quantity } : item))
    await refreshCart()
  }

  async function removeItem(id: string) {
    await fetch(`/api/cart/${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((item) => item._id !== id))
    await refreshCart()
  }

  const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)

  if (loading) return <main className="container mx-auto px-4 py-8">로딩 중...</main>

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">장바구니</h1>
      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">장바구니가 비어있습니다.</p>
          <Link href="/" className="text-blue-600 hover:underline">쇼핑 계속하기</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={item._id} className="border rounded-lg p-4 flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  {item.productId.imageUrls[0] ? (
                    <Image src={item.productId.imageUrls[0]} alt={item.productId.name} fill className="object-cover rounded" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">없음</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.productId.name}</p>
                  <p className="text-blue-600">{item.productId.price.toLocaleString()}원</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-40">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 border rounded hover:bg-gray-100">+</button>
                </div>
                <p className="w-24 text-right font-semibold">{(item.productId.price * item.quantity).toLocaleString()}원</p>
                <button onClick={() => removeItem(item._id)} className="text-red-500 hover:text-red-700 text-sm">삭제</button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <p className="text-xl font-bold">총 결제 금액: {total.toLocaleString()}원</p>
            <button
              onClick={() => router.push('/checkout')}
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800"
            >
              구매하기
            </button>
          </div>
        </>
      )}
    </main>
  )
}