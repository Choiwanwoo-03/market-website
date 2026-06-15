import mongoose, { Schema, Document, Model } from 'mongoose'

const deliveryAddressesSchema = new Schema({
  label:     { type: String, default: '기본 배송지' },
  address:   { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true })

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'admin' | 'seller' | 'buyer'
  createdAt: Date
  deliveryAddresses: {
    label: string
    address: string
    isDefault: boolean
    _id?: mongoose.Types.ObjectId
  }[]
  storeName? : string
  isVerified: boolean
  verificationToken?: string | null
}

const userSchema = new Schema<IUser>({
  name:              { type: String, required: true },
  email:             { type: String, required: true, unique: true },
  password:          { type: String, required: true },
  role:              { type: String, enum: ['admin', 'seller', 'buyer'], required: true },
  createdAt:         { type: Date, default: Date.now },
  deliveryAddresses: { type: [deliveryAddressesSchema], default: [] },
  storeName:         { type : String },
  isVerified:        { type: Boolean, default: true },
  verificationToken: { type: String, default: null },
})

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User