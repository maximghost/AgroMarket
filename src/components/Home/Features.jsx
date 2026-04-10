import React from 'react';

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Pourquoi Choisir AgroMarket ?</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">Nous redéfinissons la chaîne d'approvisionnement agricole pour vous offrir le meilleur, en toute transparence.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-green-700 text-2xl">🔍</span></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Traçabilité Complète</h3>
            <p className="text-gray-600">Suivez le parcours exact de chaque produit, de la semence à votre table. Découvrez l'histoire de l'agriculteur dernière votre nourriture.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-green-700 text-2xl">✅</span></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Origine Vérifiée</h3>
            <p className="text-gray-600">Tous nos producteurs partenaires sont rigoureusement audités. Nous garantissons l'authenticité et la qualité de chaque récolte.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-green-700 text-2xl">🚚</span></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Livraison Rapide</h3>
            <p className="text-gray-600">Un réseau logistique optimisé pour vous livrer des produits d'une fraîcheur absolue, directement depuis les champs jusqu'à votre porte.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;