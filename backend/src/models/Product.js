import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  producer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ["cereales", "racines", "tubercules", "legumes", "oléagineux", "autre"] },
  description: { type: String },
  price: { type: Number, required: true },
  unit: { type: String, required: true, enum: ["kg", "litre", "sachet", "botte", "juute"] },
  stock_qty: { type: Number, required: true },
  commune: { type: String, required: true },
  images: [{ type: String }], // URLs R2
  traceability_id: { type: mongoose.Schema.Types.ObjectId, ref: "Traceability" },
  is_available: { type: Boolean, required: true, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Indexes pour recherche et filtres
productSchema.index({ producer_id: 1, commune: 1, category: 1, is_available: 1 });
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);

