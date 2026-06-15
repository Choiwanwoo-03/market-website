'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-sm px-4">
        {success ? (
          <>
            <h1 className="text-2xl font-bold mb-4">이메일 인증 완료!</h1>
            <p className="text-gray-600 mb-6">이메일 인증이 완료되었습니다. 로그인해주세요.</p>
            <Link href="/auth/login" className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
              로그인하기
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">인증 실패</h1>
            <p className="text-gray-600 mb-6">유효하지 않거나 이미 사용된 인증 링크입니다.</p>
            <Link href="/" className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
              홈으로
            </Link>
          </>
        )}
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}