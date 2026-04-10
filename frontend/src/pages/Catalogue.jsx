// Elle importe ProductCard et l'utilise pour chaque produit

import { useState, useEffect } from 'react'
import ProductCard from '../components/Products/ProductCard'
import ProductDetailModal from '../components/Products/ProductDetailModal'
import Header from '../components/Layout/Header'
import api from '../services/api'

const Catalogue = () => {
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('Tous')
  const [recherche, setRecherche] = useState('')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Charger les produits de l'API au montage
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        console.log('🔄 Appel API /products...')
        const res = await api.get('/products')
        console.log('✅ Réponse API:', res.data)
        if (res.data.success) {
          console.log(`📦 ${res.data.data.length} produits reçus`)
          console.log('Premier produit images:', res.data.data[0]?.images)
          
          // Les URLs Cloudinary viennent directement de MongoDB
          const produitsAvecImages = res.data.data.map(produit => ({
            ...produit,
            imageUrl: produit.images?.[0] || null
          }))
          
          setProduits(produitsAvecImages)
          setError(null)
        } else {
          console.error('❌ API success=false')
          setError('Erreur: API success=false')
        }
      } catch (err) {
        console.error('❌ Erreur API:', err.message, err.response?.data)
        setError(`Erreur: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Handler pour ouvrir la modal
  const handleViewProduct = (productId) => {
    setSelectedProductId(productId)
    setIsModalOpen(true)
  }

  // Catégories
  const categories = ['Tous', 'cereales', 'legumes', 'tubercules', 'racineshuile', 'oleagineux', 'autre']
  const categoryLabels = {
    'cereales': 'Céréales', 'legumes': 'Légumes', 'tubercules': 'Tubercules',
    'racineshuile': 'Racines & Huile', 'oleagineux': 'Oléagineux', 'autre': 'Autres'
  }

  // Filtrer
  const produitsFiltres = produits.filter(p => {
    const matchRecherche = p.name.toLowerCase().includes(recherche.toLowerCase())
    const matchCategory = category === 'Tous' || p.category === category
    return matchRecherche && matchCategory
  })

  if (loading) return <div><Header onAuthClick={(type) => console.log(type)} /><div className="max-w-7xl mx-auto px-6 py-8 text-center"><p className="text-gray-500">Chargement...</p></div></div>
  if (error) return <div><Header onAuthClick={(type) => console.log(type)} /><div className="max-w-7xl mx-auto px-6 py-8 text-center"><p className="text-red-500">{error}</p></div></div>

  return (
    <div>
      <Header onAuthClick={(type) => console.log(type)} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-end mb-6">
          <div className="relative w-72">
            <input type="text" placeholder="Rechercher des produits..." value={recherche} onChange={e => setRecherche(e.target.value)} className="w-full border border-gray-300 rounded-full px-5 py-2.5 pr-12 outline-none focus:border-green-600" />
            <span className="absolute right-4 top-2.5 text-gray-400 text-lg">🔍</span>
          </div>
        </div>
        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map(cat => {
            const label = cat === 'Tous' ? 'Tous' : categoryLabels[cat] || cat
            return (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-medium transition ${category === cat ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {label}
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produitsFiltres.map(produit => (
            <ProductCard key={produit._id} product={produit} onViewProduct={handleViewProduct} />
          ))}
        </div>
        {produitsFiltres.length === 0 && <p className="text-center text-gray-400 mt-12">Aucun produit trouvé.</p>}
      </div>

      {/* Modal détails produit */}
      <ProductDetailModal 
        productId={selectedProductId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Catalogue
