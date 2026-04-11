import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Inscription
export const register = async (req, res) => {
  try {
    const { full_name, email, phone, password, role, commune } = req.body;

    // Valider les entrées
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'full_name, email, password et role sont requis'
        }
      });
    }

    // Valider email formt
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Email invalide'
        }
      });
    }

    // Valider mot de passe (min 8 caractères)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Le mot de passe doit contenir au moins 8 caractères'
        }
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Cet email est déjà utilisé'
        }
      });
    }

    // Valider le role
    if (!['client', 'producteur', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ROLE',
          message: 'Role invalide. Utilisez: client, producteur ou admin'
        }
      });
    }

    // Hasher le mot de passe
    const password_hash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      full_name,
      email,
      phone,
      password_hash,
      role,
      commune,
    });

    // Générer un token JWT
    const access_token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          commune: user.commune
        },
        access_token
      },
      meta: {
        message: 'Utilisateur créé avec succès'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message
      }
    });
  }
};

// Connexion
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Valider les entrées
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Email et mot de passe requis'
        }
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email ou mot de passe incorrect'
        }
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email ou mot de passe incorrect'
        }
      });
    }

    // Vérifier que le compte est actif
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Votre compte a été désactivé'
        }
      });
    }

    // Générer un token JWT
    const access_token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          commune: user.commune
        },
        access_token
      },
      meta: {
        message: 'Connexion réussie'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message
      }
    });
  }
};

// Retourne les infos du profil utilisateur connecté
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Utilisateur non trouvé'
        }
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message
      }
    });
  }
};

