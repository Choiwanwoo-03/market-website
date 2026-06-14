import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Product from '@/models/Product'
import Order from '@/models/Order'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'seller') {
    return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 })
  }
  await dbConnect()
  const products = await Product.find({ sellerId: session.user.id }).lean()
  const productsWithRevenue = await Promise.all(
    products.map(async (product) => {
      const orders = await Order.find({ 'items.productId': product._id })
      const revenue = orders.reduce((sum, order) => {
        const item = order.items.find((i) => String(i.productId) === String(product._id))
        return sum + (item ? item.price * item.quantity : 0)
      }, 0)
      return { ...product, revenue }
    })
  )
  return NextResponse.json(productsWithRevenue)
}