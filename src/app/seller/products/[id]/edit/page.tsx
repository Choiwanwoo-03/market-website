'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

interface Category { _id: string; name: string }

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({ name: '', categoryId: '', description: '', price: '', stock: '' })
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((res) => res.json()),
      fetch(`/api/products/${id}`).then((res) => res.json()),
    ]).then(([cats, product]) => {
      setCategories(cats)
      setForm({
        name: product.name,
        categoryId: String(product.categoryId),
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
      })
      if (product.imageUrls?.[0]) setImageUrl(product.imageUrls[0])
    })
  }, [id])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) setImageUrl(data.url)
    else alert(data.message || '이미지 업로드 실패')
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), imageUrls: imageUrl ? [imageUrl] : [] }),
    })
    if (res.ok) {
      router.push('/seller/products')
    } else {
      const data = await res.json()
      setError(data.message || '상품 수정 실패')
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">상품 수정</h1>
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
          <label className="block text-sm font-semibold mb-1">상품 이미지</label>
          {imageUrl && (
            <div className="mb-2 relative w-full h-48 rounded-lg overflow-hidden">
              <Image src={imageUrl} alt="현재 상품 이미지" fill sizes="(max-width: 672px) 100vw, 672px" className="object-cover" />
            </div>
          )}
          <p className="text-sm text-gray-500 mb-1">
            {imageUrl ? '이미지를 변경하려면 새 파일을 선택하세요' : '이미지를 선택하세요'}
          </p>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded-lg px-4 py-2" />
          {uploading && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading || uploading} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">
          {loading ? '수정 중...' : '상품 수정하기'}
        </button>
      </form>
    </main>
  )
}