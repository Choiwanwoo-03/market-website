import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Order from '@/models/Order'
import Product from '@/models/Product'
import Cart from '@/models/Cart'

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

  const { deliveryAddress, items } = await req.json()
  if (!deliveryAddress?.trim() || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: '필수 정보가 누락되었습니다.' }, { status: 400 })
  }

  const products = await Promise.all(
    items.map((item: { productId: string }) => Product.findById(item.productId))
  )

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    if (!product) return NextResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 })
    if (product.stock < items[i].quantity)
      return NextResponse.json({ message: `${product.name} 재고가 부족합니다.` }, { status: 400 })
  }

  const totalPrice = products.reduce((sum, product, i) => sum + product!.price * items[i].quantity, 0)

  const order = await Order.create({
    userId: session.user.id,
    totalPrice,
    deliveryAddress,
    items: products.map((product, i) => ({
      productId: product!._id,
      quantity:  items[i].quantity,
      price:     product!.price,
    })),
  })

  await Promise.all(
    products.map((product, i) =>
      Product.findByIdAndUpdate(product!._id, { $inc: { stock: -items[i].quantity } })
    )
  )

  await Cart.deleteMany({ userId: session.user.id })

  return NextResponse.json(order, { status: 201 })
}