import React from 'react';

const HeroSection = ({ onAuthClick }) => {
  return (
    <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Des Produits Agricoles Locaux,<br />
          <span className="text-green-700">Qualité Garantie à Votre Table</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
          Découvrez les meilleures œuvres d'Afrique de l'Ouest. Soutenez les agriculteurs locaux tout en profitant de produits frais, authentiques et entièrement traçables.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/catalogue" className="bg-green-700 text-white px-8 py-3 rounded-full font-medium hover:bg-green-800">Explorer nos Produits</a>
          <button onClick={() => onAuthClick('register')} className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-medium hover:bg-green-700 hover:text-white">Créer un Produit</button>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;