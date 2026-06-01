import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IOrderItem extends Document {
  orderId: Types.ObjectId
  productId: Types.ObjectId
  quantity: number
  price: number
}

const orderItemSchema = new Schema<IOrderItem>({
  orderId:   { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:  { type: Number, required: true },
  price:     { type: Number, required: true },
})

const OrderItem: Model<IOrderItem> =
  mongoose.models.OrderItem ||
  mongoose.model<IOrderItem>('OrderItem', orderItemSchema)

export default OrderItem