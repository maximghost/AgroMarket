import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ModifierProduit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Récupère l'ID du produit dans l'URL
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    nom: '',
    description: '',
    prix: '',
    unite: 'kg',
    stock: '',
    categorie: 'legumes',
    origine: '',
    lot: '',
    dateProduction: '',
    dateExpiration: '',
    statut: 'actif',
    image: null
  });

  const [errors, setErrors] = useState({});

  // Chargement des données du produit (simulation)
  useEffect(() => {
    // À remplacer par un vrai appel API: fetch(`/api/products/${id}`)
    setTimeout(() => {
      // Simulation d'un produit existant
      const produitExistant = {
        id: parseInt(id),
        nom: 'Tomates bio',
        description: 'Tomates fraîches de saison, cultivées sans pesticides',
        prix: 3.50,
        unite: 'kg',
        stock: 12,
        categorie: 'legumes',
        origine: 'France, Bretagne',
        lot: 'A1-2405',
        dateProduction: '2025-03-15',
        dateExpiration: '2025-03-29',
        statut: 'actif'
      };
      
      setForm(produitExistant);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = 'Nom requis';
    if (!form.prix || form.prix <= 0) newErrors.prix = 'Prix valide requis';
    if (!form.stock || form.stock < 0) newErrors.stock = 'Stock valide requis';
    if (!form.origine.trim()) newErrors.origine = 'Origine requise';
    if (!form.lot.trim()) newErrors.lot = 'Numéro de lot requis';
    if (!form.dateProduction) newErrors.dateProduction = 'Date de production requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    // Simulation envoi API (à remplacer par vrai appel)
    setTimeout(() => {
      console.log('Produit modifié:', form);
      setSaving(false);
      navigate('/producteur/produits');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement du produit...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Modifier le produit</h1>
        <p className="text-gray-500 text-sm mt-1">Modifiez les informations ci-dessous</p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-100 p-6">
        
        {/* Section 1: Informations générales */}
        <div className="mb-6 pb-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Informations générales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom du produit */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du produit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  name="prix"
                  value={form.prix}
                  onChange={handleChange}
                  className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.prix ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <select
                  name="unite"
                  value={form.unite}
                  onChange={handleChange}
                  className="w-24 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="L">L</option>
                  <option value="pièce">pièce</option>
                  <option value="pot">pot</option>
                  <option value="botte">botte</option>
                </select>
              </div>
              {errors.prix && <p className="text-red-500 text-xs mt-1">{errors.prix}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock disponible <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="categorie"
                value={form.categorie}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="legumes">Légumes</option>
                <option value="fruits">Fruits</option>
                <option value="produits_laitiers">Produits laitiers</option>
                <option value="viandes">Viandes</option>
                <option value="miel_confitures">Miel & Confitures</option>
                <option value="boissons">Boissons</option>
                <option value="autres">Autres</option>
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="rupture">Rupture de stock</option>
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Changer la photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">Laissez vide pour garder l'image actuelle</p>
            </div>
          </div>
        </div>

        {/* Section 2: Traçabilité */}
        <div className="mb-6 pb-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Informations de traçabilité <span className="text-red-500 text-sm">*</span>
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-amber-700">
              ⚠️ Ces informations sont obligatoires pour garantir la traçabilité des produits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origine / Lieu de production <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="origine"
                value={form.origine}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.origine ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.origine && <p className="text-red-500 text-xs mt-1">{errors.origine}</p>}
            </div>

            {/* Numéro de lot */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de lot <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lot"
                value={form.lot}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.lot ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lot && <p className="text-red-500 text-xs mt-1">{errors.lot}</p>}
            </div>

            {/* Date de production */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de production <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateProduction"
                value={form.dateProduction}
                onChange={handleChange}
                className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.dateProduction ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateProduction && <p className="text-red-500 text-xs mt-1">{errors.dateProduction}</p>}
            </div>

            {/* Date d'expiration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
              <input
                type="date"
                name="dateExpiration"
                value={form.dateExpiration}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate('/producteur/produits')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifierProduit;