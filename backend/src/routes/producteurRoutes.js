import express from "express";
import {
  getDashboard,
  getProduits,
  getProduitById,   // ajout pour récupérer l'ID afin de modifier
  createProduit,
  updateProduit,
  deleteProduit,
  getCommandes
} from "../controllers/producteurController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Dashboard stats
router.get("/dashboard", protect, getDashboard);

// Produits CRUD
router.get("/produits", protect, getProduits);
router.get("/produits/:id", protect, getProduitById);
router.post("/produits", protect, createProduit);
router.put("/produits/:id", protect, updateProduit);
router.delete("/produits/:id", protect, deleteProduit);

// Commandes
router.get("/commandes", protect, getCommandes);

export default router;
