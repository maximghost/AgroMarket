import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/landing/HomePage';
import LoginPage from './pages/landing/auth/LoginPage';
import RegisterPage from './pages/landing/auth/RegisterPage';
import ForgotPassword from './pages/landing/auth/ForgotPassword';
import ResetPassword from './pages/landing/auth/ResetPassword';

function App() {
  return (
    <Routes>
      {/* Page d'accueil principale */}
      <Route path="/" element={<HomePage />} />

      {/* Pages d'authentification */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Route temporaire pour tester */}
      <Route path="/catalogue" element={<div className="p-10 text-center text-2xl">📦 Page Catalogue - À venir</div>} />
    </Routes>
  );
}

export default App;