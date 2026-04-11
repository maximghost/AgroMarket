import Traceability from '../models/Traceability.js'

/**
 * GET /traceability/:product_id
 * Récupérer la traçabilité d'un produit
 */
export const getTraceabilityByProductId = async (req, res) => {
  try {
    const { product_id } = req.params

    const traceability = await Traceability.findOne({ product_id })
      .populate('producer_id', 'full_name email phone commune')
      .populate('product_id', 'name category')

    if (!traceability) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Traçabilité non disponible pour ce produit'
        }
      })
    }

    res.json({
      success: true,
      data: traceability
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message
      }
    })
  }
}

/**
 * GET /traceability (tous les produits avec traçabilité)
 */
export const getAllTraceabilities = async (req, res) => {
  try {
    const traceabilities = await Traceability.find()
      .populate('producer_id', 'full_name email commune')
      .populate('product_id', 'name category price')
      .limit(100)

    res.json({
      success: true,
      data: traceabilities
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message
      }
    })
  }
}
