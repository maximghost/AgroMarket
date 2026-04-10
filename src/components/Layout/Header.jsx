import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onAuthClick }) => {
  const { user, logout } = useAuth();

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
            <Link to="/tracabilite" className="font-medium" style={{ color: '#555555' }}>Traçabilité</Link>
            <span style={{ color: '#CCCCCC' }}>|</span>
            <Link to="/a-propos" className="font-medium" style={{ color: '#555555' }}>À propos</Link>
          </nav>

          {/* Boutons */}
          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <button onClick={() => onAuthClick('login')} className="font-medium" style={{ color: '#555555' }}>
                  Se connecter
                </button>
                <button 
                  onClick={() => onAuthClick('register')} 
                  className="px-5 py-2 rounded-full font-medium text-white"
                  style={{ backgroundColor: '#F39C12' }}
                >
                  Inscription
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;