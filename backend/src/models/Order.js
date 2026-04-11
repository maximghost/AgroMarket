import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    buyer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: String,
        price_at_order: Number, // Prix fixé au moment de la commande
        qty: {
          type: Number,
          required: true
        },
        subtotal: Number // qty * price_at_order
      }
    ],
    total_amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    payment_status: {
      type: String,
      enum: ['unpaid', 'paid', 'failed'],
      default: 'unpaid'
    },
    payment_method: {
      type: String,
      enum: ['kkiapay', 'cash_on_delivery', 'simulation'],
      default: null
    },
    kkiapay_transaction_id: String, // ID retourné par KKiaPay
    delivery_address: {
      full_name: String,
      phone: String,
      commune: String,
      quartier: String,
      indications: String
    },
    delivery_type: {
      type: String,
      enum: ['standard', 'retrait_sur_place'],
      default: 'standard'
    },
    notes: String
  },
  { timestamps: true }
)

// Index pour les requêtes courantes
orderSchema.index({ buyer_id: 1, createdAt: -1 })
orderSchema.index({ status: 1 })

export default mongoose.model('Order', orderSchema)
