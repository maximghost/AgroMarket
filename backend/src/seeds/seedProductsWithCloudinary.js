import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const produits = [
  // Accompagnements/Légumes
  { name: 'Ablo', price: 1500, unit: 'sachet', stock_qty: 50, category: 'legumes', commune: 'Comè', description: 'Ablo traditionnel', imageFile: 'ablo.jpg' },
  { name: 'Aloco', price: 1500, unit: 'sachet', stock_qty: 50, category: 'tubercules', commune: 'Cotonou', description: 'Banane frite', imageFile: 'aliko.jpg' },
  { name: 'Beignets', price: 1500, unit: 'sachet', stock_qty: 40, category: 'legumes', commune: 'Abomey-Calavi', description: 'Beignets frits', imageFile: 'beignets.jpg' },
  { name: 'Kléklé', price: 1500, unit: 'sachet', stock_qty: 45, category: 'legumes', commune: 'Porto-Novo', description: 'Galette croustillante', imageFile: 'klekle.jpg' },
  { name: 'Toubani', price: 1500, unit: 'sachet', stock_qty: 35, category: 'legumes', commune: 'Djougou', description: 'Mets traditionnel vapeur', imageFile: 'toubani.jpg' },
  
  // Boissons
  { name: 'Adoyo', price: 1500, unit: 'litre', stock_qty: 60, category: 'autre', commune: 'Porto-Novo', description: 'Boisson fermentée', imageFile: 'adoyo.jpg' },
  { name: 'Atan', price: 1500, unit: 'litre', stock_qty: 30, category: 'autre', commune: 'Ouémé', description: 'Vin de palme frais', imageFile: 'atan.jpg' },
  { name: 'Bissap', price: 1500, unit: 'litre', stock_qty: 50, category: 'autre', commune: 'Cotonou', description: 'Boisson hibiscus', imageFile: 'bissap.jpg' },
  { name: 'Sodabi', price: 1500, unit: 'litre', stock_qty: 25, category: 'autre', commune: 'Cotonou', description: 'Alcool distillé', imageFile: 'sodabi.jpg' },
  { name: 'Jus de tamarin', price: 1500, unit: 'litre', stock_qty: 40, category: 'autre', commune: 'Port-Novo', description: 'Jus acidulé', imageFile: 'tamarin.jpg' },
  { name: 'Tchakpalo', price: 1500, unit: 'litre', stock_qty: 35, category: 'autre', commune: 'Djougou', description: 'Bière traditionnelle', imageFile: 'tchakpalo.jpg' },
  { name: 'Tchoukoutou', price: 1500, unit: 'litre', stock_qty: 35, category: 'autre', commune: 'Natitingou', description: 'Bière artisanale', imageFile: 'tchoukoutou.jpg' },
  
  // Bouillies/Céréales
  { name: 'Aklui', price: 1500, unit: 'sachet', stock_qty: 45, category: 'cereales', commune: 'Au Sud', description: 'Bouillie fermentée maïs', imageFile: 'aklui.jpg' },
  { name: 'Bouillie de Gari', price: 1500, unit: 'sachet', stock_qty: 50, category: 'cereales', commune: 'Allada', description: 'Gari bouilli', imageFile: 'gari.jpg' },
  { name: 'Bouillie de mil', price: 1500, unit: 'sachet', stock_qty: 50, category: 'cereales', commune: 'Zones urbaines', description: 'Bouillie de mil', imageFile: 'mil.jpg' },
  { name: 'Bouillie de soja', price: 1500, unit: 'sachet', stock_qty: 45, category: 'oleagineux', commune: 'Abomey-Calavi', description: 'Bouillie de soja', imageFile: 'soja.jpg' },
  
  // Grillades
  { name: 'Viande d\'agouti', price: 1500, unit: 'kg', stock_qty: 25, category: 'autre', commune: 'Sô-Ava', description: 'Viande grillée', imageFile: 'agouti.jpg' },
  { name: 'Brochettes de viande', price: 1500, unit: 'kg', stock_qty: 40, category: 'autre', commune: 'Djougou', description: 'Viande grillée', imageFile: 'brochettes.jpg' },
  { name: 'Brochettes d\'escargot', price: 1500, unit: 'kg', stock_qty: 30, category: 'autre', commune: 'Abomey-Calavi', description: 'Escargots grillés', imageFile: 'escargot.jpg' },
  { name: 'Wagashi', price: 1500, unit: 'kg', stock_qty: 35, category: 'autre', commune: 'Parakou', description: 'Fromage grillé', imageFile: 'fromage.jpg' },
  { name: 'Hanlan', price: 1500, unit: 'kg', stock_qty: 40, category: 'autre', commune: 'Porto-Novo', description: 'Viande de porc grillée', imageFile: 'hanlan.jpg' },
  { name: 'Méchoui local', price: 1500, unit: 'kg', stock_qty: 20, category: 'autre', commune: 'Djougou', description: 'Agneau rôti', imageFile: 'mechoui.jpg' },
  
  // Sauces
  { name: 'Sauce d\'arachide', price: 1500, unit: 'kg', stock_qty: 40, category: 'autre', commune: 'Abomey', description: 'Sauce riche', imageFile: 'arachide.jpg' },
  { name: 'Sauce de crin-crin', price: 1500, unit: 'kg', stock_qty: 30, category: 'autre', commune: 'Cotonou', description: 'Sauce verte', imageFile: 'crin-crin.jpg' },
  { name: 'Sauce feuille', price: 1500, unit: 'kg', stock_qty: 35, category: 'autre', commune: 'Natitingou', description: 'Sauce feuilles', imageFile: 'feuille.jpg' },
  { name: 'Sauce gombo', price: 1500, unit: 'kg', stock_qty: 25, category: 'autre', commune: 'Mono', description: 'Sauce gluante', imageFile: 'gombo.jpg' },
  { name: 'Sauce graine', price: 1500, unit: 'kg', stock_qty: 40, category: 'autre', commune: 'Bohicon', description: 'À base de noix de palme', imageFile: 'graine.jpg' },
  { name: 'Sauce tomate', price: 1500, unit: 'kg', stock_qty: 45, category: 'autre', commune: 'Porto-Novo', description: 'Sauce rouje', imageFile: 'tomate.jpg' },
];

// Mapper les fichiers aux catégories
const imageCategoryMap = {
  'ablo.jpg': 'accompagnements',
  'aliko.jpg': 'accompagnements',
  'beignets.jpg': 'accompagnements',
  'klekle.jpg': 'accompagnements',
  'toubani.jpg': 'accompagnements',
  'adoyo.jpg': 'boissons',
  'atan.jpg': 'boissons',
  'bissap.jpg': 'boissons',
  'sodabi.jpg': 'boissons',
  'tamarin.jpg': 'boissons',
  'tchakpalo.jpg': 'boissons',
  'tchoukoutou.jpg': 'boissons',
  'aklui.jpg': 'bouillies',
  'gari.jpg': 'bouillies',
  'mil.jpg': 'bouillies',
  'soja.jpg': 'bouillies',
  'agouti.jpg': 'grillades',
  'brochettes.jpg': 'grillades',
  'escargot.jpg': 'grillades',
  'fromage.jpg': 'grillades',
  'hanlan.jpg': 'grillades',
  'mechoui.jpg': 'grillades',
  'arachide.jpg': 'sauces',
  'crin-crin.jpg': 'sauces',
  'feuille.jpg': 'sauces',
  'gombo.jpg': 'sauces',
  'graine.jpg': 'sauces',
  'tomate.jpg': 'sauces'
};

async function uploadImageToCloudinary(imageFile) {
  try {
    const category = imageCategoryMap[imageFile];
    const frontendPath = path.join(__dirname, `../../../frontend/src/assets/images/${category}/${imageFile}`);
    
    if (!fs.existsSync(frontendPath)) {
      console.warn(`⚠️ Fichier non trouvé: ${frontendPath}`);
      return null;
    }

    const result = await cloudinary.uploader.upload(frontendPath, {
      public_id: `agromarket/products/${imageFile.replace(/\.[^.]+$/, '')}`,
      overwrite: true
    });

    console.log(`✅ Image uploadée: ${imageFile}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Erreur upload ${imageFile}:`, error.message);
    return null;
  }
}

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer ou récupérer un producteur par défaut
    let producer = await User.findOne({ role: 'producteur' });
    if (!producer) {
      producer = await User.create({
        full_name: 'Producteur Défaut',
        email: 'producteur@agromarket.com',
        phone: '22900000000',
        password: 'hash_placeholder',
        role: 'producteur',
        commune: 'Cotonou'
      });
      console.log('👤 Producteur créé:', producer._id);
    }

    // Vider les anciens produits
    await Product.deleteMany({});

    // Upload images et créer produits
    console.log('\n🔄 Upload des images et création des produits...\n');

    for (const produit of produits) {
      const imageUrl = await uploadImageToCloudinary(produit.imageFile);
      
      const newProduct = {
        name: produit.name,
        price: produit.price,
        unit: produit.unit,
        stock_qty: produit.stock_qty,
        category: produit.category,
        commune: produit.commune,
        description: produit.description,
        images: imageUrl ? [imageUrl] : [],
        producer_id: producer._id,
        is_available: true
      };

      await Product.create(newProduct);
    }

    console.log(`\n✅ ${produits.length} produits créés avec images Cloudinary!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seed:', error);
    process.exit(1);
  }
}

seedProducts();
