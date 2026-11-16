import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true },
)

commentSchema.index({ post: 1, createdAt: 1 })
commentSchema.index({ user: 1 })

export const Comment = mongoose.model('Comment', commentSchema)
