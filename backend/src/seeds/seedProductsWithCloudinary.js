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

// ===== TUBERCULES =====
// Igname, Taro, Pomme de terre, Patate douce, Manioc
const tubercules = [
  { name: 'Igname', price: 2500, unit: 'kg', stock_qty: 40, category: 'tubercules', commune: 'Sakété', description: 'Igname fraîche', imageFile: 'igname.png' },
  { name: 'Taro', price: 2200, unit: 'kg', stock_qty: 35, category: 'tubercules', commune: 'Ouidah', description: 'Taro de qualité', imageFile: 'taro.jpg' },
  { name: 'Pomme de Terre', price: 2000, unit: 'kg', stock_qty: 50, category: 'tubercules', commune: 'Parakou', description: 'Pomme de terre locale', imageFile: 'pommeTerre.jpg' },
  { name: 'Patate Douce', price: 1800, unit: 'kg', stock_qty: 45, category: 'tubercules', commune: 'Djougou', description: 'Patate douce riche', imageFile: 'patate_douce.jpg' },
  { name: 'Manioc', price: 1500, unit: 'kg', stock_qty: 60, category: 'tubercules', commune: 'Cotonou', description: 'Racine de manioc frais', imageFile: 'manioc.jpg' },
];

// ===== CÉRÉALES =====
// Fonio, Maïs blanc, Maïs jaune, Mil, Soja, Riz, Sorgho
const cereales = [
  { name: 'Fonio', price: 3500, unit: 'kg', stock_qty: 30, category: 'cereales', commune: 'Natitingou', description: 'Fonio décortiqué', imageFile: 'fonio.jpg' },
  { name: 'Maïs Blanc', price: 2200, unit: 'kg', stock_qty: 55, category: 'cereales', commune: 'Parakou', description: 'Maïs blanc fermier', imageFile: 'maïs_blanc.jpg' },
  { name: 'Maïs Jaune', price: 2200, unit: 'kg', stock_qty: 50, category: 'cereales', commune: 'Ouémé', description: 'Maïs jaune sec', imageFile: 'maïs_jaune.jpg' },
  { name: 'Mil', price: 2000, unit: 'kg', stock_qty: 40, category: 'cereales', commune: 'Djougou', description: 'Mil grain', imageFile: 'mil.webp' },
  { name: 'Soja', price: 3000, unit: 'kg', stock_qty: 35, category: 'cereales', commune: 'Abomey-Calavi', description: 'Soja sec', imageFile: 'soja.jpg' },
  { name: 'Riz', price: 4000, unit: 'kg', stock_qty: 45, category: 'cereales', commune: 'Sô-Ava', description: 'Riz local blanc', imageFile: 'riz.jpg' },
  { name: 'Sorgho', price: 2100, unit: 'kg', stock_qty: 38, category: 'cereales', commune: 'Kandi', description: 'Sorgho grain', imageFile: 'sorgho.webp' },
];

// ===== OLÉAGINEUX =====
// Palmier, Néré, Arachide
const oleagineux = [
  { name: 'Palmier', price: 2800, unit: 'kg', stock_qty: 25, category: 'oleagineux', commune: 'Allada', description: 'Fruit du palmier', imageFile: 'palmier.jpg' },
  { name: 'Néré', price: 3200, unit: 'kg', stock_qty: 20, category: 'oleagineux', commune: 'Lokossa', description: 'Graines de néré', imageFile: 'Nere.jpg' },
  { name: 'Arachide', price: 2500, unit: 'kg', stock_qty: 50, category: 'oleagineux', commune: 'Kandi', description: 'Arachide décortiquée', imageFile: 'arachide.jpg' },
];

