import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/db/connect'
import User from '@/models/User'
import transporter from '@/lib/mailer'
import { setOTP } from '@/lib/otpCache'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ message: '이메일을 입력해주세요.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: '올바른 이메일 형식이 아닙니다.' }, { status: 400 })
    }

    await dbConnect()
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ message: '이미 사용 중인 이메일입니다.' }, { status: 409 })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setOTP(email, code)

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '[키움 쇼핑몰] 이메일 인증번호',
      html: `
        <h2>키움 쇼핑몰 이메일 인증</h2>
        <p>아래 인증번호를 입력해주세요. 인증번호는 <strong>5분</strong> 동안 유효합니다.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;margin:20px 0;">${code}</div>
        <p style="color:#666;font-size:14px;">본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>
      `,
    })

    return NextResponse.json({ message: '인증번호를 발송했습니다.' })
  } catch {
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}