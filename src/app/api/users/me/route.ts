import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import Cart from '@/models/Cart'
import Product from '@/models/Product'

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })

  await dbConnect()

  const productCount = await Product.countDocuments({ sellerId: session.user.id })
  if (productCount > 0) {
    return NextResponse.json(
      { message: '등록한 상품이 존재합니다. 상품 등록을 제거 후 진행바랍니다.' },
      { status: 400 }
    )
  }

  await Cart.deleteMany({ userId: session.user.id })
  await User.findByIdAndDelete(session.user.id)

  return NextResponse.json({ message: '회원탈퇴가 완료되었습니다.' })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })

  await dbConnect()
  const { name, currentPassword, newPassword } = await req.json()

  const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 })

  if (name) user.name = name

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ message: '현재 비밀번호를 입력해주세요.' }, { status: 400 })
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: '현재 비밀번호가 올바르지 않습니다.' }, { status: 400 })
    }
    user.password = await bcrypt.hash(newPassword, 10)
  }

  await user.save()
  return NextResponse.json({ message: '회원정보가 수정되었습니다.' })
}