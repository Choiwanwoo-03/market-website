'use client'

import { useState, useEffect, useRef } from 'react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [storeName, setStoreName] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpExpired, setOtpExpired] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!otpSent || otpExpired) return
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setOtpExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [otpSent, otpExpired])

  function formatTime(s: number) {
    return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  }

  async function handleSendOTP() {
    if (!email) { setError('이메일을 입력해주세요.'); return }
    setSending(true)
    setError('')
    clearInterval(timerRef.current!)
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.message); setSending(false); return }
    setOtpSent(true)
    setOtpExpired(false)
    setTimeLeft(300)
    setOtpCode('')
    setSending(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!otpSent) { setError('이메일 인증을 먼저 진행해주세요.'); return }
    if (otpExpired) { setError('인증번호가 만료되었습니다. 다시 인증해주세요.'); return }
    if (!otpCode) { setError('인증번호를 입력해주세요.'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, storeName, otpCode }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.message); setLoading(false); return }
    setDone(true)
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <h1 className="text-2xl font-bold mb-4">가입 완료!</h1>
          <p className="text-gray-600 mb-6">회원가입이 완료되었습니다. 로그인해주세요.</p>
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

        <div className="flex gap-2">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setOtpSent(false) }}
            required
            className="border rounded px-3 py-2 flex-1 min-w-0"
          />
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={sending}
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm whitespace-nowrap hover:bg-black disabled:opacity-50"
          >
            {sending ? '발송 중...' : '이메일 인증'}
          </button>
        </div>

        {otpSent && (
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="인증번호 6자리"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="border rounded px-3 py-2 flex-1 min-w-0"
              />
              <span className={`text-sm font-semibold w-12 text-center ${otpExpired ? 'text-red-500' : 'text-blue-600'}`}>
                {otpExpired ? '만료' : formatTime(timeLeft)}
              </span>
            </div>
            {otpExpired ? (
              <button type="button" onClick={handleSendOTP} className="text-xs text-blue-600 underline text-left">
                인증번호 재발송
              </button>
            ) : (
              <p className="text-xs text-gray-500">이메일로 발송된 6자리 인증번호를 입력해주세요.</p>
            )}
          </div>
        )}

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
            <input type="radio" value="buyer" checked={role === 'buyer'} onChange={() => setRole('buyer')} />
            구매자
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="seller" checked={role === 'seller'} onChange={() => setRole('seller')} />
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
          disabled={loading}
          className="bg-black text-white rounded px-3 py-2 hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? '처리 중...' : '확인'}
        </button>

        <p className="text-center text-sm">
          이미 계정이 있으신가요?{' '}
          <a href="/auth/login" className="underline">로그인</a>
        </p>
      </form>
    </main>
  )
}