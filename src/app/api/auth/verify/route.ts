import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/db/connect'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/auth/verify?error=invalid', req.url))
  }

  await dbConnect()
  const user = await User.findOne({ verificationToken: token })
  if (!user) {
    return NextResponse.redirect(new URL('/auth/verify?error=invalid', req.url))
  }

  user.isVerified = true
  user.verificationToken = null
  await user.save()

  return NextResponse.redirect(new URL('/auth/verify?success=true', req.url))
}