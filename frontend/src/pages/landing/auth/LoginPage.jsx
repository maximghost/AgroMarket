import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, user, error: authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Si déjà connecté, rediriger vers le catalogue
  useEffect(() => {
    if (user) {
      navigate('/catalogue');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Effacer l'erreur quand l'utilisateur modifie
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Email et mot de passe requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // La redirection se fera via useEffect ci-dessus
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700">AgroMarket</h2>
          <p className="mt-2 text-gray-600">Heureux de vous revoir !</p>
        </div>

        {/* Message d'erreur */}
        {(error || authError) && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm">{error || authError}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-100"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">Oublié ?</Link>
              </div>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-100"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Bouton Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transform active:scale-95 transition-all shadow-md"
          >
            {loading ? '⏳ Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Lien S'inscrire */}
        <p className="text-center text-sm text-gray-600">
          Pas encore de compte ? <Link to="/register" className="text-green-600 font-bold hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;