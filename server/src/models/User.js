import mongoose from 'mongoose'

const ROLES = ['resident', 'akim', 'admin']

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 4, select: false },
    role: { type: String, enum: ROLES, default: 'resident', required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    district: { type: String, required: true, trim: true },
    title: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
    cover: { type: String, default: '' },
    headerPhoto: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  { timestamps: true },
)

userSchema.index({ role: 1 })
userSchema.index({ city: 1, district: 1 })

export const USER_ROLES = ROLES
export const User = mongoose.model('User', userSchema)
