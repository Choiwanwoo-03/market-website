'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleReset() {
    setKeyword('')
    setMinPrice('')
    setMaxPrice('')
    router.push(pathname)
  }

  return (
    <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-40">
        <label className="block text-sm font-semibold mb-1">검색어</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="상품명 검색"
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
      </div>
      <div className="w-32">
        <label className="block text-sm font-semibold mb-1">최소 가격</label>
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="0"
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
      </div>
      <div className="w-32">
        <label className="block text-sm font-semibold mb-1">최대 가격</label>
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="제한 없음"
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800">
        검색
      </button>
      <button type="button" onClick={handleReset} className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50">
        초기화
      </button>
    </form>
  )
}