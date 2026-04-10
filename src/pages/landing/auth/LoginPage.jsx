import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700">AgroMarket</h2>
          <p className="mt-2 text-gray-600">Heureux de vous revoir !</p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="email" required className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="votre@email.com" />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <Link to="/forgot-password" size={18} className="text-sm text-green-600 hover:underline">Oublié ?</Link>
              </div>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type={showPassword ? "text" : "password"} required className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Pas encore de compte ? <Link to="/register" className="text-green-600 font-bold hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;