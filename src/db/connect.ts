import mongoose, { Mongoose } from 'mongoose'

declare global {
  var mongooseCache: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  } | undefined
}

const cached = global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null })

async function dbConnect(): Promise<Mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI 환경변수가 설정되지 않았습니다.')
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  try {
    cached.conn = await cached.promise!
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn!
}

export default dbConnect
