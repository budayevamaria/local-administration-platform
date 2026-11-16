import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireRole } from '../middleware/requireRole.js'

const router = Router()

// Week 2 permission check only. Creating and saving posts comes later.
router.post('/', requireAuth, requireRole('akim', 'admin'), (req, res) => {
  res.status(201).json({
    allowed: true,
    message: 'Role check passed. Only an akim or an admin can create administration posts.',
    role: req.user.role,
  })
})

export default router
