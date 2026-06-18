'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface Category { _id: string; name: string }

export default function SearchBar({
  categories,
  basePath = '/search',
}: {
  categories: Category[]
  basePath?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '')
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'latest')

  function buildParams(overrides: Record<string, string> = {}) {
    const params = new URLSearchParams()
    const kw = overrides.keyword ?? keyword
    const cat = overrides.categoryId ?? categoryId
    const s = overrides.sort ?? sort
    if (kw) params.set('keyword', kw)
    if (cat) params.set('categoryId', cat)
    if (s && s !== 'latest') params.set('sort', s)
    return params
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/search?${buildParams().toString()}`)
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSort = e.target.value
    setSort(newSort)
    router.push(`${basePath}?${buildParams({ sort: newSort }).toString()}`)
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
      <div className="w-36">
        <label className="block text-sm font-semibold mb-1">정렬</label>
        <select
          value={sort}
          onChange={handleSortChange}
          className="w-full border rounded-lg px-4 py-2 text-sm"
        >
          <option value="latest">최신순</option>
          <option value="price_asc">낮은 가격순</option>
          <option value="price_desc">높은 가격순</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
      >
        검색
      </button>
    </form>
  )
}