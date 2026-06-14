'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function EditProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [name, setName] = useState(session?.user.name ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword && newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)
    const body: Record<string, string> = { name }
    if (newPassword) {
      body.currentPassword = currentPassword
      body.newPassword = newPassword
    }

    const res = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (res.ok) {
      setSuccess(data.message)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setError(data.message || '수정 실패')
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">회원정보 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">이메일 (변경 불가)</label>
          <input type="email" disabled value={session?.user.email ?? ''} className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">이름</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <hr className="my-2" />
        <p className="text-sm text-gray-500">비밀번호 변경 (변경하지 않으려면 비워두세요)</p>
        <div>
          <label className="block text-sm font-semibold mb-1">현재 비밀번호</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">새 비밀번호</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">새 비밀번호 확인</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border rounded-lg px-4 py-2" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">
            {loading ? '수정 중...' : '수정하기'}
          </button>
          <button type="button" onClick={() => router.push('/mypage')} className="flex-1 border py-3 rounded-lg font-semibold hover:bg-gray-50">
            취소
          </button>
        </div>
      </form>
    </main>
  )
}