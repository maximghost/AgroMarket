import React from 'react';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Comment ça Marche ?</h2>
        <p className="text-center text-gray-600 mb-12">Trois étapes simples pour savourer l'authenticité locale.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center"><div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-white text-2xl font-bold">1</span></div><h3 className="text-xl font-bold text-gray-900 mb-2">Parcourez</h3><p className="text-gray-600">Explorez notre vaste catalogue de produits locaux et découvrez leurs origines.</p></div>
          <div className="text-center"><div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-white text-2xl font-bold">2</span></div><h3 className="text-xl font-bold text-gray-900 mb-2">Commandez</h3><p className="text-gray-600">Ajoutez vos produits préférés au panier et payez en toute sécurité.</p></div>
          <div className="text-center"><div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-white text-2xl font-bold">3</span></div><h3 className="text-xl font-bold text-gray-900 mb-2">Recevez</h3><p className="text-gray-600">Profitez d'une livraison rapide à votre porte et savourez la fraîcheur.</p></div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;