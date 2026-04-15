import Product from '../models/Product.js'
import Traceability from '../models/Traceability.js'

/**
 * GET /products
 * Catalogue - liste paginée avec filtres
 * Query params: page, limit, commune, category, search, sort, order
 */
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      commune,
      category,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query

    // Valider les paramètres
    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20))
    const skip = (pageNum - 1) * limitNum
    const sortOrder = order === 'asc' ? 1 : -1

    // Construire le filtre
    const filter = { is_available: true }

    if (commune) filter.commune = commune
    if (category) filter.category = category

    // Recherche full-text
    if (search) {
      filter.$text = { $search: search }
    }

    // Récupérer les produits
    const products = await Product.find(filter)
      .populate('producer_id', 'full_name commune')
      .populate('traceability_id')
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .lean()

    // Compter le total
    const total = await Product.countDocuments(filter)

    res.json({
      success: true,
      data: products,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
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
 * GET /products/:id
 * Détail d'un produit + traçabilité
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params

    const product = await Product.findById(id)
      .populate('producer_id', 'full_name phone email commune')
      .populate('traceability_id')
      .lean()

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Produit non trouvé'
        }
      })
    }

    res.json({
      success: true,
      data: product
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
 * GET /traceability/:product_id
 * Fiche de traçabilité publique d'un produit
 */
export const getTraceability = async (req, res) => {
  try {
    const { product_id } = req.params

    const traceability = await Traceability.findOne({ product_id })
      .populate('product_id', 'name price')
      .populate('producer_id', 'full_name commune')
      .lean()

    if (!traceability) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Aucune fiche de traçabilité pour ce produit'
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
