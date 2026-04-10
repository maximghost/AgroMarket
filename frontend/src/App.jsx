
import Catalogue from './pages/Catalogue'
import CartPage from './pages/CartPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import { Routes, Route } from 'react-router-dom';
import LayoutProducteur from './layouts/LayoutProducteur';
import DashboardProducteur from './pages/producteur/DashboardProducteur';
import MesProduits from './pages/producteur/MesProduits';
import AjouterProduit from './pages/producteur/AjouterProduit';
import ModifierProduit from './pages/producteur/ModifierProduit';
import CommandesReçues from './pages/producteur/CommandesReçues';
import DetailCommande from './pages/producteur/DetailCommande';
import HomePage from './pages/landing/HomePage';
import LoginPage from './pages/landing/auth/LoginPage';
import RegisterPage from './pages/landing/auth/RegisterPage';
import ForgotPassword from './pages/landing/auth/ForgotPassword';
import ResetPassword from './pages/landing/auth/ResetPassword';

function App() {
  return (
    <Routes>
      {/* Pages Publiques */}
      <Route path="/" element={<HomePage/>} />
      <Route path="/catalogue" element={<Catalogue />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
      
      {/* Routes Authentification */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* Espace Producteur (à protéger plus tard) */}
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
  );
}

export default App;

