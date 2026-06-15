import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import dbConnect from '@/db/connect'
import Order from '@/models/Order'
import Link from 'next/link'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  await dbConnect()
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">구매 내역</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">구매 내역이 없습니다.</p>
          <Link href="/" className="text-blue-600 hover:underline">쇼핑 계속하기</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={String(order._id)} className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                <span className="font-bold">{order.totalPrice.toLocaleString()}원</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-700">
                  {item.productName} × {item.quantity}개 — {item.price.toLocaleString()}원
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-2">배송지: {order.deliveryAddress}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}