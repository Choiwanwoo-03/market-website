import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Product from '@/models/Product'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect()
  const { id } = await params
  const product = await Product.findById(id)
  if (!product) return NextResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'seller' && session.user.role !== 'admin')) {
    return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 })
  }
  await dbConnect()
  const { id } = await params
  const body = await req.json()
  const product = await Product.findOneAndUpdate(
    { _id: id, sellerId: session.user.id },
    body,
    { returnDocument: 'after' }
  )
  if (!product) return NextResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 })
  return NextResponse.json(product)
}