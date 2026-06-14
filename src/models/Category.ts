import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICategory extends Document {
  name: string
  description?: string
}

const categorySchema = new Schema<ICategory>({
  name:        { type: String, required: true, unique: true },
  description: { type: String },
})

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)

export default Category