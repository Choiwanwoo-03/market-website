import { NextResponse } from 'next/server'
import dbConnect from '@/db/connect'

export async function GET() {
  try {
    await dbConnect()
    return NextResponse.json({ message: 'MongoDB 연결 성공' })
  } catch (error) {
    return NextResponse.json(
      { message: 'MongoDB 연결 실패', error: String(error) },
      { status: 500 }
    )
  }
}