import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
      <nav className="bg-green-700 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold">🌾 AgroMarket</h1>
        <p className="text-green-100">Plateforme de mets locaux</p>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bienvenue</h2>
          <p className="text-gray-600 mb-4">Espace producteur</p>
          <a href="/producteur/dashboard" className="inline-block bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
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
          <Route path="ajouter" element={<AjouterProduit />} />
          <Route path="modifier" element={<ModifierProduit />} />
          <Route path="commandes" element={<CommandesReçues />} />
          <Route path="commandes/:id" element={<DetailCommande />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

