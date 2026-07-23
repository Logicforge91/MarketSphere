import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cartItems, mobileProducts, shoeProducts } from "../data/shopData";
import { catalog } from "../data/catalog";

const ShopContext = createContext(null);

function readStoredState(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStoredState("marketsphere:cart", cartItems));
  const [wishlist, setWishlist] = useState(() => readStoredState("marketsphere:wishlist", [shoeProducts[0], mobileProducts[1]]));
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceLimit, setPriceLimit] = useState(80000);
  const [sortBy, setSortBy] = useState("featured");
  const [notification, setNotification] = useState("");

  const products = useMemo(() => {
    const filtered = catalog.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
      const matchesPrice = product.price <= priceLimit;
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      return matchesSearch && matchesPrice && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, priceLimit, query, sortBy]);

  useEffect(() => {
    window.localStorage.setItem("marketsphere:cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem("marketsphere:wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

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
    setSortBy,
    sortBy,
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
    sortBy,
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
