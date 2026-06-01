import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'buyer' | 'seller'
  createdAt: Date
}

const userSchema = new Schema<IUser>({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['buyer', 'seller'], required: true },
  createdAt: { type: Date, default: Date.now },
})

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User