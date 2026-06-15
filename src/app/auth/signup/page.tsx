'use client'

import { useState } from 'react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [storeName, setStoreName] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, storeName }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <h1 className="text-2xl font-bold mb-4">가입 완료!</h1>
          <p className="text-gray-600 mb-2">이메일로 인증 링크를 발송했습니다.</p>
          <p className="text-gray-600 mb-6">이메일을 확인하여 인증을 완료해주세요.</p>
          <a href="/auth/login" className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
            로그인 페이지로
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold text-center">회원가입</h1>

        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="비밀번호 (8자 이상, 특수문자 포함)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="buyer"
              checked={role === 'buyer'}
              onChange={() => setRole('buyer')}
            />
            구매자
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="seller"
              checked={role === 'seller'}
              onChange={() => setRole('seller')}
            />
            판매자
          </label>
        </div>

        {role === 'seller' && (
          <input
            type="text"
            placeholder="상점명"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white rounded px-3 py-2 hover:bg-gray-800"
        >
          회원가입
        </button>

        <p className="text-center text-sm">
          이미 계정이 있으신가요?{' '}
          <a href="/auth/login" className="underline">
            로그인
          </a>
        </p>
      </form>
    </main>
  )
}