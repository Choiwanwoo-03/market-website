import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Wishlist from '@/models/Wishlist'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
  const { productId } = await params
  await dbConnect()
  await Wishlist.deleteOne({ userId: session.user.id, productId })
  return NextResponse.json({ message: '찜 목록에서 제거되었습니다.' })
}