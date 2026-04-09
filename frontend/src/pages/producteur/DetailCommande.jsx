import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DetailCommande = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Simulation de chargement des détails de la commande (à remplacer par API)
  useEffect(() => {
    setTimeout(() => {
      // Simulation d'une commande existante
      const commandeExistante = {
        id: id,
        client: {
          nom: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          telephone: '06 12 34 56 78',
          adresse: '12 rue des Lilas, 75001 Paris'
        },
        produits: [
          { 
            id: 1,
            nom: 'Tomates bio', 
            quantite: 2, 
            prix: 3.50,
            total: 7.00,
            lot: 'A1-2405',
            origine: 'France, Bretagne',
            dateProduction: '2025-03-15'
          }
        ],
        montantTotal: 7.00,
        fraisLivraison: 3.50,
        montantFinal: 10.50,
        date: '2026-04-09T10:30:00',
        statut: 'en_attente',
        modePaiement: 'Carte bancaire',
        note: 'Livraison entre 14h et 17h'
      };
      
      setCommande(commandeExistante);
      setLoading(false);
    }, 500);
  }, [id]);

  const getStatutBadge = (statut) => {
    const styles = {
      en_attente: 'bg-yellow-100 text-yellow-800',
      confirmee: 'bg-blue-100 text-blue-800',
      expediee: 'bg-purple-100 text-purple-800',
      livree: 'bg-green-100 text-green-800',
      rejetee: 'bg-red-100 text-red-800'
    };
    const labels = {
      en_attente: 'En attente',
      confirmee: 'Confirmée',
      expediee: 'Expédiée',
      livree: 'Livrée',
      rejetee: 'Rejetée'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[statut] || styles.en_attente}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  const handleConfirmer = async () => {
    setUpdating(true);
    // Simuler appel API
    setTimeout(() => {
      setCommande({ ...commande, statut: 'confirmee' });
      setUpdating(false);
    }, 500);
  };

  const handleRejeter = async () => {
    if (window.confirm('Confirmez-vous le rejet de cette commande ?')) {
      setUpdating(true);
      setTimeout(() => {
        setCommande({ ...commande, statut: 'rejetee' });
        setUpdating(false);
      }, 500);
    }
  };

  const handleExpedier = async () => {
    setUpdating(true);
    setTimeout(() => {
      setCommande({ ...commande, statut: 'expediee' });
      setUpdating(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des détails...</div>
      </div>
    );
  }

  if (!commande) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Commande non trouvée</p>
        <button
          onClick={() => navigate('/producteur/commandes')}
          className="mt-4 text-green-600 hover:underline"
        >
          Retour aux commandes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/producteur/commandes')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Commande {commande.id}</h1>
          {getStatutBadge(commande.statut)}
        </div>
        <p className="text-gray-500 text-sm">
          Passée le {new Date(commande.date).toLocaleDateString('fr-FR')} à {new Date(commande.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="space-y-6">
        {/* Infos client */}
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="font-medium">{commande.client.nom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{commande.client.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium">{commande.client.telephone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Adresse de livraison</p>
              <p className="font-medium">{commande.client.adresse}</p>
            </div>
          </div>
        </div>

        {/* Produits commandés */}
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Produits commandés</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Produit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Lot</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Quantité</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Prix unit.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {commande.produits.map((produit, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{produit.nom}</p>
                      <p className="text-xs text-gray-500">Origine: {produit.origine}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{produit.lot}</td>
                    <td className="px-4 py-3 text-sm">{produit.quantite}</td>
                    <td className="px-4 py-3 text-sm">{produit.prix.toFixed(2)} €</td>
                    <td className="px-4 py-3 font-medium">{produit.total.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Récapitulatif des montants */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total</span>
                  <span>{commande.montantTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Frais de livraison</span>
                  <span>{commande.fraisLivraison.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-green-600">{commande.montantFinal.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paiement et livraison */}
        <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Paiement & livraison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Mode de paiement</p>
              <p className="font-medium">{commande.modePaiement}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              {getStatutBadge(commande.statut)}
            </div>
          </div>
          {commande.note && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Note du client</p>
              <p className="text-sm mt-1">{commande.note}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {commande.statut === 'en_attente' && (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmer}
                disabled={updating}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {updating ? 'Traitement...' : '✅ Confirmer la commande'}
              </button>
              <button
                onClick={handleRejeter}
                disabled={updating}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                ❌ Rejeter la commande
              </button>
            </div>
          </div>
        )}

        {commande.statut === 'confirmee' && (
          <div className="bg-white rounded-lg shadow border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Expédition</h2>
            <button
              onClick={handleExpedier}
              disabled={updating}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {updating ? 'Traitement...' : '📦 Marquer comme expédiée'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailCommande;