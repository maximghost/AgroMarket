const cloudinary = require('../config/cloudinary')
const fs = require('fs')
const path = require('path')

/**
 * Upload une image locale vers Cloudinary
 * @param {string} localFilePath - Chemin du fichier local
 * @param {string} publicId - ID public Cloudinary (ex: 'agromarket/products/arachide')
 */
async function uploadImage(localFilePath, publicId) {
  try {
    if (!fs.existsSync(localFilePath)) {
      console.warn(`⚠️ Fichier non trouvé: ${localFilePath}`)
      return null
    }

    const result = await cloudinary.uploader.upload(localFilePath, {
      public_id: publicId,
      folder: 'agromarket/products',
      overwrite: true
    })

    console.log(`✅ Image uploadée: ${result.secure_url}`)
    return result.secure_url
  } catch (error) {
    console.error(`❌ Erreur upload ${localFilePath}:`, error.message)
    return null
  }
}

/**
 * Upload les images du seed vers Cloudinary
 */
async function uploadSeedImages() {
  const imageMappings = {
    'brochettes_escargot.jpg': 'brochettes_escargot',
    'tchakpalo.jpg': 'tchakpalo',
    'toubani.jpg': 'toubani',
    'viande_agouti.jpg': 'viande_agouti',
    'arachide.jpg': 'sauce_arachide',
    'crin-crin.jpg': 'sauce_crin_crin',
    'feuille.jpg': 'sauce_feuille',
    'gombo.jpg': 'sauce_gombo',
    'graine.jpg': 'sauce_graine',
    'tomate.jpg': 'sauce_tomate'
  }

  const uploadedUrls = {}

  for (const [fileName, publicId] of Object.entries(imageMappings)) {
    // Cherche le fichier dans les dossiers assets
    const assetDirs = [
      path.join(__dirname, '../../frontend/src/assets/images/sauces', fileName),
      path.join(__dirname, '../../frontend/src/assets/images/accompagnements', fileName),
      path.join(__dirname, '../../frontend/src/assets/images/boissons', fileName),
      path.join(__dirname, '../../frontend/src/assets/images/grillades', fileName),
      path.join(__dirname, '../../frontend/src/assets/images/pates', fileName),
      path.join(__dirname, '../../frontend/src/assets/images/plats_complets', fileName),
      path.join(__dirname, '../../frontend/src/assets/images/bouillies', fileName),
      path.join(__dirname, '../../frontend/src/assets/images/accompagnements', fileName)
    ]

    for (const assetPath of assetDirs) {
      if (fs.existsSync(assetPath)) {
        console.log(`🔄 Upload: ${fileName}...`)
        const url = await uploadImage(assetPath, publicId)
        if (url) {
          uploadedUrls[fileName] = url
        }
        break
      }
    }
  }

  return uploadedUrls
}

module.exports = {
  uploadImage,
  uploadSeedImages
}
