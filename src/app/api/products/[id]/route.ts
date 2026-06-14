import { NextRequest, NextResponse } from 'next/server'
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