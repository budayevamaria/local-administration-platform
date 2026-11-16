import bcrypt from 'bcrypt'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../middleware/requireAuth.js'
import { City, User } from '../models/index.js'

const router = Router()

function publicUser(user) {
  const city = user.city
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    city: city?._id ? { id: city._id, name: city.name } : city,
    district: user.district,
    title: user.title,
    avatar: user.avatar,
    cover: user.cover,
    headerPhoto: user.headerPhoto,
    bio: user.bio,
  }
}

function signToken(user) {
  return jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

router.post('/register', async (req, res) => {
  const name = req.body.name?.trim()
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password
  const districtInput = req.body.district?.trim()

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' })
  }

  if (password.length < 4) {
    return res.status(400).json({ message: 'Password must be at least 4 characters' })
  }

  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(409).json({ message: 'This email is already registered' })
  }

  let city = null
  if (req.body.cityId) {
    city = await City.findById(req.body.cityId)
    if (!city) {
      return res.status(400).json({ message: 'City not found' })
    }
  } else {
    city = await City.findOne().sort({ name: 1 })
    if (!city) {
      return res.status(400).json({
        message: 'No cities are available yet. Send cityId and district, or seed the database.',
      })
    }
  }

  const district = districtInput || city.districts[0]
  if (!district) {
    return res.status(400).json({ message: 'District is required' })
  }

  if (city.districts.length > 0 && !city.districts.includes(district)) {
    return res.status(400).json({ message: 'District does not belong to this city' })
  }

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: 'resident',
    city: city._id,
    district,
    bio: 'New Represent resident.',
  })

  await user.populate('city', 'name')

  res.status(201).json({
    token: signToken(user),
    user: publicUser(user),
  })
})

router.post('/login', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  await user.populate('city', 'name')

  res.json({
    token: signToken(user),
    user: publicUser(user),
  })
})

router.get('/me', requireAuth, async (req, res) => {
  await req.user.populate('city', 'name')
  res.json({ user: publicUser(req.user) })
})

export default router
