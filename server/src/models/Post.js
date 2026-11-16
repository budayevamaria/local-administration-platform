import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    photo: { type: String, default: '' },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    district: { type: String, required: true, trim: true },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true },
)

postSchema.index({ author: 1, createdAt: -1 })
postSchema.index({ city: 1, district: 1 })
postSchema.index({ hidden: 1, createdAt: -1 })

export const Post = mongoose.model('Post', postSchema)
