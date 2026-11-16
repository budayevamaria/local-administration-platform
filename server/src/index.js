import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { connectDb } from './config/db.js'
import { Bookmark, City, Comment, Notification, Post, Rating, User } from './models/index.js'
import authRoutes from './routes/auth.js'
import cityRoutes from './routes/cities.js'
import postRoutes from './routes/posts.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  const state = mongoose.connection.readyState
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }

  res.json({
    ok: state === 1,
    service: 'represent-api',
    database: mongoose.connection.name,
    mongo: states[state] || 'unknown',
  })
})

app.get('/api/db', async (_req, res) => {
  const collections = {
    cities: await City.countDocuments(),
    users: await User.countDocuments(),
    posts: await Post.countDocuments(),
    ratings: await Rating.countDocuments(),
    comments: await Comment.countDocuments(),
    notifications: await Notification.countDocuments(),
    bookmarks: await Bookmark.countDocuments(),
  }

  const sample = {
    cities: await City.find().lean(),
    users: await User.find().select('-password').populate('city', 'name').lean(),
    posts: await Post.find().select('title district photo').populate('author', 'name role').lean(),
  }

  res.json({ database: mongoose.connection.name, collections, sample })
})

app.use('/api/auth', authRoutes)
app.use('/api/cities', cityRoutes)
app.use('/api/posts', postRoutes)

app.get('/', (_req, res) => {
  res.json({
    name: 'Represent API',
    week: 2,
    endpoints: [
      'GET /api/health',
      'GET /api/db',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/cities',
      'POST /api/posts',
    ],
  })
})

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set')
}

try {
  await connectDb()
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`)
  })
} catch (error) {
  console.error('Failed to start server:', error)
  process.exit(1)
}
