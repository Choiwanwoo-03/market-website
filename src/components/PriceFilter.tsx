'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function PriceFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')
    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 items-end mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="w-32">
        <label className="block text-sm font-semibold mb-1">최소 가격</label>
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="0"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <span className="text-gray-400 pb-2">~</span>
      <div className="w-32">
        <label className="block text-sm font-semibold mb-1">최대 가격</label>
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="제한 없음"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <button
        onClick={handleApply}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
      >
        적용하기
      </button>
    </div>
  )
}