import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IOrderItem {
  productId: Types.ObjectId
  quantity: number
  price: number
}

export interface IOrder extends Document {
  userId: Types.ObjectId
  totalPrice: number
  deliveryAddress: string
  createdAt: Date
  items: IOrderItem[]
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:  { type: Number, required: true, min: 1 },
  price:     { type: Number, required: true, min: 0 },
}, { _id: false })

const orderSchema = new Schema<IOrder>({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalPrice:      { type: Number, required: true, min: 0 },
  deliveryAddress: { type: String, required: true },
  createdAt:       { type: Date, default: Date.now },
  items:           { type: [orderItemSchema], required: true },
})

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)

export default Order