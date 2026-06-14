import mongoose, { Schema, Document, Model, Types } from 'mongoose'

const itemSchema = new Schema({
  productId:   { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity:    { type: Number, required: true, min: 1 },
  price:       { type: Number, required: true, min: 0 },
}, { _id: false })

export interface IOrder extends Document {
  userId: Types.ObjectId
  totalPrice: number
  deliveryAddress: string
  items: {
  productId: Types.ObjectId
  productName: string
  quantity: number
  price: number
  }[]
  createdAt: Date
}

const orderSchema = new Schema<IOrder>({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalPrice:      { type: Number, required: true, min: 0 },
  deliveryAddress: { type: String, required: true },
  items:           { type: [itemSchema], required: true},
  createdAt:       { type: Date, default: Date.now },
})

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)

export default Order