// ===== LÉGUMES =====
// Amarante, Vernonia, Tomates, Tchayo, Poivron, Piment, Manioc feuilles, Laitue, Gombo, Gboma, Crin-crin, Concombre, Chou, Carotte, Basilic, Baobab
const legumes = [
  { name: 'Amarante', price: 1200, unit: 'botte', stock_qty: 40, category: 'legumes', commune: 'Cotonou', description: 'Feuilles d\'amarante frais', imageFile: 'amarante.jpg' },
  { name: 'Vernonia', price: 1300, unit: 'botte', stock_qty: 35, category: 'legumes', commune: 'Porto-Novo', description: 'Vernonia salade', imageFile: 'vernonia.jpg' },
  { name: 'Tomates', price: 1500, unit: 'kg', stock_qty: 50, category: 'legumes', commune: 'Allada', description: 'Tomates fraîches', imageFile: 'tomates.jpg' },
  { name: 'Tchayo', price: 900, unit: 'botte', stock_qty: 45, category: 'legumes', commune: 'Ouidah', description: 'Feuilles de tchayo', imageFile: 'tchayo.jpg' },
  { name: 'Poivron', price: 1800, unit: 'kg', stock_qty: 30, category: 'legumes', commune: 'Abomey-Calavi', description: 'Poivron rouge/vert', imageFile: 'poivron.png' },
  { name: 'Piment', price: 1400, unit: 'kg', stock_qty: 35, category: 'legumes', commune: 'Porto-Novo', description: 'Piment frais', imageFile: 'piment.jpg' },
  { name: 'Manioc Feuilles', price: 1000, unit: 'botte', stock_qty: 50, category: 'legumes', commune: 'Djougou', description: 'Feuilles de manioc fra…îches', imageFile: 'manioc.jpg' },
  { name: 'Laitue', price: 1200, unit: 'botte', stock_qty: 40, category: 'legumes', commune: 'Parakou', description: 'Laitue tendre', imageFile: 'laitue.jpg' },
  { name: 'Gombo', price: 1300, unit: 'kg', stock_qty: 45, category: 'legumes', commune: 'Mono', description: 'Gombo frais', imageFile: 'gombo.jpg' },
  { name: 'Gboma', price: 1100, unit: 'botte', stock_qty: 35, category: 'legumes', commune: 'Zagnanado', description: 'Feuilles de gboma', imageFile: 'gboma.png' },
  { name: 'Crin-crin', price: 1250, unit: 'botte', stock_qty: 30, category: 'legumes', commune: 'Cotonou', description: 'Crin-crin vert', imageFile: 'crin-crin.jpg' },
  { name: 'Concombre', price: 1100, unit: 'kg', stock_qty: 40, category: 'legumes', commune: 'Allada', description: 'Concombre frais', imageFile: 'concombre.jpg' },
  { name: 'Chou', price: 1500, unit: 'kg', stock_qty: 35, category: 'legumes', commune: 'Parakou', description: 'Chou blanc/rouge', imageFile: 'chou.webp' },
  { name: 'Carotte', price: 1800, unit: 'kg', stock_qty: 30, category: 'legumes', commune: 'Abomey-Calavi', description: 'Carotte orange', imageFile: 'carotte.jpg' },
  { name: 'Basilic', price: 900, unit: 'botte', stock_qty: 25, category: 'legumes', commune: 'Cotonou', description: 'Basilic frais', imageFile: 'basilic.jpg' },
  { name: 'Baobab', price: 1000, unit: 'botte', stock_qty: 20, category: 'legumes', commune: 'Djougou', description: 'Feuilles de baobab', imageFile: 'baobab.jpg' },
];

