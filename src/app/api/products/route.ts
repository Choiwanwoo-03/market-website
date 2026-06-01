import { NextResponse } from 'next/server'
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