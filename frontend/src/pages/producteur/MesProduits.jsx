import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MesProduits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulation de chargement des produits (à remplacer par API)
  useEffect(() => {
    setTimeout(() => {
      setProduits([
        {
          id: 1,
          nom: 'Tomates bio',
          prix: 3.50,
          stock: 12,
          unite: 'kg',
          image: '🍅',
          lot: 'A1-2405',
          origine: 'France',
          statut: 'actif'
        },
        {
          id: 2,
          nom: 'Courgettes',
          prix: 2.80,
          stock: 5,
          unite: 'kg',
          image: '🥒',
          lot: 'B2-2406',
          origine: 'France',
          statut: 'actif'
        },
        {
          id: 3,
          nom: 'Miel de printemps',
          prix: 12.00,
          stock: 0,
          unite: 'pot',
          image: '🍯',
          lot: 'C3-2407',
          origine: 'Local',
          statut: 'rupture'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSupprimer = (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      setProduits(produits.filter(p => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes produits</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez votre catalogue</p>
        </div>
        <Link
          to="/producteur/produits/ajouter"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>+</span> Ajouter un produit
        </Link>
      </div>

      {/* Grille des produits */}
      {produits.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">Vous n'avez pas encore de produits</p>
          <Link to="/producteur/produits/ajouter" className="text-green-600 hover:underline">
            Ajouter votre premier produit →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produits.map((produit) => (
            <div key={produit.id} className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden hover:shadow-md transition">
              {/* Image / icône */}
              <div className="h-32 bg-gray-100 flex items-center justify-center text-5xl">
                {produit.image}
              </div>
              
              {/* Infos produit */}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-800">{produit.nom}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    produit.statut === 'actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {produit.statut === 'actif' ? 'Actif' : 'Rupture'}
                  </span>
                </div>
                
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">{produit.prix} €</span> / {produit.unite}
                </p>
                
                {/* Infos traçabilité */}
                <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                  <p>Lot: {produit.lot}</p>
                  <p>Origine: {produit.origine}</p>
                  <p className={`font-medium ${produit.stock < 10 ? 'text-orange-500' : 'text-gray-600'}`}>
                    Stock: {produit.stock} {produit.unite}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/producteur/produits/modifier/${produit.id}`}
                    className="flex-1 text-center px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleSupprimer(produit.id)}
                    className="flex-1 px-3 py-1.5 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesProduits;