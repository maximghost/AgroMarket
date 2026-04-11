import React, { useState } from 'react';
import { Eye } from 'lucide-react';

const ProductCard = ({ product, onViewProduct }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 overflow-hidden cursor-pointer">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          onClick={() => onViewProduct && onViewProduct(product._id)}
        />
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
        
        <p className="text-sm text-gray-600 mt-1">
          {product.commune || product.localisation}
        </p>

        {/* Prix */}
        <div className="mt-3 flex items-center justify-between">
          <div className="font-bold text-green-700 text-lg">
            {product.price} XOF {product.unit && <span className="text-sm">/{product.unit}</span>}
          </div>
          
          {product.stock_qty !== undefined && (
            <span className={`text-xs px-2 py-1 rounded ${
              product.stock_qty > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock_qty > 0 ? `${product.stock_qty} en stock` : 'Épuisé'}
            </span>
          )}
        </div>

        {/* Bouton Voir Produit */}
        <button
          onClick={() => onViewProduct && onViewProduct(product._id)}
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Eye size={18} />
          Voir produit
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
