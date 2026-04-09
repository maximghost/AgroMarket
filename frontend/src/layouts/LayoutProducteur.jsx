import { Outlet, Link } from 'react-router-dom';

const LayoutProducteur = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold text-green-600 mb-6 px-2">AGROMARKET</h2>
        
        <nav className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Menu</p>
          
          <Link to="/producteur/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
            <span>📊</span> Dashboard Producteur
          </Link>
          
          <Link to="/producteur/produits" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
            <span>📦</span> Mes Produits
          </Link>
          
          <Link to="/producteur/ajouter" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
            <span>➕</span> Ajouter Produit
          </Link>
          
          <Link to="/producteur/modifier" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
            <span>🔄</span> Modifier Produit
          </Link>
          
          <Link to="/producteur/commandes" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
            <span>🛒</span> Commandes reçues
          </Link>
          
          <Link to="/producteur/detail" className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
            <span>📋</span> Détail Commande
          </Link>
          
        </nav>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Marketplaces</p>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutProducteur;