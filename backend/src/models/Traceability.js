import mongoose from "mongoose";

const traceabilitySchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
  producer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farm_name: { type: String },
  commune: { type: String },
  cultivation_method: { type: String, enum: ["traditionnel", "bio", "semi-intensif"] },
  harvest_date: { type: Date },
  processing_steps: [{ step: String, description: String, date: Date }],
  certifications: [{ name: String, issuer: String, issued_at: Date }],
  pesticides_used: { type: Boolean },
  is_verified: { type: Boolean, required: true, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model("Traceability", traceabilitySchema);

