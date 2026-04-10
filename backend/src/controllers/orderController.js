import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

/**
 * GET /orders
 * Mes commandes (client connecté)
 * Query params: page, limit, status
 */
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 10, status } = req.query

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10))
    const skip = (pageNum - 1) * limitNum

    const filter = { buyer_id: userId }
    if (status) filter.status = status

    const orders = await Order.find(filter)
      .populate('items.product_id', 'name category')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean()

    const total = await Order.countDocuments(filter)

    res.json({
      success: true,
      data: orders,
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
 * GET /orders/:id
 * Détail d'une commande
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const order = await Order.findById(id)
      .populate('buyer_id', 'full_name email phone')
      .populate('items.product_id', 'name price category producer_id')
      .lean()

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Commande non trouvée'
        }
      })
    }

    // Vérifier que c'est la commande du client connecté
    if (order.buyer_id._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Accès refusé'
        }
      })
    }

    res.json({
      success: true,
      data: order
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
 * POST /orders
 * Passer une commande à partir du panier
 * Body: {
 *   delivery_address: { full_name, phone, commune, quartier, indications },
 *   delivery_type: "standard" | "retrait_sur_place",
 *   payment_method: "kkiapay" | "cash_on_delivery",
 *   notes: "..."
 * }
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id
    const { delivery_address, delivery_type, payment_method, notes } = req.body

    // Valider les entrées
    if (!delivery_address || !delivery_type || !payment_method) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message:
            'delivery_address, delivery_type et payment_method requis'
        }
      })
    }

    if (!['standard', 'retrait_sur_place'].includes(delivery_type)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'delivery_type invalide'
        }
      })
    }

    if (!['kkiapay', 'cash_on_delivery'].includes(payment_method)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'payment_method invalide'
        }
      })
    }

    // Récupérer le panier
    const cart = await Cart.findOne({ user_id: userId })
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_CART',
          message: 'Le panier est vide'
        }
      })
    }

    // Préparer les items avec les prix actuels et vérifier le stock
    const orderItems = []
    let totalAmount = 0

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product_id)

      if (!product || !product.is_available) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PRODUCT_UNAVAILABLE',
            message: `Le produit ${cartItem.name} n'est plus disponible`
          }
        })
      }

      if (product.stock_qty < cartItem.qty) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'OUT_OF_STOCK',
            message: `Stock insuffisant pour ${cartItem.name}. Disponible: ${product.stock_qty}`
          }
        })
      }

      const subtotal = product.price * cartItem.qty
      orderItems.push({
        product_id: product._id,
        name: product.name,
        price_at_order: product.price,
        qty: cartItem.qty,
        subtotal
      })

      totalAmount += subtotal
    }

    // Créer la commande
    const paymentStatus =
      payment_method === 'kkiapay' ? 'unpaid' : 'unpaid' // cash_on_delivery : unpaid aussi

    const order = await Order.create({
      buyer_id: userId,
      items: orderItems,
      total_amount: totalAmount,
      status: 'pending',
      payment_status: paymentStatus,
      payment_method,
      delivery_address,
      delivery_type,
      notes
    })

    // Vider le panier
    await Cart.updateOne({ user_id: userId }, { items: [] })

    res.status(201).json({
      success: true,
      data: order,
      meta: {
        message: 'Commande créée avec succès'
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
 * PATCH /orders/:id/cancel
 * Annuler une commande (uniquement si status = pending)
 */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Commande non trouvée'
        }
      })
    }

    if (order.buyer_id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Accès refusé'
        }
      })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: `Impossible d'annuler une commande avec le statut: ${order.status}`
        }
      })
    }

    order.status = 'cancelled'
    await order.save()

    res.json({
      success: true,
      data: order,
      meta: {
        message: 'Commande annulée'
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
 * GET /client/dashboard
 * Résumé du client: nb commandes, statuts, total dépensé
 */
export const getClientDashboard = async (req, res) => {
  try {
    const userId = req.user.id

    // Compter les commandes par statut
    const allOrders = await Order.find({ buyer_id: userId })

    const stats = {
      orders_total: allOrders.length,
      orders_pending: allOrders.filter((o) => o.status === 'pending').length,
      orders_confirmed: allOrders.filter((o) => o.status === 'confirmed')
        .length,
      orders_shipped: allOrders.filter((o) => o.status === 'shipped').length,
      orders_delivered: allOrders.filter((o) => o.status === 'delivered')
        .length,
      orders_cancelled: allOrders.filter((o) => o.status === 'cancelled')
        .length,
      total_spent: allOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    }

    res.json({
      success: true,
      data: stats
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
