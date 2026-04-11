import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email envoyé à :", email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        
        {/* En-tête avec Logo fictif */}
        <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">
              <span className="text-green-600">AGRO</span>
              <span className="text-orange-500">MARKET</span>
            </h3>         
            <p className="mt-2 text-sm text-gray-600">Récupération de compte</p>
        </div>

        {!isSubmitted ? (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="exemple@domaine.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Envoyer le lien de réinitialisation
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <Link to="/login" className="flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500">
                <ArrowLeft size={16} className="mr-2" /> Retour à la connexion
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-6 animate-fade-in">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Vérifiez vos emails</h3>
            <p className="mt-2 text-sm text-gray-500">
              Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien pour créer un nouveau mot de passe.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="mt-6 text-sm font-medium text-green-600 hover:underline"
            >
              Utiliser une autre adresse
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;