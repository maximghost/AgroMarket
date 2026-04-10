import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkoutCart
} from '../controllers/cartController.js'

const router = express.Router()

// Toutes les routes du panier sont protégées
router.use(protect)

router.get('/', getCart)
router.post('/items', addToCart)
router.patch('/items/:product_id', updateCartItem)
router.delete('/items/:product_id', removeFromCart)
router.delete('/', clearCart)
router.post('/checkout', checkoutCart)

export default router
