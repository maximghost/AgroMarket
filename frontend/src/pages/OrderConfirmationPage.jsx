import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import api from '../services/api';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.data);
      } catch (error) {
        showToast('Erreur lors du chargement de la commande', 'error');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return <div className="text-center py-20">Chargement...</div>;
  }

  const getPaymentStatusMessage = () => {
    if (!order.payment_info) return null;
    
    if (order.payment_info.status === 'completed') {
      return '✅ Paiement confirmé';
    } else if (order.payment_info.status === 'pending') {
      return '⏳ Paiement en attente de confirmation';
    } else {
      return '❌ Paiement échoué';
    }
  };

  const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle size={80} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-green-700 mb-2">Commande Confirmée! ✅</h1>
          <p className="text-gray-600 text-lg">Merci pour votre achat</p>
        </div>

        {/* Détails Commande */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Infos Commande */}
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b">
            <div>
              <p className="text-gray-500 text-sm">Numéro de commande</p>
              <p className="text-2xl font-bold text-gray-900">{order.order_number || order._id.slice(-6)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Méthode de paiement</p>
              <p className="text-lg font-semibold text-gray-900">
                {order.payment_method === 'kkiapay' ? 'KKiaPay' : 'Paiement à la livraison'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Statut de paiement</p>
              <p className="text-lg font-semibold text-orange-600">{getPaymentStatusMessage()}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Articles commandés</h2>
            <div className="space-y-4">
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{(item.subtotal || item.price_at_order * item.qty).toLocaleString()} XOF</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totaux */}
          <div className="space-y-3 mb-8 pb-8 border-b">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString()} XOF</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frais de livraison</span>
              <span>À confirmer</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900">
              <span>Total payé</span>
              <span className="text-green-600">{order.total_amount.toLocaleString()} XOF</span>
            </div>
          </div>

          {/* Adresse */}
          {order.delivery_address && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Adresse de livraison</h3>
              <p className="text-gray-600">
                {order.delivery_address.full_name || user?.full_name}
              </p>
              <p className="text-gray-600">{order.delivery_address.commune}</p>
              <p className="text-gray-600">{order.delivery_address.quartier}</p>
              <p className="text-gray-600">{order.delivery_address.phone}</p>
              {order.delivery_address.indications && (
                <p className="text-gray-500 text-sm mt-2 italic">{order.delivery_address.indications}</p>
              )}
            </div>
          )}
        </div>

        {/* Messages Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <p className="text-green-900 font-semibold mb-2">📧 Confirmation envoyée!</p>
          <p className="text-green-800">Un email de confirmation a été envoyé à {user?.email}</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <p className="text-yellow-900 font-semibold mb-2">⏳ Prochaine étape</p>
          <p className="text-yellow-800">Le producteur confirmera votre commande dans les 24h</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/catalogue"
            className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 text-center transition"
          >
            Continuer les achats
          </Link>
          <Link
            to="/mes-commandes"
            className="bg-gray-200 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 text-center transition flex items-center justify-center gap-2"
          >
            Voir mes commandes <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
