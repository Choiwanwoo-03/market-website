'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface Category { _id: string; name: string }

export default function SearchBar({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '')
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') ?? '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (categoryId) params.set('categoryId', categoryId)
    router.push(`/search?${params.toString()}`)
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
      <div className="w-40">
        <label className="block text-sm font-semibold mb-1">카테고리</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm"
        >
          <option value="">전체</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800">
        검색
      </button>
    </form>
  )
}