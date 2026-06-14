import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/db/connect'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, storeName } = await req.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      )
    }

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { message: '비밀번호는 8자 이상, 특수문자를 포함해야 합니다.' },
        { status: 400 }
      )
    }

    await dbConnect()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { message: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      storeName: role === 'seller' ? storeName : undefined,
    })

    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}