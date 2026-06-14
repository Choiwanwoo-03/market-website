import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Cart from '@/models/Cart'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
  await dbConnect()
  const { id } = await params
  const { quantity } = await req.json()
  if (quantity < 1) return NextResponse.json({ message: '수량은 1 이상이어야 합니다.' }, { status: 400 })
  const item = await Cart.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { quantity },
    { returnDocument: 'after' }
    )
  if (!item) return NextResponse.json({ message: '항목을 찾을 수 없습니다.' }, { status: 404 })
  return NextResponse.json(item)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
  await dbConnect()
  const { id } = await params
  await Cart.findOneAndDelete({ _id: id, userId: session.user.id })
  return NextResponse.json({ message: '삭제되었습니다.' })
}