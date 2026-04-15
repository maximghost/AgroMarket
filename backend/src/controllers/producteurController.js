import Product from "../models/Product.js";
import Order from "../models/Order.js";
import cloudinary from "../config/cloudinary.js";

// Dashboard
export const getDashboard = async (req, res) => {
  try {
    const producerId = req.user._id; // récupéré via JWT middleware

    // Récupérer les IDs des produits du producteur
    const productIds = await Product.find({ producer_id: producerId }).distinct('_id');

    const produits = await Product.countDocuments({ producer_id: producerId });
    const commandes = await Order.countDocuments({ "items.product_id": { $in: productIds } });
    const revenusAgg = await Order.aggregate([
      { $match: { "items.product_id": { $in: productIds }, payment_status: "paid" } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } }
    ]);
    const revenus = revenusAgg[0]?.total || 0;
    const clients = (await Order.distinct("buyer_id", { "items.product_id": { $in: productIds } })).length;

    // ventes mensuelles (agrégation par mois)
    const ventes = await Order.aggregate([
      { $match: { "items.product_id": { $in: productIds } } },
      { $unwind: "$items" },
      { $match: { "items.product_id": { $in: productIds } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$items.qty" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const moisMap = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
    const ventesFormatted = moisMap.map((m, i) => {
      const found = ventes.find(v => v._id === i+1);
      return { mois: m, v: found ? found.total : 0 };
    });

    res.json({ produits, commandes, revenus, clients, ventes: ventesFormatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Produits
export const getProduits = async (req, res) => {
  const producerId = req.user._id;
  const produits = await Product.find({ producer_id: producerId });
  res.json(produits);
};

// récupérer un produit par ID
export const getProduitById = async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.json(produit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// créer un produit avec URL Cloudinary envoyée par le frontend
export const createProduit = async (req, res) => {
  try {
    console.log("req.body:", req.body);

    const producerId = req.user._id;

    const produit = new Product({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      unit: req.body.unit,
      stock_qty: Number(req.body.stock_qty),
      category: req.body.category,
      commune: req.body.commune,
      lot: req.body.lot,
      dateProduction: req.body.dateProduction ? new Date(req.body.dateProduction) : null,
      dateExpiration: req.body.dateExpiration ? new Date(req.body.dateExpiration) : null,
      producer_id: producerId,
      images: req.body.images || []   // tableau d’URL Cloudinary
    });

    await produit.save();
    res.status(201).json(produit);
  } catch (err) {
    console.error("Erreur création produit:", err.message);
    res.status(400).json({ error: err.message });
  }
};


export const updateProduit = async (req, res) => {
  try {
    const produit = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.json(produit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduit = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Commandes
export const getCommandes = async (req, res) => {
  try {
    const producerId = req.user._id;
    const productIds = await Product.find({ producer_id: producerId }).distinct('_id');
    const commandes = await Order.find({ "items.product_id": { $in: productIds } })
      .sort({ createdAt: -1 });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
