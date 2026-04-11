import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const produits = [
  // Accompagnements/Légumes
  { name: 'Ablo', price: 1500, unit: 'sachet', stock_qty: 50, category: 'legumes', commune: 'Comè', description: 'Ablo traditionnel', images: ['ablo.jpg'] },
  { name: 'Aloco', price: 1500, unit: 'sachet', stock_qty: 50, category: 'tubercules', commune: 'Cotonou', description: 'Banane frite', images: ['aloko.jpg'] },
  { name: 'Beignets', price: 1500, unit: 'sachet', stock_qty: 40, category: 'legumes', commune: 'Abomey-Calavi', description: 'Beignets frits', images: ['beignets.jpeg'] },
  { name: 'Kléklé', price: 1500, unit: 'sachet', stock_qty: 45, category: 'legumes', commune: 'Porto-Novo', description: 'Galette croustillante', images: ['klekle.jpg'] },
  { name: 'Toubani', price: 1500, unit: 'sachet', stock_qty: 35, category: 'legumes', commune: 'Djougou', description: 'Mets traditionnel vapeur', images: ['toubani.jpg'] },
  // Boissons
  { name: 'Adoyo', price: 1500, unit: 'litre', stock_qty: 60, category: 'autre', commune: 'Porto-Novo', description: 'Boisson fermentée', images: ['adoyo.webp'] },
  { name: 'Atan', price: 1500, unit: 'litre', stock_qty: 30, category: 'autre', commune: 'Ouémé', description: 'Vin de palme frais', images: ['atan.jpg'] },
  { name: 'Bissap', price: 1500, unit: 'litre', stock_qty: 50, category: 'autre', commune: 'Cotonou', description: 'Boisson hibiscus', images: ['bissap.jpg'] },
  { name: 'Sodabi', price: 1500, unit: 'litre', stock_qty: 25, category: 'autre', commune: 'Cotonou', description: 'Alcool distillé', images: ['sodabi.jpg'] },
  { name: 'Jus de tamarin', price: 1500, unit: 'litre', stock_qty: 40, category: 'autre', commune: 'Port-Novo', description: 'Jus acidulé', images: ['tamarin.jpg'] },
  { name: 'Tchakpalo', price: 1500, unit: 'litre', stock_qty: 35, category: 'autre', commune: 'Djougou', description: 'Bière traditionnelle', images: ['tchakpalo.jpg'] },
  { name: 'Tchoukoutou', price: 1500, unit: 'litre', stock_qty: 35, category: 'autre', commune: 'Natitingou', description: 'Bière artisanale', images: ['tchoukoutou.jpg'] },
  // Bouillies/Céréales
  { name: 'Aklui', price: 1500, unit: 'sachet', stock_qty: 45, category: 'cereales', commune: 'Au Sud', description: 'Bouillie fermentée maïs', images: ['aklui.jpg'] },
  { name: 'Bouillie de Gari', price: 1500, unit: 'sachet', stock_qty: 50, category: 'cereales', commune: 'Allada', description: 'Gari bouilli', images: ['gari.jpg'] },
  { name: 'Bouillie de mil', price: 1500, unit: 'sachet', stock_qty: 50, category: 'cereales', commune: 'Zones urbaines', description: 'Bouillie de mil', images: ['mil.jpg'] },
  { name: 'Bouillie de soja', price: 1500, unit: 'sachet', stock_qty: 45, category: 'oleagineux', commune: 'Abomey-Calavi', description: 'Bouillie de soja', images: ['soja.jpg'] },
  // Grillades
  { name: 'Viande d\'agouti', price: 1500, unit: 'kg', stock_qty: 25, category: 'autre', commune: 'Sô-Ava', description: 'Viande grillée', images: ['agouti.jpeg'] },
  { name: 'Brochettes de viande', price: 1500, unit: 'kg', stock_qty: 40, category: 'autre', commune: 'Djougou', description: 'Viande grillée', images: ['brochettes.jpg'] },
  { name: 'Brochettes d\'escargot', price: 1500, unit: 'kg', stock_qty: 30, category: 'autre', commune: 'Abomey-Calavi', description: 'Escargots grillés', images: ['escargot.jpg'] },
  { name: 'Wagashi', price: 1500, unit: 'kg', stock_qty: 35, category: 'autre', commune: 'Parakou', description: 'Fromage grillé', images: ['fromage.jpg'] },
  { name: 'Hanlan', price: 1500, unit: 'kg', stock_qty: 40, category: 'autre', commune: 'Porto-Novo', description: 'Viande de porc grillée', images: ['hanlan.jpg'] },
  { name: 'Méchoui local', price: 1500, unit: 'kg', stock_qty: 20, category: 'autre', commune: 'Djougou', description: 'Agneau rôti', images: ['mechoui.jpg'] },
];

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
        commune: 'Cotonou',
        is_active: true
      });
      console.log('✅ Producteur créé:', producer._id);
    } else {
      console.log('✅ Producteur existant trouvé:', producer._id);
    }

    const producerId = producer._id;

    // Vider les produits existants
    await Product.deleteMany({});
    console.log('🗑️ Produits existants supprimés');

    // Ajouter producer_id à chaque produit et insérer
    const produitsAvecProducer = produits.map(p => ({
      ...p,
      producer_id: producerId,
      is_available: true
    }));

    const insertedProducts = await Product.insertMany(produitsAvecProducer);
    console.log(`✅ ${insertedProducts.length} produits créés avec succès!`);

    // Afficher les ObjectIds
    console.log('\n📦 Produits créés avec leurs ObjectIds:');
    insertedProducts.forEach((product) => {
      console.log(`- ${product.name}: ${product._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seed:', error);
    process.exit(1);
  }
}

seedProducts();
