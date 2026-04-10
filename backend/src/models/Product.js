import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    producer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['cereales', 'racineshuile', 'tubercules', 'legumes', 'oleagineux', 'autre'],
      required: true,
      index: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'litre', 'sachet', 'botte', 'unite'],
      required: true
    },
    stock_qty: {
      type: Number,
      required: true,
      default: 0
    },
    commune: {
      type: String,
      required: true,
      index: true
    },
    images: [String], // URLs des images stockées sur R2
    traceability_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Traceability',
      default: null
    },
    is_available: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
)

// Index texte pour recherche full-text
productSchema.index({ name: 'text', description: 'text' })

export default mongoose.model('Product', productSchema)
