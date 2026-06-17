'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface DeliveryAddress {
  _id: string
  label: string
  address: string
  isDefault: boolean
}

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

  const [addresses, setAddresses] = useState<DeliveryAddress[]>([])
  const [newLabel, setNewLabel] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [addrError, setAddrError] = useState('')
  const [addrLoading, setAddrLoading] = useState(false)

  useEffect(() => {
    fetch('/api/users/addresses')
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setAddresses(data) })
  }, [])

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

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault()
    setAddrError('')
    if (!newAddress.trim()) { setAddrError('주소를 입력해주세요.'); return }
    setAddrLoading(true)
    const res = await fetch('/api/users/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: newLabel, address: newAddress }),
    })
    const data = await res.json()
    if (res.ok) {
      setAddresses(data.deliveryAddresses)
      setNewLabel('')
      setNewAddress('')
    } else {
      setAddrError(data.message || '주소 추가 실패')
    }
    setAddrLoading(false)
  }

  async function handleDeleteAddress(id: string) {
    const res = await fetch('/api/users/addresses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (res.ok) setAddresses(data.deliveryAddresses)
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

      <hr className="my-8" />

      <section>
        <h2 className="text-xl font-semibold mb-4">배송지 관리</h2>
        <div className="space-y-2 mb-4">
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-sm">저장된 배송지가 없습니다.</p>
          ) : (
            addresses.map((addr) => (
              <div key={addr._id} className="flex items-start justify-between border rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold text-sm">{addr.label}</p>
                  <p className="text-gray-600 text-sm">{addr.address}</p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr._id)}
                  className="text-red-500 hover:text-red-700 text-sm shrink-0 ml-4"
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleAddAddress} className="space-y-3 border rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-semibold">새 배송지 추가</p>
          <div>
            <label className="block text-sm mb-1">별칭 (예: 집, 회사)</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="집"
              className="w-full border rounded-lg px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">주소 *</label>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="배송지 주소를 입력해주세요"
              className="w-full border rounded-lg px-4 py-2 text-sm"
              required
            />
          </div>
          {addrError && <p className="text-red-500 text-sm">{addrError}</p>}
          <button
            type="submit"
            disabled={addrLoading}
            className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {addrLoading ? '추가 중...' : '배송지 추가'}
          </button>
        </form>
      </section>
    </main>
  )
}