import express from 'express'
import {
  getProducts,
  getProductById,
  getTraceability
} from '../controllers/productController.js'

const router = express.Router()

// Routes publiques (pas de protection)
router.get('/', getProducts)
router.get('/:id', getProductById)
router.get('/:product_id/traceability', getTraceability)

export default router
