import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import dbConnect from '@/db/connect'
import User from '@/models/User'
import transporter from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, storeName } = await req.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: '필수 항목을 모두 입력해주세요.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: '올바른 이메일 형식이 아닙니다.' }, { status: 400 })
    }

    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ message: '비밀번호는 8자 이상, 특수문자를 포함해야 합니다.' }, { status: 400 })
    }

    await dbConnect()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ message: '이미 사용 중인 이메일입니다.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = crypto.randomBytes(32).toString('hex')

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      storeName: role === 'seller' ? storeName : undefined,
      isVerified: false,
      verificationToken,
    })

    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verificationToken}`
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '[키움 쇼핑몰] 이메일 인증을 완료해주세요',
      html: `
        <h2>키움 쇼핑몰 이메일 인증</h2>
        <p>아래 버튼을 클릭하여 이메일 인증을 완료해주세요.</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">이메일 인증하기</a>
        <p style="margin-top:16px;color:#666;font-size:14px;">링크가 작동하지 않으면 아래 URL을 브라우저에 붙여넣으세요:</p>
        <p style="color:#666;font-size:12px;">${verifyUrl}</p>
      `,
    })

    return NextResponse.json({ message: '회원가입이 완료되었습니다. 이메일을 확인해주세요.' }, { status: 201 })
  } catch {
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}