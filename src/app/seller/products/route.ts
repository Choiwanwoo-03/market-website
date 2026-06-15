import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import Product from '@/models/Product'
import OrderItem from '@/models/OrderItem'
import Category from '@/models/Category'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'seller') {
    return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 })
  }
  await dbConnect()
  void Category
  const products = await Product.find({ sellerId: session.user.id })
    .populate('categoryId', 'name')
    .lean()
  const productsWithRevenue = await Promise.all(
    products.map(async (product) => {
      const items = await OrderItem.find({ productId: product._id }).lean()
      const revenue = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return { ...product, revenue }
    })
  )
  return NextResponse.json(productsWithRevenue)
}