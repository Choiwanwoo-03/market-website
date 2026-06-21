import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import dbConnect from '@/db/connect'
import Order from '@/models/Order'
import WithdrawButton from '@/components/WithdrawButton'
import Product from '@/models/Product'

export default async function MyPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  await dbConnect()

  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean()
  const hasProducts = session.user.role === 'seller'
    ? (await Product.countDocuments({ sellerId: session.user.id })) > 0
    : false

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      <div className="mb-6 p-4 border rounded-lg">
        <p className="text-gray-600">이름: {session.user.name}</p>
        <p className="text-gray-600">이메일: {session.user.email}</p>
        <p className="text-gray-600">역할: {session.user.role}</p>
        <Link href="/mypage/edit" className="inline-block mt-4 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
          회원정보 수정
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-4">주문 내역</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">주문 내역이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={String(order._id)} className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">주문번호: {String(order._id)}</span>
                <span className="font-bold">₩{order.totalPrice.toLocaleString()}</span>
              </div>
              {(order.items ?? []).map((item, idx) => (
                <div key={idx} className="text-sm">
                  상품 ID: {String(item.productId)} × {item.quantity}개 — ₩{item.price.toLocaleString()}
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-2">배송지: {order.deliveryAddress}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-12 border-t pt-6">
        <WithdrawButton email={session.user.email!} hasProducts={hasProducts} />
      </div>
    </main>
  )
}