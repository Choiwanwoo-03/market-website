import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Order from '@/models/Order'
import Product from '@/models/Product'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
  await dbConnect()
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })
  await dbConnect()
  const { productId, quantity, deliveryAddress } = await req.json()
  const product = await Product.findById(productId)
  if (!product) return NextResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 })
  if (product.stock < quantity) return NextResponse.json({ message: '재고가 부족합니다.' }, { status: 400 })
  const order = await Order.create({
    userId: session.user.id,
    items: [{ productId: product._id, productName: product.name, quantity, price: product.price }],
    totalPrice: product.price * quantity,
    deliveryAddress,
  })
  await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } })
  return NextResponse.json(order, { status: 201 })
}