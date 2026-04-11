import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Dashboard
export const getDashboard = async (req, res) => {
  try {
    const producerId = req.user._id; // récupéré via JWT middleware

    const produits = await Product.countDocuments({ producer_id: producerId });
    const commandes = await Order.countDocuments({ "items.producer_id": producerId });
    const revenusAgg = await Order.aggregate([
      { $match: { "items.producer_id": producerId, payment_status: "paid" } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } }
    ]);
    const revenus = revenusAgg[0]?.total || 0;
    const clients = (await Order.distinct("buyer_id", { "items.producer_id": producerId })).length;

    // ventes mensuelles (agrégation par mois)
    const ventes = await Order.aggregate([
      { $match: { "items.producer_id": producerId } },
      { $unwind: "$items" },
      { $match: { "items.producer_id": producerId } },
      {
        $group: {
          _id: { $month: "$created_at" },
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

export const createProduit = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const producerId = req.user._id;

    // Construire l’URL publique de l’image
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/imagesDeProduits/${req.file.filename}`
      : null;

    const produit = new Product({
      ...req.body,
      producer_id: producerId,
      price: Number(req.body.price),       // cast en nombre
      stock_qty: Number(req.body.stock_qty), // cast en nombre
      images: imageUrl ? [imageUrl] : [] // tableau d’URLs
    });

    await produit.save();
    res.status(201).json(produit);
  } catch (err) {
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
  const producerId = req.user._id;
  const commandes = await Order.find({ "items.producer_id": producerId });
  res.json(commandes);
};
