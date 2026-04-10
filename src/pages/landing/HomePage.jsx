import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Layout/Header';
import AuthModal from '../../components/Auth/AuthModal';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  // Fetch produits en vedette (conforme au Google Doc)
  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/products?limit=6')
      .then(res => {
        if (res.data.success) {
          setFeaturedProducts(res.data.data.products || []);
        }
      })
      .catch(() => {
        // Données de démo (pour que ça marche même sans backend)
        setFeaturedProducts([
          { _id: 1, name: "Attiéké frais", commune: "Abomey-Calavi", price: 1500, unit: "kg", images: ["https://via.placeholder.com/300x200/10b981/fff?text=Attiéké"] },
          { _id: 2, name: "Gari jaune", commune: "Porto-Novo", price: 1200, unit: "kg", images: ["https://via.placeholder.com/300x200/f59e0b/fff?text=Gari"] },
          { _id: 3, name: "Huile rouge", commune: "Ouidah", price: 2500, unit: "L", images: ["https://via.placeholder.com/300x200/10b981/fff?text=Huile+Rouge"] },
          { _id: 4, name: "Farine de manioc", commune: "Cotonou", price: 1800, unit: "kg", images: ["https://via.placeholder.com/300x200/10b981/fff?text=Farine"] },
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header onAuthClick={(mode) => setAuthModal({ isOpen: true, mode })} />

      {/* HERO - exactement comme ta maquette */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              Des Produits<br />
              Agricoles Locaux,<br />
              <span className="text-[#f59e0b]">Qualité Garantie</span> à Votre Table
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              Découvrez les meilleures saveurs d’Afrique de l’Ouest. Soutenez les agriculteurs locaux tout en profitant de produits frais, authentiques et entièrement traçables.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/catalogue" className="px-8 py-4 bg-green-700 text-white rounded-3xl font-semibold text-lg hover:bg-green-800 transition">
                Explorer les Produits
              </Link>
              <button 
                onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                className="px-8 py-4 border-2 border-green-700 text-green-700 rounded-3xl font-semibold text-lg hover:bg-green-700 hover:text-white transition"
              >
                Créer un Produit
              </button>
            </div>
          </div>

          {/* Images du hero (comme sur ta capture) */}
          <div className="grid grid-cols-2 gap-4">
            <img src="https://via.placeholder.com/400x300/10b981/fff?text=Produits+Frais" alt="Produits frais" className="rounded-3xl shadow-xl" />
            <div className="space-y-4">
              <img src="https://via.placeholder.com/400x140/f59e0b/fff?text=Épices" alt="Épices" className="rounded-3xl shadow-xl" />
              <img src="https://via.placeholder.com/400x140/10b981/fff?text=Graines" alt="Graines" className="rounded-3xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI CHOISIR AGROMARKET ? */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Choisir AgroMarket ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur p-8 rounded-3xl text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="font-semibold text-xl mb-2">Traçabilité Complète</h3>
              <p className="text-blue-100">Suivez le parcours exact de chaque produit, de la semence à votre table.</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-8 rounded-3xl text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="font-semibold text-xl mb-2">Origine Vérifiée</h3>
              <p className="text-blue-100">Tous nos producteurs partenaires sont rigoureusement audités.</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-8 rounded-3xl text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="font-semibold text-xl mb-2">Livraison Rapide</h3>
              <p className="text-blue-100">Un réseau logistique optimisé pour vous livrer des produits d’une fraîcheur absolue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE ? */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça Marche ?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow flex items-center justify-center text-4xl mb-4">🔍</div>
              <h4 className="font-semibold mb-2">1. Parcourez</h4>
              <p className="text-gray-500">Explorez notre vaste catalogue de produits locaux et découvrez leurs origines.</p>
            </div>
            <div>
              <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow flex items-center justify-center text-4xl mb-4">🛒</div>
              <h4 className="font-semibold mb-2">2. Commandez</h4>
              <p className="text-gray-500">Ajoutez vos produits préférés au panier et payez en toute sécurité.</p>
            </div>
            <div>
              <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow flex items-center justify-center text-4xl mb-4">📦</div>
              <h4 className="font-semibold mb-2">3. Recevez</h4>
              <p className="text-gray-500">Profitez d’une livraison rapide à votre porte et savourez la fraîcheur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUITS EN VEDETTE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Produits en Vedette</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {featuredProducts.map(product => (
              <div key={product._id} className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition">
                <img 
                  src={product.images?.[0] || "https://via.placeholder.com/300x200/10b981/fff?text=Produit"} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs text-gray-500">{product.commune}</p>
                  <h4 className="font-semibold text-lg">{product.name}</h4>
                  <p className="text-[#f59e0b] font-bold">{product.price} FCFA / {product.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER simple */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-3xl">🌱</span>
            <span className="text-2xl font-bold">AgroMarket</span>
          </div>
          <p className="text-sm opacity-70">© 2026 TP E-commerce Mets Locaux - Tous droits réservés</p>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })} 
        initialMode={authModal.mode} 
      />
    </div>
  );
};

export default HomePage;