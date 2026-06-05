import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
      setCartCount(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/api/cart");
      setCart(data);
      setCartCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post("/api/cart", { productId, quantity });
    setCart(data);
    setCartCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.put(`/api/cart/${productId}`, { quantity });
    setCart(data);
    setCartCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/api/cart/${productId}`);
    setCart(data);
    setCartCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
  };

  const clearCart = async () => {
    await api.delete("/api/cart");
    setCart({ items: [] });
    setCartCount(0);
  };

  return (
    <CartContext.Provider
      value={{ cart, cartCount, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
