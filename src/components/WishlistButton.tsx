'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function WishlistButton({
  productId,
  initialWishlisted,
}: {
  productId: string
  initialWishlisted: boolean
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [loading, setLoading] = useState(false)

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!session) { router.push('/auth/login'); return }
    setLoading(true)
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
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors disabled:opacity-50"
      aria-label={wishlisted ? '찜 해제' : '찜하기'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-5 h-5 transition-colors ${wishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-400'}`}
        strokeWidth={2}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}