// ===== RACINES & HUILES =====
// Souchet, Oignon, Huile rouge, Huile d\'arachide, Gingembre, Curcuma, Coco, Beurre de Karité, Ail
const racinesHuiles = [
  { name: 'Souchet', price: 2500, unit: 'kg', stock_qty: 20, category: 'racineshuile', commune: 'Parakou', description: 'Tubercule de souchet', imageFile: 'souchet.webp' },
  { name: 'Oignon', price: 1600, unit: 'kg', stock_qty: 45, category: 'racineshuile', commune: 'Kandi', description: 'Oignon frais', imageFile: 'oignon.png' },
  { name: 'Huile Rouge', price: 5000, unit: 'litre', stock_qty: 15, category: 'racineshuile', commune: 'Cotonou', description: 'Huile de palme pure', imageFile: 'huileRouge.jpg' },
  { name: 'Huile d\'Arachide', price: 4500, unit: 'litre', stock_qty: 20, category: 'racineshuile', commune: 'Abomey', description: 'Huile d\'arachide pressée', imageFile: 'huileArachide.webp' },
  { name: 'Gingembre', price: 3000, unit: 'kg', stock_qty: 25, category: 'racineshuile', commune: 'Ouémé', description: 'Gingembre frais', imageFile: 'gingembre.webp' },
  { name: 'Curcuma', price: 4000, unit: 'kg', stock_qty: 18, category: 'racineshuile', commune: 'Mono', description: 'Curcuma sec', imageFile: 'curcuma.webp' },
  { name: 'Coco', price: 2000, unit: 'kg', stock_qty: 30, category: 'racineshuile', commune: 'Ouidah', description: 'Noix de coco', imageFile: 'coco.jpg' },
  { name: 'Beurre de Karité', price: 6000, unit: 'kg', stock_qty: 12, category: 'racineshuile', commune: 'Dikoa', description: 'Beurre de karité pur', imageFile: 'BeurreKarite.webp' },
  { name: 'Ail', price: 3500, unit: 'kg', stock_qty: 22, category: 'racineshuile', commune: 'Parakou', description: 'Ail frais', imageFile: 'ail.webp' },
];

// ===== AUTRES (Légumineuses & Fruits) =====
// Haricot, Crevettes, Banane Plantain, Banane, Ananas, Papaye, Noix de Cajou, Lentille locale, Poivre, Piment Sec, Sel
const autres = [
  { name: 'Haricot', price: 2800, unit: 'kg', stock_qty: 35, category: 'autre', commune: 'Abomey-Calavi', description: 'Haricot sec', imageFile: 'haricot.jpg' },
  { name: 'Crevettes', price: 8000, unit: 'kg', stock_qty: 10, category: 'autre', commune: 'Sô-Ava', description: 'Crevettes séchées', imageFile: 'crevettes.webp' },
  { name: 'Banane Plantain', price: 2000, unit: 'kg', stock_qty: 40, category: 'autre', commune: 'Ouidah', description: 'Banane plantain mûre', imageFile: 'bananePlantain.jpg' },
  { name: 'Banane', price: 1800, unit: 'kg', stock_qty: 45, category: 'autre', commune: 'Zagnanado', description: 'Banane douce', imageFile: 'banane.jpg' },
  { name: 'Ananas', price: 1500, unit: 'unite', stock_qty: 50, category: 'autre', commune: 'Allada', description: 'Ananas sucré', imageFile: 'ananas.webp' },
  { name: 'Papaye', price: 1200, unit: 'unite', stock_qty: 40, category: 'autre', commune: 'Ouidah', description: 'Papaye fraîche', imageFile: 'papaye.webp' },
  { name: 'Noix de Cajou', price: 7000, unit: 'kg', stock_qty: 15, category: 'autre', commune: 'Parakou', description: 'Noix de cajou décortiquée', imageFile: 'noixCajou.jpg' },
  { name: 'Lentille Locale', price: 3200, unit: 'kg', stock_qty: 25, category: 'autre', commune: 'Kandi', description: 'Lentille locale séchée', imageFile: 'lentilleLocale.jpg' },
  { name: 'Poivre', price: 5000, unit: 'kg', stock_qty: 12, category: 'autre', commune: 'Adjohoun', description: 'Poivre moulu', imageFile: 'poivre.jpg' },
  { name: 'Piment Sec', price: 4500, unit: 'kg', stock_qty: 18, category: 'autre', commune: 'Porto-Novo', description: 'Piment sec moulu', imageFile: 'pimentSeche.jpg' },
  { name: 'Sel', price: 800, unit: 'kg', stock_qty: 100, category: 'autre', commune: 'Sô-Ava', description: 'Sel marin pur', imageFile: 'sel.jpg' },
];

