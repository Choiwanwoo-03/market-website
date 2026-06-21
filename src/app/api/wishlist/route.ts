import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Wishlist from '@/models/Wishlist'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
  await dbConnect()
  const wishlist = await Wishlist.find({ userId: session.user.id }).lean()
  const productIds = wishlist.map(w => String(w.productId))
  return NextResponse.json({ productIds })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
  const { productId } = await request.json()
  if (!productId) return NextResponse.json({ message: 'productId가 필요합니다.' }, { status: 400 })
  await dbConnect()
  try {
    await Wishlist.create({ userId: session.user.id, productId })
    return NextResponse.json({ message: '찜 목록에 추가되었습니다.' })
  } catch (e: unknown) {
    if ((e as { code?: number }).code === 11000) {
      return NextResponse.json({ message: '이미 찜한 상품입니다.' }, { status: 409 })
    }
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}