import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

/**
 * GET /cart
 * Récupérer le panier d'un client connecté
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id

    let cart = await Cart.findOne({ user_id: userId })
      .populate('items.product_id', 'name price stock_qty commune unit images')

    if (!cart) {
      // Créer un panier vide s'il n'existe pas
      cart = await Cart.create({ user_id: userId, items: [] })
    }

    res.json({
      success: true,
      data: cart
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
 * POST /cart/items
 * Ajouter un article au panier
 * Body: { product_id, qty }
 */
export const addToCart = async (req, res) => {
  try {
    console.log('📦 addToCart reçu - req.user:', req.user);
    const userId = req.user.id
    const { product_id, qty } = req.body

    // Valider les entrées
    if (!product_id || !qty || qty < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'product_id et qty (>0) requis'
        }
      })
    }

    // Vérifier que le produit existe et est disponible
    const product = await Product.findById(product_id)
    if (!product || !product.is_available) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Produit non disponible'
        }
      })
    }

    // Vérifier le stock
    if (product.stock_qty < qty) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'OUT_OF_STOCK',
          message: `Stock insuffisant. Disponible: ${product.stock_qty}`
        }
      })
    }

    // Obtenir ou créer le panier
    let cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] })
    }

    // Vérifier si l'article existe déjà
    const existingItem = cart.items.find(
      (item) => item.product_id.toString() === product_id
    )

    if (existingItem) {
      // Augmenter la quantité
      existingItem.qty += parseInt(qty)
    } else {
      // Ajouter un nouvel article
      cart.items.push({
        product_id,
        name: product.name,
        price_snapshot: product.price,
        qty: parseInt(qty)
      })
    }

    await cart.save()
    await cart.populate('items.product_id', 'name price stock_qty commune unit images')

    res.status(201).json({
      success: true,
      data: cart,
      meta: {
        message: 'Article ajouté au panier'
      }
    })
  } catch (error) {
    console.error('❌ Erreur addToCart:', error);
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
 * PATCH /cart/items/:product_id
 * Modifier la quantité d'un article
 * Body: { qty }
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id
    const { product_id } = req.params
    const { qty } = req.body

    if (!qty || qty < 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'qty requis et doit être >= 0'
        }
      })
    }

    const cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Panier non trouvé'
        }
      })
    }

    const item = cart.items.find(
      (i) => i.product_id.toString() === product_id
    )
    if (!item) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Article non trouvé dans le panier'
        }
      })
    }

    if (qty === 0) {
      // Supprimer l'article
      cart.items = cart.items.filter(
        (i) => i.product_id.toString() !== product_id
      )
    } else {
      // Vérifier le stock
      const product = await Product.findById(product_id)
      if (product.stock_qty < qty) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'OUT_OF_STOCK',
            message: `Stock insuffisant. Disponible: ${product.stock_qty}`
          }
        })
      }
      item.qty = qty
    }

    await cart.save()
    await cart.populate('items.product_id', 'name price stock_qty commune unit images')

    res.json({
      success: true,
      data: cart
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
 * DELETE /cart/items/:product_id
 * Supprimer un article du panier
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { product_id } = req.params

    const cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Panier non trouvé'
        }
      })
    }

    cart.items = cart.items.filter(
      (i) => i.product_id.toString() !== product_id
    )
    await cart.save()
    await cart.populate('items.product_id', 'name price stock_qty commune unit images')

    res.json({
      success: true,
      data: cart
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
 * DELETE /cart
 * Vider complètement le panier
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id

    const cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Panier non trouvé'
        }
      })
    }

    cart.items = []
    await cart.save()

    res.json({
      success: true,
      data: cart,
      meta: {
        message: 'Panier vidé'
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
 * POST /cart/checkout
 * Convertir le panier en commande
 * Alias pour POST /orders
 * Body: {
 *   delivery_address: { full_name, phone, commune, quartier, indications },
 *   delivery_type: "standard" | "retrait_sur_place",
 *   payment_method: "kkiapay" | "cash_on_delivery",
 *   notes: "..."
 * }
 */
export const checkoutCart = async (req, res) => {
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
    const order = await Order.create({
      buyer_id: userId,
      items: orderItems,
      total_amount: totalAmount,
      status: 'pending',
      payment_status: payment_method === 'kkiapay' ? 'unpaid' : 'unpaid',
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
