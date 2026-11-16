import { Router } from 'express'
import { City } from '../models/index.js'

const router = Router()

router.get('/', async (_req, res) => {
  const cities = await City.find().sort({ name: 1 }).lean()

  res.json({
    cities: cities.map((city) => ({
      id: city._id.toString(),
      name: city.name,
      districts: city.districts,
    })),
  })
})

export default router
