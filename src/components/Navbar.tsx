'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold">
        키움 쇼핑몰
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm text-gray-600">{session.user.name}</span>
            {session.user.role === 'seller' && (
              <Link href="/seller/products" className="text-sm hover:underline">
                상품 관리
              </Link>
            )}
            <Link href="/cart" className="text-sm hover:underline">
              장바구니
            </Link>
            <Link href="/mypage" className="text-sm hover:underline">
              마이페이지
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-sm hover:underline">
              로그인
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}