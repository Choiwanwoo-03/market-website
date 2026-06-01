import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IOrder extends Document {
  userId: Types.ObjectId
  totalPrice: number
  deliveryAddress: string
  createdAt: Date
}

const orderSchema = new Schema<IOrder>({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalPrice:      { type: Number, required: true, min: 0 },
  deliveryAddress: { type: String, required: true },
  createdAt:       { type: Date, default: Date.now },
})

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)

export default Order