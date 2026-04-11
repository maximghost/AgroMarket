import express from "express";
import { getMe } from "../controllers/userController.js";
import protect from '../middlewares/authMiddleware.js'

const router = express.Router();

// Routes utilisateur (profil) - protégées
router.use(protect)
router.get("/me", getMe);
// TODO: PATCH /me pour modifier le profil

export default router;

