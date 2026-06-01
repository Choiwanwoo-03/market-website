import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface ICart extends Document {
  userId: Types.ObjectId
  productId: Types.ObjectId
  quantity: number
}

const cartSchema = new Schema<ICart>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:  { type: Number, required: true, min: 1 },
})

const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema)

export default Cart