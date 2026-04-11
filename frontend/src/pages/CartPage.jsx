import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useKkiapay } from "../hooks/useKkiapay";
import PaymentSimulationModal from "../components/Payment/PaymentSimulationModal";
import { Trash2, Plus, Minus, ShoppingCart, AlertCircle, CreditCard } from 'lucide-react';
import api from '../services/api';

const CartPage = () => {
  const { cart, loading, fetchCart, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { initiatePayment } = useKkiapay();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState({}); 
  const [deletingItems, setDeletingItems] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({ show: false, itemId: null, productName: null });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Calculer le sous-total
  const subtotal = cart?.items?.reduce((sum, item) => {
    return sum + (item.product_id?.price || 0) * (item.qty || 0)
  }, 0) || 0

  // Handler pour mettre à jour la quantité (utilise product_id)
  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    try {
      await updateQuantity(productId, newQty);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Handler pour afficher modal de confirmation
  const handleDeleteClick = (productId, productName) => {
    setConfirmDelete({ show: true, itemId: productId, productName });
  };

  // Handler pour confirmer la suppression
  const handleConfirmDelete = async () => {
    const { itemId } = confirmDelete;
    setConfirmDelete({ show: false, itemId: null, productName: null });
    setDeletingItems(prev => ({ ...prev, [itemId]: true }));
    try {
      await removeFromCart(itemId);
      showToast('Article supprimé du panier', 'success');
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeletingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Handler pour initier le paiement via simulation
  const handlePayment = async () => {
    if (!user?.phone || !user?.full_name) {
      showToast('Données profil incomplètes. Veuillez mettre à jour votre profil.', 'error');
      return;
    }

    if (subtotal <= 0) {
      showToast('Panier vide', 'error');
      return;
    }

    setProcessingPayment(true);
    
    try {
      // 1. Créer la commande en backend AVANT le paiement
      const orderResponse = await api.post('/orders', {
        delivery_address: {
          full_name: user.full_name,
          phone: user.phone,
          commune: user.commune || 'À confirmer',
          quartier: '',
          indications: ''
        },
        delivery_type: 'standard',
        payment_method: 'simulation', // Utiliser "simulation" pour MVP
        notes: ''
      });

      const order = orderResponse.data.data;
      console.log('✅ Commande créée:', order._id);
      
      // 2. Afficher la modal de simulation de paiement
      setCurrentOrder(order);
      setShowPaymentModal(true);
      setProcessingPayment(false);

    } catch (error) {
      console.error('Erreur création commande:', error);
      showToast('Erreur lors de la création de la commande', 'error');
      setProcessingPayment(false);
    }
  };

  // Handler pour succès du paiement
  const handlePaymentSuccess = (order) => {
    setShowPaymentModal(false);
    // Rediriger vers la page de confirmation
    navigate(`/order-confirmation/${order._id}`);
  };

  // Handler pour fermeture de la modal
  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    setCurrentOrder(null);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchCart();
    }
  }, [user, fetchCart, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
          <div className="bg-white rounded-lg p-12 text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-6">Votre panier est vide</p>
            <Link
              to="/catalogue"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mon Panier ({cart.items.length} articles)</h1>
          <Link
            to="/catalogue"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            ← Retour au catalogue
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <div key={item._id} className="bg-white p-4 rounded-lg flex gap-4">
                {/* Image */}
                {item.product_id?.images?.[0] && (
                  <img
                    src={item.product_id.images[0]}
                    alt={item.product_id.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}

                {/* Infos */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.product_id?.name}</h3>
                  <p className="text-sm text-gray-600">{item.product_id?.commune}</p>
                  <p className="font-semibold text-green-700 mt-1">
                    {item.product_id?.price} XOF / {item.product_id?.unit}
                  </p>
                </div>

                {/* Quantité */}
                <div className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
                  <button
                    onClick={() => handleUpdateQuantity(item.product_id._id, item.qty - 1)}
                    className="hover:bg-gray-200 p-1 rounded disabled:opacity-50"
                    disabled={item.qty <= 1 || updatingItems[item.product_id._id]}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-semibold">
                    {updatingItems[item.product_id._id] ? '...' : item.qty}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product_id._id, item.qty + 1)}
                    className="hover:bg-gray-200 p-1 rounded disabled:opacity-50"
                    disabled={updatingItems[item.product_id._id]}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Prix total */}
                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    {(item.product_id?.price * item.qty).toLocaleString()} XOF
                  </p>
                </div>

                {/* Supprimer */}
                <button
                  onClick={() => handleDeleteClick(item.product_id._id, item.product_id?.name)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded disabled:opacity-50"
                  disabled={deletingItems[item.product_id._id]}
                >
                  {deletingItems[item.product_id._id] ? '⏳' : <Trash2 size={18} />}
                </button>
              </div>
            ))}
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-bold mb-4">Résumé</h2>

              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toLocaleString()} XOF</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frais de livraison</span>
                  <span>À déterminer</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span className="text-green-700">{subtotal.toLocaleString()} XOF</span>
              </div>

              <button 
                onClick={handlePayment}
                disabled={processingPayment || subtotal <= 0}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed mb-3 flex items-center justify-center gap-2 transition"
              >
                <CreditCard size={20} />
                {processingPayment ? 'Paiement en cours...' : 'Procéder au paiement'}
              </button>

              <Link
                to="/catalogue"
                className="block text-center text-green-600 hover:underline text-sm"
              >
                Continuer les achats
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {confirmDelete.show && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setConfirmDelete({ show: false, itemId: null, productName: null })} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={24} className="text-red-600" />
                <h3 className="text-lg font-bold text-gray-800">Confirmer la suppression</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Voulez-vous vraiment retirer "{confirmDelete.productName}" du panier?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete({ show: false, itemId: null, productName: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de simulation de paiement */}
      {showPaymentModal && currentOrder && (
        <PaymentSimulationModal
          amount={subtotal}
          orderId={currentOrder._id}
          customerName={user?.full_name}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
};

export default CartPage;