const produits = [
  ...tubercules,
  ...cereales,
  ...oleagineux,
  ...legumes,
  ...racinesHuiles,
  ...autres
];

// Mapper les fichiers aux catégories (avec structure dossier double)
const imageCategoryMap = {
  // Tubercules
  'igname.png': 'Tubercules',
  'taro.jpg': 'Tubercules',
  'pommeTerre.jpg': 'Tubercules',
  'patate_douce.jpg': 'Tubercules',
  'manioc.jpg': 'Tubercules',
  
  // Céréales
  'fonio.jpg': 'Céréales',
  'maïs_blanc.jpg': 'Céréales',
  'maïs_jaune.jpg': 'Céréales',
  'mil.webp': 'Céréales',
  'soja.jpg': 'Céréales',
  'riz.jpg': 'Céréales',
  'sorgho.webp': 'Céréales',
  
  // Oléagineux
  'palmier.jpg': 'Oléagineux',
  'Nere.jpg': 'Oléagineux',
  'arachide.jpg': 'Oléagineux',
  
  // Légumes
  'amarante.jpg': 'Légumes',
  'vernonia.jpg': 'Légumes',
  'tomates.jpg': 'Légumes',
  'tchayo.jpg': 'Légumes',
  'poivron.png': 'Légumes',
  'piment.jpg': 'Légumes',
  'laitue.jpg': 'Légumes',
  'gombo.jpg': 'Légumes',
  'gboma.png': 'Légumes',
  'crin-crin.jpg': 'Légumes',
  'concombre.jpg': 'Légumes',
  'chou.webp': 'Légumes',
  'carotte.jpg': 'Légumes',
  'basilic.jpg': 'Légumes',
  'baobab.jpg': 'Légumes',
  
  // Racines_Huiles
  'souchet.webp': 'Racines_Huiles',
  'oignon.png': 'Racines_Huiles',
  'huileRouge.jpg': 'Racines_Huiles',
  'huileArachide.webp': 'Racines_Huiles',
  'gingembre.webp': 'Racines_Huiles',
  'curcuma.webp': 'Racines_Huiles',
  'coco.jpg': 'Racines_Huiles',
  'BeurreKarite.webp': 'Racines_Huiles',
  'ail.webp': 'Racines_Huiles',
  
  // Autres
  'haricot.jpg': 'Autres',
  'crevettes.webp': 'Autres',
  'bananePlantain.jpg': 'Autres',
  'banane.jpg': 'Autres',
  'ananas.webp': 'Autres',
  'papaye.webp': 'Autres',
  'noixCajou.jpg': 'Autres',
  'lentilleLocale.jpg': 'Autres',
  'poivre.jpg': 'Autres',
  'pimentSeche.jpg': 'Autres',
  'sel.jpg': 'Autres'
};

async function uploadImageToCloudinary(imageFile) {
  try {
    const category = imageCategoryMap[imageFile];
    // Structure: frontend/src/assets/images/{Category}/{Category}/{imageFile}
    const frontendPath = path.join(__dirname, `../../../frontend/src/assets/images/${category}/${category}/${imageFile}`);
    
    if (!fs.existsSync(frontendPath)) {
      console.warn(`⚠️ Fichier non trouvé: ${frontendPath}`);
      return null;
    }

    const result = await cloudinary.uploader.upload(frontendPath, {
      public_id: `agromarket/products/${imageFile.replace(/\.[^.]+$/, '')}`,
      overwrite: true
    });

    console.log(`✅ Image uploadée: ${imageFile} (${category})`);
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
