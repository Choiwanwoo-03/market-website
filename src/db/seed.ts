import dotenv from 'dotenv'
dotenv.config({ path: '.env.local'})

import dbConnect from './connect'
import User from '../models/User'
import SellerProfile from '../models/SellerProfile'
import Product from '../models/Product'
import bcrypt from 'bcryptjs'

async function seed() {
  await dbConnect()
  console.log('MongoDB 연결 완료')

  // 기존 더미 데이터 초기화
  await Product.deleteMany({})
  await SellerProfile.deleteMany({})
  await User.deleteMany({ email: 'seller@market.com' })
  console.log('기존 더미 데이터 삭제 완료')

  // 판매자 계정 생성
  const hashedPassword = await bcrypt.hash('seller1234!', 10)
  const seller = await User.create({
    name: '키움 판매자',
    email: 'seller@market.com',
    password: hashedPassword,
    role: 'seller',
  })

  // 판매자 프로필 생성
  await SellerProfile.create({
    userId: seller._id,
    storeName: '키움 스토어',
  })
  console.log('판매자 계정 생성 완료')

  // 상품 더미 데이터
  const products = [
    {
      name: '무선 블루투스 이어폰',
      category: '전자제품',
      description: '고음질 노이즈 캔슬링 무선 이어폰입니다.',
      price: 89000,
      imageUrls: [],
      stock: 50,
      sellerId: seller._id,
    },
    {
      name: '스마트워치',
      category: '전자제품',
      description: '심박수 측정 및 운동 기록이 가능한 스마트워치입니다.',
      price: 199000,
      imageUrls: [],
      stock: 30,
      sellerId: seller._id,
    },
    {
      name: '흰색 반팔 티셔츠',
      category: '의류',
      description: '면 100% 편안한 기본 반팔 티셔츠입니다.',
      price: 15000,
      imageUrls: [],
      stock: 100,
      sellerId: seller._id,
    },
    {
      name: '슬림 청바지',
      category: '의류',
      description: '슬림핏 데님 소재 청바지입니다.',
      price: 45000,
      imageUrls: [],
      stock: 60,
      sellerId: seller._id,
    },
    {
      name: '유기농 사과 10개입',
      category: '식품',
      description: '국내산 유기농 사과 10개 묶음 상품입니다.',
      price: 12000,
      imageUrls: [],
      stock: 200,
      sellerId: seller._id,
    },
    {
      name: '원두커피 250g',
      category: '식품',
      description: '에티오피아산 싱글 오리진 원두커피입니다.',
      price: 18000,
      imageUrls: [],
      stock: 80,
      sellerId: seller._id,
    },
    {
      name: '미니 가습기',
      category: '생활용품',
      description: '초음파 방식의 조용한 미니 가습기입니다.',
      price: 32000,
      imageUrls: [],
      stock: 40,
      sellerId: seller._id,
    },
    {
      name: 'JavaScript 완벽 가이드',
      category: '도서',
      description: '웹 개발자를 위한 JavaScript 입문부터 심화까지 다루는 도서입니다.',
      price: 25000,
      imageUrls: [],
      stock: 0,
      sellerId: seller._id,
    },
  ]

  await Product.insertMany(products)
  console.log(`상품 ${products.length}개 등록 완료`)

  console.log('\n더미 데이터 등록 완료!')
  console.log('판매자 이메일: seller@market.com')
  console.log('판매자 비밀번호: seller1234!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('seed 오류:', err)
  process.exit(1)
})