import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const ProductDetailModal = ({ productId, isOpen, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Charger le produit avec traçabilité
  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${productId}`);
        if (res.data.success) {
          setProduct(res.data.data);
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error('Erreur chargement produit:', error);
        showToast('Erreur lors du chargement du produit', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, productId, showToast]);

  // Désactiver le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(productId, quantity);
      showToast(
        `✓ ${product.name} ajouté au panier!`,
        'success',
        4000,
        {
          label: 'Voir panier',
          onClick: () => {
            onClose();
            navigate('/cart');
          },
        }
      );
      setQuantity(1);
    } catch (error) {
      showToast('Erreur lors de l\'ajout au panier', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const nextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal - Slide Up Animation */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
        <div
          className="bg-white w-full max-w-4xl rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto pointer-events-auto transform transition duration-300 ease-out"
          style={{
            animation: isOpen ? 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'slideDown 0.3s ease-in',
          }}
        >
          <style>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            @keyframes slideDown {
              from {
                transform: translateY(0);
                opacity: 1;
              }
              to {
                transform: translateY(100%);
                opacity: 0;
              }
            }
          `}</style>

          {/* Header */}
          <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4 md:p-6 z-10">
            <h2 className="text-2xl font-bold">{loading ? '...' : product?.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={28} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Chargement...</p>
              </div>
            </div>
          ) : (
            <div className="p-4 md:p-6 space-y-6">
              {/* Galerie Images */}
              {product?.images && product.images.length > 0 ? (
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square max-h-80 mx-auto">
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                      >
                        <ChevronRight size={20} />
                      </button>
                      {/* Indicateurs */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {product.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition ${
                              idx === currentImageIndex ? 'bg-white' : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500">Pas d'image</p>
                </div>
              )}

              {/* Infos Produit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Détails */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm">Catégorie</p>
                    <p className="font-semibold capitalize">{product?.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Prix</p>
                    <p className="text-2xl font-bold text-green-700">
                      {product?.price?.toLocaleString()} XOF / {product?.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Disponibilité</p>
                    <p className={`font-semibold ${product?.stock_qty > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product?.stock_qty > 0 ? `${product.stock_qty} en stock` : 'Rupture de stock'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Commune</p>
                    <p className="font-semibold">{product?.commune}</p>
                  </div>
                </div>

                {/* Producteur & Ajouter Panier */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm mb-2">Producteur</p>
                    <p className="font-semibold text-lg">{product?.producer_id?.full_name}</p>
                    <p className="text-sm text-gray-600">{product?.producer_id?.commune}</p>
                    {product?.producer_id?.phone && (
                      <p className="text-sm text-gray-600">{product?.producer_id?.phone}</p>
                    )}
                  </div>

                  {/* Quantité & Ajouter Panier */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Quantité:</label>
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={addingToCart}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-12 text-center border-l border-r py-1"
                          disabled={addingToCart}
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={addingToCart}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={product?.stock_qty <= 0 || addingToCart}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      {addingToCart ? 'Ajout...' : 'Ajouter au panier'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product?.description && (
                <div className="pt-4 border-t">
                  <h3 className="font-bold text-lg mb-2">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              {/* Traçabilité — données de base toujours affichées si disponibles */}
              {(product?.lot || product?.dateProduction || product?.commune || product?.traceability_id) && (
                <div className="pt-4 border-t">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-green-700" />
                    Traçabilité
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg">
                    {product.commune && (
                      <div>
                        <p className="text-gray-600 text-sm">Lieu de production</p>
                        <p className="font-semibold">{product.commune}</p>
                      </div>
                    )}
                    {product.lot && (
                      <div>
                        <p className="text-gray-600 text-sm">Numéro de lot</p>
                        <p className="font-semibold">{product.lot}</p>
                      </div>
                    )}
                    {product.dateProduction && (
                      <div>
                        <p className="text-gray-600 text-sm">Date de production</p>
                        <p className="font-semibold">{new Date(product.dateProduction).toLocaleDateString('fr-FR')}</p>
                      </div>
                    )}
                    {product.dateExpiration && (
                      <div>
                        <p className="text-gray-600 text-sm">Date d'expiration</p>
                        <p className="font-semibold">{new Date(product.dateExpiration).toLocaleDateString('fr-FR')}</p>
                      </div>
                    )}

                    {/* Données de la fiche Traceability si elle existe */}
                    {product.traceability_id?.farm_name && (
                      <div>
                        <p className="text-gray-600 text-sm">Ferme / Exploitation</p>
                        <p className="font-semibold">{product.traceability_id.farm_name}</p>
                      </div>
                    )}
                    {product.traceability_id?.cultivation_method && (
                      <div>
                        <p className="text-gray-600 text-sm">Méthode de culture</p>
                        <p className="font-semibold capitalize">{product.traceability_id.cultivation_method}</p>
                      </div>
                    )}
                    {product.traceability_id?.harvest_date && (
                      <div>
                        <p className="text-gray-600 text-sm">Date de récolte</p>
                        <p className="font-semibold">
                          {new Date(product.traceability_id.harvest_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                    {product.traceability_id && (
                      <div>
                        <p className="text-gray-600 text-sm">Pesticides</p>
                        <p className={`font-semibold ${product.traceability_id.pesticides_used ? 'text-red-600' : 'text-green-600'}`}>
                          {product.traceability_id.pesticides_used ? '⚠️ Utilisés' : '✓ Non utilisés'}
                        </p>
                      </div>
                    )}
                    {product.traceability_id?.is_verified && (
                      <div className="md:col-span-2">
                        <p className="font-semibold text-green-700 flex items-center gap-1">
                          ✓ Fiche vérifiée par AgroMarket
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  {product.traceability_id?.certifications?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Certifications</p>
                      <div className="space-y-2">
                        {product.traceability_id.certifications.map((cert, idx) => (
                          <div key={idx} className="bg-white p-3 rounded border border-green-200">
                            <p className="font-semibold">{cert.name}</p>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                            {cert.issued_at && (
                              <p className="text-xs text-gray-500">{new Date(cert.issued_at).toLocaleDateString('fr-FR')}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Étapes de traitement */}
                  {product.traceability_id?.processing_steps?.length > 0 && (
                    <div className="mt-4">
                      <p className="font-semibold mb-2">Étapes de traitement</p>
                      <div className="space-y-2">
                        {product.traceability_id.processing_steps.map((step, idx) => (
                          <div key={idx} className="bg-white p-3 rounded border border-green-200">
                            <p className="font-semibold">{step.step}</p>
                            <p className="text-sm text-gray-700">{step.description}</p>
                            {step.date && (
                              <p className="text-xs text-gray-500">{new Date(step.date).toLocaleDateString('fr-FR')}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailModal;
