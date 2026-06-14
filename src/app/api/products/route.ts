import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Product from '@/models/Product'

export async function GET() {
  try {
    await dbConnect()
    const products = await Product.find({}).sort({ _id: -1 })
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '상품 목록 조회 실패', error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'seller' && session.user.role !== 'admin')) {
    return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 })
  }
  await dbConnect()
  const body = await req.json()
  const { name, categoryId, description, price, imageUrls, stock } = body
  if (!name || !categoryId || !description || price == null || stock == null) {
    return NextResponse.json({ message: '필수 항목이 누락되었습니다.' }, { status: 400 })
  }
  const product = await Product.create({
    name, categoryId, description, price,
    imageUrls: imageUrls ?? [],
    stock,
    sellerId: session.user.id,
  })
  return NextResponse.json(product, { status: 201 })
}