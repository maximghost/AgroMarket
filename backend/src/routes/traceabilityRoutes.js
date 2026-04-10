import express from 'express'
import {
  getTraceabilityByProductId,
  getAllTraceabilities
} from '../controllers/traceabilityController.js'

const router = express.Router()

// Routes publiques (lecture seule)
router.get('/:product_id', getTraceabilityByProductId)
router.get('/', getAllTraceabilities)

export default router
