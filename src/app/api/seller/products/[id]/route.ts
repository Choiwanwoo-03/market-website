import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Product from '@/models/Product'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'seller')
    return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 })

  await dbConnect()
  const { id } = await params

  const product = await Product.findById(id)
  if (!product) return NextResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 })

  if (String(product.sellerId) !== session.user.id)
    return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 })

  await Product.findByIdAndDelete(id)
  return NextResponse.json({ message: '상품이 삭제되었습니다.' })
}