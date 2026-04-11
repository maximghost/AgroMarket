import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { 
  CheckCircle, 
  MapPin, 
  Package, 
  Clock, 
  Truck,
  CreditCard,
  Home,
  ChevronRight
} from 'lucide-react';
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-600 text-lg">Commande non trouvée</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    const statuses = {
      pending: { icon: Clock, label: 'À confirmer', color: 'text-yellow-600', bg: 'bg-yellow-50' },
      confirmed: { icon: CheckCircle, label: 'Confirmée', color: 'text-green-600', bg: 'bg-green-50' },
      shipped: { icon: Truck, label: 'En cours', color: 'text-blue-600', bg: 'bg-blue-50' },
      delivered: { icon: Home, label: 'Livrée', color: 'text-green-600', bg: 'bg-green-50' },
      cancelled: { icon: Package, label: 'Annulée', color: 'text-red-600', bg: 'bg-red-50' }
    };
    return statuses[order.status] || statuses.pending;
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const subtotal = order.items.reduce((sum, item) => sum + (item.subtotal || item.price_at_order * item.qty), 0);
  const orderNumber = order.order_number || `#${order._id.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
      {/* Success Banner */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
              <CheckCircle size={64} className="text-green-600 relative" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Commande confirmée!
          </h1>
          <p className="text-gray-600 text-lg">
            {orderNumber} • {new Date(order.created_at).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Timeline de statut */}
        <div className="mb-12">
          <div className="grid grid-cols-4 gap-0">
            {[
              { step: 1, label: 'Payée', active: order.payment_status === 'paid' },
              { step: 2, label: 'Confirmée', active: ['confirmed', 'shipped', 'delivered'].includes(order.status) },
              { step: 3, label: 'En route', active: ['shipped', 'delivered'].includes(order.status) },
              { step: 4, label: 'Livrée', active: order.status === 'delivered' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 ${
                  item.active 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {item.active ? '✓' : item.step}
                </div>
                <p className="text-xs font-medium text-gray-600 text-center">{item.label}</p>
                {idx < 3 && (
                  <div className={`absolute top-5 left-[55%] w-[90%] h-0.5 ${
                    item.active ? 'bg-green-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="md:col-span-2 space-y-6">
            {/* Articles */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Package size={20} className="text-gray-600" />
                <h2 className="font-semibold text-gray-900">Articles commandés</h2>
              </div>
              <div className="divide-y">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.qty} × {item.price_at_order.toLocaleString()} XOF
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 ml-4">
                      {(item.subtotal || item.price_at_order * item.qty).toLocaleString()} XOF
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Informations de livraison */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <MapPin size={20} className="text-gray-600" />
                <h2 className="font-semibold text-gray-900">Livraison</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Destinataire</p>
                  <p className="text-gray-900 font-medium">
                    {order.delivery_address?.full_name || user?.full_name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {order.delivery_address?.phone || user?.phone}
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Adresse</p>
                  <p className="text-gray-900">
                    {order.delivery_address?.commune}
                    {order.delivery_address?.quartier && ` • ${order.delivery_address.quartier}`}
                  </p>
                  {order.delivery_address?.indications && (
                    <p className="text-sm text-gray-600 mt-2 italic">{order.delivery_address.indications}</p>
                  )}
                </div>
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Type</p>
                  <p className="text-gray-900">
                    {order.delivery_type === 'standard' ? 'Livraison standard' : 'Retrait sur place'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="md:col-span-1 space-y-6">
            {/* Résumé de paiement */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-4">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <CreditCard size={20} className="text-gray-600" />
                <h2 className="font-semibold text-gray-900">Résumé</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-900 font-medium">{subtotal.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="text-gray-900 font-medium">À confirmer</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-green-600">{order.total_amount.toLocaleString()} XOF</span>
                </div>
              </div>
            </div>

            {/* Statut de paiement */}
            <div className={`rounded-lg border p-4 ${statusInfo.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon size={18} className={statusInfo.color} />
                <span className={`font-semibold text-sm ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {order.status === 'pending' && "En attente de confirmation du producteur"}
                {order.status === 'confirmed' && "Votre commande est confirmée"}
                {order.status === 'shipped' && "Votre commande est en route"}
                {order.status === 'delivered' && "Commande livrée"}
              </p>
            </div>

            {/* Info email */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <p className="text-sm text-blue-900">
                <strong>Email de confirmation</strong> envoyé à <break />{user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/mes-commandes"
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            Voir mes commandes
            <ChevronRight size={18} />
          </Link>
          <Link
            to="/catalogue"
            className="px-8 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
