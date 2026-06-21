import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IWishlist extends Document {
  userId: Types.ObjectId
  productId: Types.ObjectId
}

const wishlistSchema = new Schema<IWishlist>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
}, { timestamps: true })

wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true })

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', wishlistSchema)

export default Wishlist