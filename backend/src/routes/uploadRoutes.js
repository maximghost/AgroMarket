import express from 'express'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'
import protect from '../middlewares/authMiddleware.js'

const router = express.Router()

// Stockage en mémoire — le buffer est envoyé directement à Cloudinary
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont acceptées'))
    }
    cb(null, true)
  }
})

// POST /api/v1/upload/product-image
router.post('/product-image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: 'Aucun fichier fourni' } })
    }

    // Upload du buffer vers Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'agromarket/products', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      stream.end(req.file.buffer)
    })

    res.json({ success: true, data: { url: result.secure_url } })
  } catch (err) {
    res.status(500).json({ success: false, error: { message: err.message } })
  }
})

export default router
