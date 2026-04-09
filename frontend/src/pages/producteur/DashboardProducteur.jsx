import { useState, useEffect } from 'react';

const DashboardProducteur = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalCommandes: 0,
    revenusTotaux: 0,
    totalProduits: 0
  });

  const [ventesMensuelles, setVentesMensuelles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalClients: 24,
        totalCommandes: 0,
        revenusTotaux: 0,
        totalProduits: 0
      });

      setVentesMensuelles([
        { mois: 'Jan', ventes: 0.2 },
        { mois: 'Fév', ventes: 0.3 },
        { mois: 'Mar', ventes: 0.4 },
        { mois: 'Avr', ventes: 0.5 },
        { mois: 'Mai', ventes: 0.6 },
        { mois: 'Juin', ventes: 0.7 },
        { mois: 'Juil', ventes: 0.6 },
        { mois: 'Aoû', ventes: 0.5 },
        { mois: 'Sep', ventes: 0.4 },
        { mois: 'Oct', ventes: 0.3 },
        { mois: 'Nov', ventes: 0.2 },
        { mois: 'Déc', ventes: 0.1 }
      ]);

      setLoading(false);
    }, 500);
  }, []);

  const maxVentes = Math.max(...ventesMensuelles.map(v => v.ventes), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Bienvenue Code !</h1>
        <p className="text-sm text-gray-500 mt-1">
          Confirmez que <span className="font-medium">code33457@gmail.com</span> est votre adresse mail.
        </p>
        <button className="text-sm text-green-600 hover:text-green-700 mt-1">
          Renvoyer mail de confirmation
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Total des clients</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalClients}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Total des commandes</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalCommandes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Revenus totaux</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.revenusTotaux} €</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Total des produits publiés</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalProduits}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h2 className="text-md font-medium text-gray-700 mb-4">Ventes mensuelles</h2>
        
        <div className="space-y-3">
          {ventesMensuelles.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-sm text-gray-500 w-10">{item.mois}</span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${(item.ventes / maxVentes) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{item.ventes}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t">
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>0,2</span>
            <span>0,4</span>
            <span>0,6</span>
            <span>0,8</span>
            <span>1,0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProducteur;