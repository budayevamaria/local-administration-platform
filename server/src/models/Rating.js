import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true },
)

ratingSchema.index({ post: 1, user: 1 }, { unique: true })
ratingSchema.index({ user: 1 })

export const Rating = mongoose.model('Rating', ratingSchema)
