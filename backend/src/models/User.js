import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ["client", "producteur", "admin"], required: true },
  commune: { type: String },
  avatar_url: { type: String },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
