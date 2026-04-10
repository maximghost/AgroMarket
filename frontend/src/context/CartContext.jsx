import React, { createContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer le panier au chargement
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
        setError(null);
      }
    } catch (err) {
      console.error('Erreur récupération panier:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter un produit au panier
  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart/items', {
        product_id: productId,
        qty: quantity,
      });
      if (res.data.success) {
        setCart(res.data.data);
        return res.data;
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Erreur ajout au panier');
      throw err;
    }
  }, []);

  // Mettre à jour la quantité (utilise product_id, pas item._id)
  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      const res = await api.patch(`/cart/items/${productId}`, { qty: quantity });
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Erreur mise à jour');
      throw err;
    }
  }, []);

  // Supprimer un article (utilise product_id, pas item._id)
  const removeFromCart = useCallback(async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Erreur suppression');
      throw err;
    }
  }, []);

  // Vider le panier
  const clearCart = useCallback(async () => {
    try {
      const res = await api.delete('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Erreur vidage');
      throw err;
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount: cart?.items?.length || 0,
        total: cart?.total_price || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
