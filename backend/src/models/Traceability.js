
import mongoose from 'mongoose'

const traceabilitySchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,
      index: true
    },
    producer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    farm_name: String,
    commune: String,
    cultivation_method: {
      type: String,
      enum: ['traditionnel', 'bio', 'semi-intensif'],
      default: null
    },
    harvest_date: Date,
    processing_steps: [
      {
        step: String,
        description: String,
        date: Date
      }
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        issued_at: Date
      }
    ],
    pesticides_used: {
      type: Boolean,
      default: false
    },
    is_verified: {
      type: Boolean,
      default: false // false = auto-déclaration, true = validé par admin
    }
  },
  { timestamps: true }
)

export default mongoose.model('Traceability', traceabilitySchema)

