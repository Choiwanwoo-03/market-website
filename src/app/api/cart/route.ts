import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Cart from '@/models/Cart'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
  await dbConnect()
  const items = await Cart.find({ userId: session.user.id }).populate('productId')
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
  if (session.user.role === 'seller')
    return NextResponse.json({ message: '판매자는 구매할 수 없습니다.' }, { status: 403 })
  await dbConnect()
  const { productId, quantity = 1 } = await req.json()
  const existing = await Cart.findOne({ userId: session.user.id, productId })
  if (existing) {
    existing.quantity += quantity
    await existing.save()
    return NextResponse.json(existing)
  }
  const item = await Cart.create({ userId: session.user.id, productId, quantity })
  return NextResponse.json(item, { status: 201 })
}