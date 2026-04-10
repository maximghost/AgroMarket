import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données envoyées :", formData);
    
    alert("Compte créé avec succès !");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700">Rejoindre AgroMarket</h2>
          <p className="mt-2 text-gray-600">Créez votre compte en quelques secondes</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom Complet</label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                name="fullName"
                type="text" 
                required 
                value={formData.fullName}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                placeholder="Jean Dupont" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                name="email"
                type="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                placeholder="nom@exemple.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                name="password"
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <div className="flex items-center">
            <input 
              name="acceptTerms"
              type="checkbox" 
              required 
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer" 
            />
            <label className="ml-2 block text-sm text-gray-700">
              J'accepte les <span className="text-green-600 underline cursor-pointer">conditions d'utilisation</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transform active:scale-95 transition-all shadow-md"
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Déjà inscrit ? <Link to="/login" className="text-green-600 font-bold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;