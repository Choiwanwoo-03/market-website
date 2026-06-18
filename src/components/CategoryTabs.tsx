'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface Category { _id: string; name: string }

export default function CategoryTabs({
  categories,
  basePath = '/',
}: {
  categories: Category[]
  basePath?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategoryId = searchParams.get('categoryId') ?? ''

  function handleCategoryClick(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('categoryId', categoryId)
    } else {
      params.delete('categoryId')
    }
    params.delete('page')
    router.push(`${basePath}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => handleCategoryClick('')}
        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
          currentCategoryId === ''
            ? 'bg-black text-white border-black'
            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => handleCategoryClick(cat._id)}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
            currentCategoryId === cat._id
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}