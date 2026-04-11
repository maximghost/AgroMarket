// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv"

import Product from "./src/models/Product.js";
import Traceability from "./src/models/Traceability.js";
import Order from "./src/models/Order.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/agromarket";

async function runSeed() {
  try {
    await mongoose.connect(MONGO_URI);

    // 1. Produit de test
    const product = await Product.create({
      producer_id: new mongoose.Types.ObjectId(),
      name: "Huile rouge",
      category: "oléagineux",
      description: "Huile rouge artisanale",
      price: 1500,
      unit: "litre",
      stock_qty: 20,
      commune: "Cotonou",
      is_available: true,
    });
    console.log("Produit créé:", product._id);

    // 2. Traçabilité liée au produit
    const trace = await Traceability.create({
      product_id: product._id,
      producer_id: product.producer_id,
      farm_name: "Ferme AgriCoop",
      commune: "Cotonou",
      cultivation_method: "traditionnel",
      harvest_date: new Date("2026-03-15"),
      is_verified: false,
    });
    console.log("Traçabilité créée:", trace._id);

    // 3. Commande de test
    const order = await Order.create({
      buyer_id: new mongoose.Types.ObjectId(),
      items: [{
        product_id: product._id,
        name: product.name,
        price_at_order: product.price,
        qty: 2,
        subtotal: product.price * 2,
        producer_id: product.producer_id,
      }],
      total_amount: product.price * 2,
      status: "confirmed",
      payment_status: "paid",
      delivery_address: {
        full_name: "Client Test",
        phone: "22990000000",
        commune: "Cotonou",
        quartier: "Zogbo",
        indications: "Maison bleue",
      },
      delivery_type: "standard",
    });
    console.log("Commande créée:", order._id);

    await mongoose.disconnect();
    console.log("🌱 Seed terminé, collections créées !");
  } catch (err) {
    console.error("❌ Erreur seed:", err);
  }
}

runSeed();

