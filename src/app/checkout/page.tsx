'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CartItem {
  _id: string
  quantity: number
  productId: { _id: string; name: string; price: number }
}

interface DeliveryAddress {
  _id: string
  label: string
  address: string
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([])
  const [address, setAddress] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/cart')
      .then((res) => {
        if (res.status === 401) { router.push('/auth/login'); return null }
        return res.json()
      })
      .then((data) => { if (data) setItems(data) })

    fetch('/api/users/addresses')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setSavedAddresses(data) })
  }, [router])

  function handleSelectAddress(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value
    setSelectedId(id)
    if (id === '') {
      setAddress('')
    } else {
      const found = savedAddresses.find((a) => a._id === id)
      if (found) setAddress(found.address)
    }
  }

  const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)

  async function handleCheckout() {
    if (!address.trim()) { setError('배달 주소를 입력해주세요.'); return }
    if (items.length === 0) { setError('장바구니가 비어있습니다.'); return }
    setError('')
    setLoading(true)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deliveryAddress: address,
        items: items.map((item) => ({ productId: item.productId._id, quantity: item.quantity })),
      }),
    })
    if (res.ok) {
      alert('구매가 완료되었습니다!')
      router.push('/orders')
    } else {
      const data = await res.json()
      setError(data.message || '구매 처리 중 오류가 발생했습니다.')
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">구매 페이지</h1>
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-3">주문 상품</h2>
        {items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm py-1">
            <span>{item.productId.name} x {item.quantity}개</span>
            <span>₩{(item.productId.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>총 결제 금액</span>
          <span>₩{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="mb-6 space-y-3">
        <label className="block font-semibold">배달 주소</label>
        {savedAddresses.length > 0 && (
          <select
            value={selectedId}
            onChange={handleSelectAddress}
            className="w-full border rounded-lg px-4 py-3 text-sm"
          >
            <option value="">직접 입력</option>
            {savedAddresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.label} — {addr.address}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          placeholder="배달 주소를 입력해주세요"
          value={address}
          onChange={(e) => { setAddress(e.target.value); setSelectedId('') }}
          className="w-full border rounded-lg px-4 py-3"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? '처리 중...' : '구매하기'}
      </button>
    </main>
  )
}