'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Category { _id: string; name: string }

const MAX_IMAGES = 3
const MIN_W = 500, MIN_H = 600, MAX_W = 1000, MAX_H = 1000

function validateImageSize(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      if (img.width < MIN_W || img.height < MIN_H || img.width > MAX_W || img.height > MAX_H) {
        resolve(`이미지 크기는 ${MIN_W}×${MIN_H}px ~ ${MAX_W}×${MAX_H}px 이어야 합니다. (현재: ${img.width}×${img.height}px)`)
      } else {
        resolve(null)
      }
    }
    img.src = url
  })
}

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({ name: '', categoryId: '', description: '', price: '', stock: '' })
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/categories').then((res) => res.json()).then(setCategories)
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (imageUrls.length >= MAX_IMAGES) {
      setError(`이미지는 최대 ${MAX_IMAGES}개까지 등록 가능합니다.`)
      e.target.value = ''
      return
    }
    const sizeError = await validateImageSize(file)
    if (sizeError) { setError(sizeError); e.target.value = ''; return }
    setError('')
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) setImageUrls((prev) => [...prev, data.url])
    else setError(data.message || '이미지 업로드 실패')
    setUploading(false)
    e.target.value = ''
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), imageUrls }),
    })
    if (res.ok) {
      router.push('/seller/products')
    } else {
      const data = await res.json()
      setError(data.message || '상품 등록 실패')
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">상품 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">상품명</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">카테고리</label>
          <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full border rounded-lg px-4 py-2">
            <option value="">카테고리 선택</option>
            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">설명</label>
          <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-4 py-2 h-24" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">가격 (원)</label>
          <input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">재고 수량</label>
          <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            상품 이미지 ({imageUrls.length}/{MAX_IMAGES})
          </label>
          {imageUrls.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                  <Image src={url} alt={`이미지 ${i + 1}`} fill sizes="96px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {imageUrls.length < MAX_IMAGES && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full border rounded-lg px-4 py-2"
            />
          )}
          {uploading && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
          <p className="text-xs text-gray-400 mt-1">최대 3장 · 크기: 500×600px ~ 1000×1000px</p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading || uploading} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">
          {loading ? '등록 중...' : '상품 등록하기'}
        </button>
      </form>
    </main>
  )
}