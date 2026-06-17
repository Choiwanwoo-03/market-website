'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function AddToCartButton({
  productId,
  stock,
  className,
}: {
  productId: string
  stock: number
  className?: string
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const { refreshCart } = useCart()
  const [loading, setLoading] = useState(false)

  if (stock === 0) {
    return (
      <button
        disabled
        className={className ?? 'mt-6 w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed'}
      >
        품절
      </button>
    )
  }

  async function handleAddToCart() {
    if (!session) { router.push('/auth/login'); return }
    setLoading(true)
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    if (res.ok) {
      alert('장바구니에 추가되었습니다!')
      await refreshCart()
    } else {
      const data = await res.json()
      alert(data.message || '장바구니 추가 실패')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={className ?? 'mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50'}
    >
      {loading ? '추가 중...' : '장바구니 담기'}
    </button>
  )
}