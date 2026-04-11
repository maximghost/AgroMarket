import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Appel API pour l'activation (ex: /api/auth/activate/:token)
    setTimeout(() => setStatus('success'), 2000);
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl text-center">
        {status === 'loading' ? (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 text-green-600 animate-spin" />
            <h2 className="text-xl font-bold">Vérification en cours...</h2>
          </div>
        ) : (
          <div className="space-y-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Email validé !</h2>
            <p className="text-gray-600">Votre compte AgroMarket est maintenant actif.</p>
            <Link to="/login" className="block w-full py-3 bg-green-600 text-white rounded-xl font-bold">
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
