import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price_at_order: Number,
    qty: Number,
    subtotal: Number,
    producer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // pour filtrer par producteur
  }],
  total_amount: { type: Number, required: true },
  status: { type: String, required: true, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" },
  payment_status: { type: String, required: true, enum: ["unpaid", "paid", "failed"], default: "unpaid" },
  payment_method: { type: String, enum: ["kkiapay", "cash_on_delivery"] },
  kkiapay_transaction_id: { type: String },
  delivery_address: {
    full_name: String,
    phone: String,
    commune: String,
    quartier: String,
    indications: String
  },
  delivery_type: { type: String, required: true, enum: ["standard", "retrait_sur_place"] },
  notes: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);

