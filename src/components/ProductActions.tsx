'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function ProductActions({
  productId,
  stock,
  initialWishlisted,
}: {
  productId: string
  stock: number
  initialWishlisted: boolean
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const { refreshCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [cartLoading, setCartLoading] = useState(false)
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [wishLoading, setWishLoading] = useState(false)

  async function handleAddToCart() {
    if (!session) { router.push('/auth/login'); return }
    setCartLoading(true)
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })
    if (res.ok) {
      alert('장바구니에 추가되었습니다!')
      await refreshCart()
    } else {
      const data = await res.json()
      alert(data.message || '장바구니 추가 실패')
    }
    setCartLoading(false)
  }

  async function handleToggleWish() {
    if (!session) { router.push('/auth/login'); return }
    setWishLoading(true)
    if (wishlisted) {
      const res = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' })
      if (res.ok) setWishlisted(false)
    } else {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      if (res.ok) setWishlisted(true)
    }
    setWishLoading(false)
  }

  if (stock === 0) {
    return (
      <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed">
        품절
      </button>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">수량</p>
      <div className="flex items-center border border-gray-300 rounded-lg w-fit mb-4 overflow-hidden">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-medium border-x border-gray-300 leading-10">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(q => Math.min(stock, q + 1))}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg"
        >
          +
        </button>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={cartLoading}
          className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          {cartLoading ? '추가 중...' : '장바구니 담기'}
        </button>
        <button
          onClick={handleToggleWish}
          disabled={wishLoading}
          className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-colors disabled:opacity-50 ${
            wishlisted ? 'border-red-400' : 'border-gray-300 hover:border-gray-500'
          }`}
          aria-label={wishlisted ? '찜 해제' : '찜하기'}
        >
          <svg viewBox="0 0 24 24" className={`w-5 h-5 ${wishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-400'}`} strokeWidth={2}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </div>
  )
}