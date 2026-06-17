import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/db/connect'
import User from '@/models/User'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })

  await dbConnect()
  const user = await User.findById(session.user.id).select('deliveryAddresses').lean()
  if (!user) return NextResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 })

  return NextResponse.json(user.deliveryAddresses)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })

  const { label, address } = await req.json()
  if (!address?.trim()) return NextResponse.json({ message: '주소를 입력해주세요.' }, { status: 400 })

  await dbConnect()
  const user = await User.findById(session.user.id)
  if (!user) return NextResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 })

  user.deliveryAddresses.push({ label: label?.trim() || '배송지', address: address.trim(), isDefault: false })
  await user.save()

  return NextResponse.json(
    { message: '배송지가 추가되었습니다.', deliveryAddresses: user.deliveryAddresses },
    { status: 201 }
  )
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 })

  const { id } = await req.json()

  await dbConnect()
  const user = await User.findByIdAndUpdate(
    session.user.id,
    { $pull: { deliveryAddresses: { _id: id } } },
    { new: true }
  )
  if (!user) return NextResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 })

  return NextResponse.json({ message: '배송지가 삭제되었습니다.', deliveryAddresses: user.deliveryAddresses })
}