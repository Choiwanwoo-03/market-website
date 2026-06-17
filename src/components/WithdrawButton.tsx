'use client'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function WithdrawButton({ email, hasProducts }: { email: string; hasProducts: boolean }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleOpen() {
    if (hasProducts) {
        setError('등록한 상품이 존재합니다. 상품 등록을 제거 후 진행바랍니다.')
        return
    }
    setError('')
    setOpen(true)
    }

  async function handleWithdraw() {
    setLoading(true)
    const res = await fetch('/api/users/me', { method: 'DELETE' })
    if (res.ok) {
      await signOut({ callbackUrl: '/' })
    } else {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="mt-8 text-sm text-red-500 underline hover:text-red-700"
      >
        회원탈퇴
      </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">회원탈퇴</h2>
              <button onClick={() => { setOpen(false); setInput('') }} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              확인을 위해 아래에 <span className="font-semibold">{email}</span> 을 입력해주세요.
            </p>
            <input
              type="email"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="이메일 입력"
              className="w-full border rounded px-3 py-2 text-sm mb-4"
            />
            <button
              onClick={handleWithdraw}
              disabled={input !== email || loading}
              className="w-full bg-red-600 text-white py-2 rounded text-sm font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? '처리 중...' : '회원탈퇴'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}