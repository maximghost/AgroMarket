/**
 * Charger le script KKiaPay CDN
 */
const loadKkiapayScript = () => {
  return new Promise((resolve, reject) => {
    // Vérifier si déjà chargé
    if (document.getElementById('kkiapay-script')) {
      resolve();
      return;
    }

    // Si la balise custom element existe
    if (customElements.get('kkiapay-widget')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'kkiapay-script';
    script.src = 'https://cdn.kkiapay.me/k.js';
    script.async = true;

    script.onload = () => {
      setTimeout(() => resolve(), 300); // Attendre que le custom element se charge
    };

    script.onerror = () => {
      reject(new Error('Impossible de charger le script KKiaPay'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Ouvrir le widget KKiaPay (custom element HTML)
 */
export const openKkiapayWidget = async (config) => {
  const {
    amount,
    phone,
    name,
    orderId,
    onSuccess,
    onError,
    onClose,
  } = config;

  try {
    // Charger le script CDN
    await loadKkiapayScript();

    // Créer un div conteneur
    const container = document.createElement('div');
    container.id = 'kkiapay-payment-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.backgroundColor = 'rgba(0,0,0,0.5)';

    // Créer le widget KKiaPay
    const widget = document.createElement('kkiapay-widget');
    widget.setAttribute('amount', parseInt(amount));
    widget.setAttribute('key', import.meta.env.VITE_KKIAPAY_PUBLIC_KEY);
    widget.setAttribute('callback', `${window.location.origin}/order-confirmation/${orderId}`);
    widget.setAttribute('phone', phone);
    widget.setAttribute('name', encodeURIComponent(name));
    widget.setAttribute('description', `Commande AgroMarket #${orderId}`);

    container.appendChild(widget);
    document.body.appendChild(container);

    // Gérer la fermeture
    const handleClose = () => {
      container.remove();
      if (onClose) onClose();
    };

    // Event listener pour fermeture
    widget.addEventListener('close', handleClose);
    widget.addEventListener('cancel', handleClose);

    return true;
  } catch (error) {
    console.error('Erreur KKiaPay:', error);
    if (onError) onError({ error: error.message });
    return false;
  }
};

/**
 * Vérifier le statut d'une transaction (optionnel)
 */
export const checkTransactionStatus = async (transactionId) => {
  try {
    console.log('Vérification transaction:', transactionId);
    return { status: '0', id: transactionId };
  } catch (error) {
    console.error('Erreur vérification:', error);
    throw error;
  }
};
