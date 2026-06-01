import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IProduct extends Document {
  name: string
  category: string
  description: string
  price: number
  imageUrls: string[]
  stock: number
  sellerId: Types.ObjectId
}

const productSchema = new Schema<IProduct>({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  imageUrls:   { type: [String], default: [], validate: {
    validator: (v: string[]) => v.length <= 3,
    message: '이미지는 최대 3개까지 등록 가능합니다.',
  }},
  stock:       { type: Number, required: true, min: 0, default: 0 },
  sellerId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)

export default Product