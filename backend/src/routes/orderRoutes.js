import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import {
  getOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  getClientDashboard
} from '../controllers/orderController.js'

const router = express.Router()

// Toutes les routes des commandes sont protégées
router.use(protect)

router.get('/', getOrders)
router.post('/', createOrder)
router.get('/dashboard', getClientDashboard)
router.get('/:id', getOrderById)
router.patch('/:id/cancel', cancelOrder)

export default router
