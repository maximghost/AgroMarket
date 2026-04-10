
import Catalogue from './pages/Catalogue'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutProducteur from './layouts/LayoutProducteur';
import DashboardProducteur from './pages/producteur/DashboardProducteur';
import MesProduits from './pages/producteur/MesProduits';
import AjouterProduit from './pages/producteur/AjouterProduit';
import ModifierProduit from './pages/producteur/ModifierProduit';
import CommandesReçues from './pages/producteur/CommandesReçues';
import DetailCommande from './pages/producteur/DetailCommande';

function Accueil() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <nav className="p-4 text-white bg-green-700 shadow-lg">
        <h1 className="text-3xl font-bold">🌾 AgroMarket</h1>
        <p className="text-green-100">Plateforme de mets locaux</p>
      </nav>
      <main className="px-4 py-8 mx-auto max-w-7xl">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Bienvenue</h2>
          <p className="mb-4 text-gray-600">Espace producteur</p>
          <a href="/producteur/dashboard" className="inline-block px-6 py-2 text-white bg-green-700 rounded-lg hover:bg-green-800">
            Accéder à mon espace →
          </a>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/" element={<Catalogue />} />
        <Route path="/producteur" element={<LayoutProducteur />}>
          <Route index element={<DashboardProducteur />} />
          <Route path="dashboard" element={<DashboardProducteur />} />
          <Route path="produits" element={<MesProduits />} />
          <Route path="produits/ajouter" element={<AjouterProduit />} />
          <Route path="produits/modifier/:id" element={<ModifierProduit />} />
          <Route path="commandes" element={<CommandesReçues />} />
          <Route path="commandes/:id" element={<DetailCommande />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

