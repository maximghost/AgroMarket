import express from 'express'
import { register, login } from '../controllers/userController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
// TODO: POST /refresh, POST /logout à implémenter en V2

export default router
