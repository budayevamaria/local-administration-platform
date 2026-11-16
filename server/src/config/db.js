import mongoose from 'mongoose'

export async function connectDb(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(uri)

  const { name, host, port } = mongoose.connection
  console.log(`MongoDB connected: ${name} at ${host}:${port}`)

  return mongoose.connection
}

export async function disconnectDb() {
  await mongoose.disconnect()
}
