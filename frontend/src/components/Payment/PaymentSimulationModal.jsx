import React, { useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';

const PaymentSimulationModal = ({ 
  amount, 
  orderId, 
  customerName,
  onSuccess,
  onError,
  onClose 
}) => {
  const { showToast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirmPayment = async () => {
    setProcessing(true);
    try {
      // Appel backend pour confirmer le paiement
      const response = await api.post(`/orders/${orderId}/confirm-payment`, {
        payment_method: 'simulation',
        amount: amount
      });

      if (response.data.success) {
        setConfirmed(true);
        showToast('Paiement simulé réussi ✅', 'success');
        
        // Attendre un peu avant de rediriger
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(response.data.data);
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Erreur confirmation paiement:', error);
      showToast('Erreur lors de la confirmation du paiement', 'error');
      if (onError) onError(error);
      setProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-8 shadow-2xl">
        {/* Header avec icône */}
        <div className="text-center mb-6">
          {confirmed ? (
            <div className="flex justify-center mb-4">
              <CheckCircle size={64} className="text-green-600 animate-bounce" />
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <CreditCard size={48} className="text-blue-600" />
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-900">
            {confirmed ? 'Paiement Confirmé! ✅' : 'Confirmation de Paiement'}
          </h2>
        </div>

        {confirmed ? (
          // État succès
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                Votre transaction a été simulée avec succès
              </p>
              <p className="text-green-700 text-sm mt-2">
                Redirection vers votre confirmation...
              </p>
            </div>
            <div className="flex justify-center">
              <Loader className="animate-spin text-green-600" />
            </div>
          </div>
        ) : (
          // État confirmation
          <div className="space-y-6">
            {/* Info alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Mode Simulation MVP</p>
                <p className="mt-1">Ceci simule un paiement réussi pour tester le workflow complet.</p>
              </div>
            </div>

            {/* Détails du paiement */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Montant:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {amount.toLocaleString()} XOF
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Client:</span>
                  <span className="font-semibold text-gray-900">{customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commande #:</span>
                  <span className="font-mono text-sm text-gray-900">{orderId.slice(-6)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelPayment}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Traitement...
                  </>
                ) : (
                  'Confirmer le Paiement'
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Aucun paiement réel ne sera effectué
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSimulationModal;
