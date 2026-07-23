import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cartItems, deals, mobileProducts, shoeProducts } from "../data/shopData";

const ShopContext = createContext(null);

const catalog = [...deals, ...mobileProducts, ...shoeProducts];

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(cartItems);
  const [wishlist, setWishlist] = useState([shoeProducts[0], mobileProducts[1]]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceLimit, setPriceLimit] = useState(80000);
  const [notification, setNotification] = useState("");

  const products = useMemo(() => {
    return catalog.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
      const matchesPrice = product.price <= priceLimit;
      return matchesSearch && matchesPrice;
    });
  }, [query, priceLimit]);

  const addToCart = useCallback((product) => {
    setCart((items) => {
      const existing = items.find((item) => item.name === product.name);
      if (existing) {
        return items.map((item) => item.name === product.name ? { ...item, qty: (item.qty || 1) + 1 } : item);
      }
      return [...items, { ...product, qty: 1 }];
    });
    setNotification(`${product.name} added to your bag`);
  }, []);

  const removeFromCart = useCallback((name) => {
    setCart((items) => items.filter((item) => item.name !== name));
  }, []);

  const updateQty = useCallback((name, qty) => {
    setCart((items) => items.map((item) => item.name === name ? { ...item, qty: Math.max(1, qty) } : item));
  }, []);

  const toggleWishlist = useCallback((product) => {
    const exists = wishlist.some((item) => item.name === product.name);
    setWishlist((items) => {
      return exists ? items.filter((item) => item.name !== product.name) : [...items, product];
    });
    setNotification(exists ? `${product.name} removed from saved items` : `${product.name} saved for later`);
  }, [wishlist]);

  const clearNotification = useCallback(() => setNotification(""), []);

  const cartTotal = cart.reduce((total, item) => total + item.price * (item.qty || 1), 0);

  const value = useMemo(() => ({
    activeCategory,
    addToCart,
    cart,
    cartTotal,
    clearNotification,
    notification,
    priceLimit,
    products,
    query,
    removeFromCart,
    setActiveCategory,
    setPriceLimit,
    setQuery,
    toggleWishlist,
    updateQty,
    wishlist,
  }), [
    activeCategory,
    addToCart,
    cart,
    cartTotal,
    clearNotification,
    notification,
    priceLimit,
    products,
    query,
    removeFromCart,
    toggleWishlist,
    updateQty,
    wishlist,
  ]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }
  return context;
}
