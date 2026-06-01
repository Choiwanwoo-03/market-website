import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface ISellerProfile extends Document {
  userId: Types.ObjectId
  storeName?: string
}

const sellerProfileSchema = new Schema<ISellerProfile>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName: { type: String },
})

const SellerProfile: Model<ISellerProfile> =
  mongoose.models.SellerProfile ||
  mongoose.model<ISellerProfile>('SellerProfile', sellerProfileSchema)

export default SellerProfile