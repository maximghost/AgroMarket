import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register: authRegister, error: authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Min 8 caractères';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Une majuscule requise';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Un chiffre requis';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Effacer l'erreur du champ quand l'utilisateur modifie
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await authRegister({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        role: formData.role
      });

      setSuccessMsg('✅ Compte créé avec succès! Redirection...');
      setTimeout(() => {
        navigate(formData.role === 'producteur' ? '/producteur' : '/catalogue');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 'Erreur lors de l\'inscription';
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700">Rejoindre AgroMarket</h2>
          <p className="mt-2 text-gray-600">Créez votre compte en quelques secondes</p>
        </div>

        {/* Messages d'erreur/succès */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle size={20} />
            <span className="text-sm">{successMsg}</span>
          </div>
        )}

        {(errors.submit || authError) && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm">{errors.submit || authError}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nom Complet */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom Complet *</label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  errors.full_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Jean Dupont"
              />
            </div>
            {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="nom@exemple.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Téléphone (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="+229 90 00 00 00"
              />
            </div>
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Vous êtes ? *</label>
            <div className="mt-1 relative">
              <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
              >
                <option value="client">Client (Acheteur)</option>
                <option value="producteur">Producteur (Vendeur)</option>
              </select>
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
            <p className="text-xs text-gray-500 mt-1">Min 8 caractères, 1 majuscule, 1 chiffre</p>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirmation Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe *</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Conditions */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="h-4 w-4 text-green-600 rounded cursor-pointer border-gray-300"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              J'accepte les <span className="text-green-600 font-semibold cursor-pointer hover:underline">conditions</span>
            </label>
          </div>

          {/* Bouton Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transform active:scale-95 transition-all shadow-md"
          >
            {loading ? '⏳ Création...' : 'Créer mon compte'}
          </button>
        </form>

        {/* Lien Login */}
        <p className="text-center text-sm text-gray-600">
          Déjà inscrit ? <Link to="/login" className="text-green-600 font-bold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;