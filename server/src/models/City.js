import mongoose from 'mongoose'

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    districts: {
      type: [String],
      default: [],
      validate: {
        validator: (districts) => districts.every((name) => typeof name === 'string' && name.trim().length > 0),
        message: 'Each district must be a non-empty string',
      },
    },
  },
  { timestamps: true },
)

export const City = mongoose.model('City', citySchema)
