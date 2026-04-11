import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  ArrowRightCircle 
} from 'lucide-react';

import Header from '../../components/Layout/Header';
import AuthModal from '../../components/Auth/AuthModal';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/products?limit=6')
      .then(res => {
        if (res.data.success) {
          setFeaturedProducts(res.data.data.products || []);
        }
      })
      .catch(() => {
        // Données de démo - Note: utilisez des URLs publiques ou des imports
        setFeaturedProducts([
          { _id: 1, name: "Attiéké frais", commune: "Abomey-Calavi", price: 1500, unit: "kg", images: ["https://thislamicrepublicofmauritania.weebly.com/uploads/2/4/0/3/24031037/8289552_orig.jpg"] },
          { _id: 2, name: "Gari jaune", commune: "Porto-Novo", price: 1200, unit: "kg", images: ["https://www.regionalaccess.net/wp-content/uploads/2021/03/RH335.jpg"] },
          { _id: 3, name: "Huile rouge", commune: "Ouidah", price: 2500, unit: "L", images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400"] },
          { _id: 4, name: "Farine de manioc", commune: "Cotonou", price: 1800, unit: "kg", images: ["https://www.ivoir-market.com/wp-content/uploads/2023/06/Farine-de-manioc.jpeg"] },
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header onAuthClick={(mode) => setAuthModal({ isOpen: true, mode })} />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-green-200 text-green-800 text-sm font-bold mb-4">
              Directement du producteur 🌾
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
              Des Produits Agricoles Locaux,<br />
              <span className="text-orange-500">Qualité Garantie</span> à Votre Table
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg leading-relaxed">
              Découvrez les meilleures saveurs d’Afrique de l’Ouest. Soutenez les agriculteurs locaux tout en profitant de produits frais et authentiques.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/catalogue" className="flex items-center gap-2 px-8 py-4 bg-green-700 text-white rounded-full font-semibold text-lg hover:bg-green-800 transition shadow-lg">
                Explorer les Produits <ChevronRight size={20} />
              </Link>
              <button 
                onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                className="px-8 py-4 border-2 border-green-700 text-green-700 rounded-full font-semibold text-lg hover:bg-green-700 hover:text-white transition"
              >
                Vendre mes Produits
              </button>
            </div>
          </div>

          {/* Correction des images Hero (Utilisez des placeholders si les images locales ne chargent pas) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-200 rounded-3xl h-80 overflow-hidden shadow-xl">
              <img src="/assets/hero-main.jpg" alt="AgroMarket" className="w-full h-full object-cover border-4 border-white" onError={(e) => e.target.src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600"}/>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-200 rounded-3xl h-36 overflow-hidden shadow-xl">
                 <img src="/assets/products-1.jpg" alt="Produits" className="w-full h-full object-cover" onError={(e) => e.target.src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"}/>
              </div>
              <div className="bg-gray-200 rounded-3xl h-40 overflow-hidden shadow-xl">
                <img src="/assets/spices.jpg" alt="Épices" className="w-full h-full object-cover" onError={(e) => e.target.src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400"}/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI CHOISIR (Avec Icônes Lucide) */}
      <section className="py-20 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Pourquoi Choisir AgroMarket ?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Search size={40}/>, title: "Traçabilité Complète", desc: "Suivez le parcours exact de chaque produit depuis la récolte." },
              { icon: <ShieldCheck size={40}/>, title: "Origine Vérifiée", desc: "Tous nos producteurs sont audités et certifiés localement." },
              { icon: <Truck size={40}/>, title: "Livraison Rapide", desc: "Système logistique optimisé pour préserver la fraîcheur." }
            ].map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-lg p-10 rounded-[2.5rem] text-center hover:bg-white/20 transition group">
                <div className="bg-white text-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-2xl mb-3">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16 text-gray-800">Comment ça Marche ?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-green-600 mb-4 flex justify-center"><Search size={48} strokeWidth={1.5}/></div>
              <h4 className="font-bold text-xl mb-2">1. Parcourez</h4>
              <p className="text-gray-500">Explorez notre catalogue et filtrez par commune ou par type de produit.</p>
            </div>
            <div>
              <div className="text-green-600 mb-4 flex justify-center"><ShoppingBag size={48} strokeWidth={1.5}/></div>
              <h4 className="font-bold text-xl mb-2">2. Commandez</h4>
              <p className="text-gray-500">Ajoutez au panier et payez via Mobile Money ou Carte Bancaire.</p>
            </div>
            <div>
              <div className="text-green-600 mb-4 flex justify-center"><ArrowRightCircle size={48} strokeWidth={1.5}/></div>
              <h4 className="font-bold text-xl mb-2">3. Recevez</h4>
              <p className="text-gray-500">Récupérez vos produits frais à domicile ou en point relais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUITS EN VEDETTE */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Produits en Vedette</h2>
            <Link to="/catalogue" className="text-green-700 font-semibold hover:underline flex items-center gap-1">
              Voir tout le catalogue <ChevronRight size={18}/>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <div key={product._id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm">
                    <MapPin size={12} className="text-red-500"/> {product.commune}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h4>
                  <p className="text-orange-600 font-extrabold text-xl">{product.price} <span className="text-sm font-normal">FCFA / {product.unit}</span></p>
                  <button className="mt-4 w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-green-700 hover:text-white transition">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-bold text-green-500 mb-6">AgroMarket</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                La première plateforme dédiée à la valorisation des mets locaux et des produits agricoles d'Afrique de l'Ouest.
              </p>
            </div>
            <div>
              <p className="font-bold text-lg mb-6">Navigation</p>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-orange-400 cursor-pointer transition">Accueil</li>
                <li className="hover:text-orange-400 cursor-pointer transition">Catalogue</li>
                <li className="hover:text-orange-400 cursor-pointer transition">Traçabilité</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-lg mb-6">Producteurs</p>
              <ul className="space-y-4 text-gray-400">
                <li className="hover:text-orange-400 cursor-pointer transition">Devenir Vendeur</li>
                <li className="hover:text-orange-400 cursor-pointer transition">Charte de Qualité</li>
                <li className="hover:text-orange-400 cursor-pointer transition">Aide aux Agriculteurs</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-lg mb-6">Contact</p>
              <p className="text-gray-400 text-sm mb-2">support@agromarket.bj</p>
              <p className="text-gray-400 text-sm">+229 XX XX XX XX</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2026 AgroMarket. Fait avec passion pour le terroir.</p>
            <div className="flex gap-6 text-gray-500 text-sm">
              <span className="hover:text-white cursor-pointer">CGU</span>
              <span className="hover:text-white cursor-pointer">Confidentialité</span>
            </div>
          </div>
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