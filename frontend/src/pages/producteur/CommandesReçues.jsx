import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CommandesRecues = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('toutes'); // toutes, en_attente, confirmee, expediee, livree
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation de chargement des commandes (à remplacer par API)
  useEffect(() => {
    setTimeout(() => {
      setCommandes([
        {
          id: 'CMD-001',
          client: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          telephone: '06 12 34 56 78',
          produits: [
            { nom: 'Tomates bio', quantite: 2, prix: 3.50, lot: 'A1-2405' }
          ],
          montantTotal: 7.00,
          date: '2026-04-09T10:30:00',
          statut: 'en_attente',
          adresseLivraison: '12 rue des Lilas, 75001 Paris'
        },
        {
          id: 'CMD-002',
          client: 'Marie Curie',
          email: 'marie.curie@email.com',
          telephone: '06 98 76 54 32',
          produits: [
            { nom: 'Courgettes', quantite: 3, prix: 2.80, lot: 'B2-2406' }
          ],
          montantTotal: 8.40,
          date: '2026-04-08T14:15:00',
          statut: 'confirmee',
          adresseLivraison: '5 avenue des Roses, 69002 Lyon'
        },
        {
          id: 'CMD-003',
          client: 'Pierre Martin',
          email: 'pierre.martin@email.com',
          telephone: '07 11 22 33 44',
          produits: [
            { nom: 'Miel de printemps', quantite: 2, prix: 12.00, lot: 'C3-2407' },
            { nom: 'Tomates bio', quantite: 1, prix: 3.50, lot: 'A1-2405' }
          ],
          montantTotal: 27.50,
          date: '2026-04-07T09:45:00',
          statut: 'expediee',
          adresseLivraison: '8 rue de la Gare, 44000 Nantes'
        },
        {
          id: 'CMD-004',
          client: 'Sophie Dubois',
          email: 'sophie.dubois@email.com',
          telephone: '06 55 66 77 88',
          produits: [
            { nom: 'Courgettes', quantite: 1, prix: 2.80, lot: 'B2-2406' }
          ],
          montantTotal: 2.80,
          date: '2026-04-06T16:20:00',
          statut: 'livree',
          adresseLivraison: '15 boulevard Victor Hugo, 13001 Marseille'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

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

  const getStatutColor = (statut) => {
    const colors = {
      en_attente: 'border-yellow-500 bg-yellow-50',
      confirmee: 'border-blue-500 bg-blue-50',
      expediee: 'border-purple-500 bg-purple-50',
      livree: 'border-green-500 bg-green-50',
      rejetee: 'border-red-500 bg-red-50'
    };
    return colors[statut] || colors.en_attente;
  };

  const handleConfirmer = (id) => {
    setCommandes(commandes.map(cmd => 
      cmd.id === id ? { ...cmd, statut: 'confirmee' } : cmd
    ));
  };

  const handleRejeter = (id) => {
    if (window.confirm('Confirmez-vous le rejet de cette commande ?')) {
      setCommandes(commandes.map(cmd => 
        cmd.id === id ? { ...cmd, statut: 'rejetee' } : cmd
      ));
    }
  };

  const handleExpedier = (id) => {
    setCommandes(commandes.map(cmd => 
      cmd.id === id ? { ...cmd, statut: 'expediee' } : cmd
    ));
  };

  // Filtrage des commandes
  const filteredCommandes = commandes.filter(cmd => {
    if (filter !== 'toutes' && cmd.statut !== filter) return false;
    if (searchTerm && !cmd.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !cmd.client.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: commandes.length,
    en_attente: commandes.filter(c => c.statut === 'en_attente').length,
    a_expedier: commandes.filter(c => c.statut === 'confirmee').length,
    revenus: commandes.reduce((sum, c) => sum + c.montantTotal, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Commandes reçues</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez les commandes de vos produits</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total commandes</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.en_attente}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">À expédier</p>
          <p className="text-2xl font-bold text-purple-600">{stats.a_expedier}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Revenus totaux</p>
          <p className="text-2xl font-bold text-green-600">{stats.revenus.toFixed(2)} €</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('toutes')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === 'toutes' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('en_attente')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === 'en_attente' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('confirmee')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === 'confirmee' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmées
            </button>
            <button
              onClick={() => setFilter('expediee')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === 'expediee' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expédiées
            </button>
            <button
              onClick={() => setFilter('livree')}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === 'livree' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Livrées
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-lg p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="absolute left-2 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      {filteredCommandes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCommandes.map((commande) => (
            <div key={commande.id} className={`bg-white rounded-lg shadow border-l-4 ${getStatutColor(commande.statut)} overflow-hidden`}>
              <div className="p-4">
                {/* En-tête de la commande */}
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div>
                    <Link to={`/producteur/commandes/${commande.id}`} className="font-semibold text-blue-600 hover:underline">
                      {commande.id}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(commande.date).toLocaleDateString('fr-FR')} à {new Date(commande.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatutBadge(commande.statut)}
                    <span className="text-lg font-bold text-gray-800">{commande.montantTotal.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Infos client */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span><strong>Client :</strong> {commande.client}</span>
                    <span><strong>Email :</strong> {commande.email}</span>
                    <span><strong>Tél :</strong> {commande.telephone}</span>
                  </div>
                </div>

                {/* Produits commandés */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Produits commandés :</p>
                  <div className="flex flex-wrap gap-2">
                    {commande.produits.map((produit, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {produit.quantite}x {produit.nom} (lot: {produit.lot})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t">
                  {commande.statut === 'en_attente' && (
                    <>
                      <button
                        onClick={() => handleConfirmer(commande.id)}
                        className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                      >
                        ✅ Confirmer la commande
                      </button>
                      <button
                        onClick={() => handleRejeter(commande.id)}
                        className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                      >
                        ❌ Rejeter
                      </button>
                    </>
                  )}
                  {commande.statut === 'confirmee' && (
                    <button
                      onClick={() => handleExpedier(commande.id)}
                      className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                    >
                      📦 Marquer comme expédiée
                    </button>
                  )}
                  <Link
                    to={`/producteur/commandes/${commande.id}`}
                    className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Voir le détail →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommandesRecues;