import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
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
        price_snapshot: Number, // Prix au moment de l'ajout au panier
        qty: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ]
  },
  { timestamps: false }
)

// Met à jour updated_at automatiquement
cartSchema.add({ updated_at: Date })
cartSchema.pre('save', async function(next) {
  this.updated_at = new Date()
})

export default mongoose.model('Cart', cartSchema)
