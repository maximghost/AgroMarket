import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = ({ onAuthClick }) => {
  const { user, logout, isClient, isProducteur } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold" style={{ color: '#2E7D32' }}>
            AgroMarket
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-medium" style={{ color: '#555555' }}>Accueil</Link>
            <span style={{ color: '#CCCCCC' }}>|</span>
            <Link to="/catalogue" className="font-medium" style={{ color: '#555555' }}>Catalogue</Link>
            <span style={{ color: '#CCCCCC' }}>|</span>
            <Link to="/a-propos" className="font-medium" style={{ color: '#555555' }}>À propos</Link>
          </nav>

          {/* Boutons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/login" className="font-medium" style={{ color: '#555555' }}>
                  Se connecter
                </Link>
                <Link 
                  to="/register"
                  className="px-5 py-2 rounded-full font-medium text-white"
                  style={{ backgroundColor: '#F39C12' }}
                >
                  Inscription
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-600">
                  Bienvenue, {user.full_name || user.email}
                </span>
                
                {/* Panier */}
                <Link 
                  to="/cart" 
                  className="relative p-2 text-gray-700 hover:text-green-700 transition"
                >
                  <ShoppingCart size={24} />
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {isProducteur && (
                  <Link to="/producteur/dashboard" className="text-sm font-medium text-green-700 hover:underline">
                    Mon Espace
                  </Link>
                )}
                <button 
                  onClick={handleLogoutClick}
                  className="px-5 py-2 rounded-full font-medium text-white bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={24} className="text-orange-600" />
                <h3 className="text-lg font-bold text-gray-800">Confirmation de déconnexion</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir vous déconnecter? Vous devrez vous reconnecter pour accéder à votre panier.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;