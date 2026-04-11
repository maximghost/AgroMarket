import express from "express";
import multer from "multer";
import {
  getDashboard,
  getProduits,
  getProduitById,   //  ajout pour récupérer l'ID afin de modifier
  createProduit,
  updateProduit,
  deleteProduit,
  getCommandes
} from "../controllers/producteurController.js";
import protect from "../middlewares/authMiddleware.js";

import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../imagesDeProduits")); // dossier à la racine backend
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Dashboard stats
router.get("/dashboard", protect, getDashboard);

// Produits CRUD
router.get("/produits", protect, getProduits);
router.get("/produits/:id", protect, getProduitById);
router.post("/produits", protect, upload.single("image"), createProduit);
router.put("/produits/:id", protect, updateProduit);
router.delete("/produits/:id", protect, deleteProduit);

// Commandes
router.get("/commandes", protect, getCommandes);

export default router;
