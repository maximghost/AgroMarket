import { useCallback } from 'react';
import { useToast } from './useToast';
import { openKkiapayWidget } from '../services/kkiapayService';

export const useKkiapay = () => {
  const { showToast } = useToast();

  /**
   * Initier le paiement KKiaPay
   * @param {Object} paymentData - Données de paiement
   */
  const initiatePayment = useCallback(
    async ({ amount, phone, name, orderId }) => {
      // Valider les données
      if (!amount || !phone || !name || !orderId) {
        showToast('Données de paiement incomplètes', 'error');
        return false;
      }

      try {
        const success = await openKkiapayWidget({
          amount,
          phone,
          name,
          orderId,
          onSuccess: (response) => {
            console.log('✅ Paiement réussi:', response);
            showToast('Paiement réussi! Redirection...', 'success', 3000);
          },
          onError: (error) => {
            console.error('❌ Erreur paiement:', error);
            showToast('Erreur lors du paiement', 'error');
          },
          onClose: () => {
            console.log('Paiement annulé');
            showToast('Paiement annulé', 'info');
          },
        });
        return success;
      } catch (error) {
        console.error('❌ Erreur paiement:', error);
        showToast('Erreur lors du paiement', 'error');
        return false;
      }
    },
    [showToast]
  );

  return {
    initiatePayment,
  };
};
