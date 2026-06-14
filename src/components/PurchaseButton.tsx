'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function PurchaseButton({ productId }: { productId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [showForm, setShowForm] = useState(false)

  if (!session) {
    return (
      <button
        onClick={() => router.push('/auth/login')}
        className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
      >
        로그인 후 구매하기
      </button>
    )
  }

  async function handlePurchase() {
    if (!address.trim()) { alert('배송지를 입력해주세요.'); return }
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1, deliveryAddress: address }),
    })
    if (res.ok) {
      alert('주문이 완료되었습니다!')
      router.push('/mypage')
    } else {
      const data = await res.json()
      alert(data.message || '주문 실패')
    }
    setLoading(false)
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="mt-6 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
      >
        구매하기
      </button>
    )
  }

  return (
    <div className="mt-6 space-y-3">
      <input
        type="text"
        placeholder="배송지 주소를 입력해주세요"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border rounded-lg px-4 py-3"
      />
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? '주문 중...' : '주문 확인'}
      </button>
    </div>
  )
}