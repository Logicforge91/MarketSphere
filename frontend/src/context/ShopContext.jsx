import React, { createContext, useContext, useMemo, useState } from "react";
import { cartItems, deals, mobileProducts, shoeProducts } from "../data/shopData";

const ShopContext = createContext(null);

const catalog = [...deals, ...mobileProducts, ...shoeProducts];

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(cartItems);
  const [wishlist, setWishlist] = useState([shoeProducts[0], mobileProducts[1]]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceLimit, setPriceLimit] = useState(80000);

  const products = useMemo(() => {
    return catalog.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
      const matchesPrice = product.price <= priceLimit;
      return matchesSearch && matchesPrice;
    });
  }, [query, priceLimit]);

  function addToCart(product) {
    setCart((items) => {
      const existing = items.find((item) => item.name === product.name);
      if (existing) {
        return items.map((item) => item.name === product.name ? { ...item, qty: (item.qty || 1) + 1 } : item);
      }
      return [...items, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(name) {
    setCart((items) => items.filter((item) => item.name !== name));
  }

  function updateQty(name, qty) {
    setCart((items) => items.map((item) => item.name === name ? { ...item, qty: Math.max(1, qty) } : item));
  }

  function toggleWishlist(product) {
    setWishlist((items) => {
      const exists = items.some((item) => item.name === product.name);
      return exists ? items.filter((item) => item.name !== product.name) : [...items, product];
    });
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * (item.qty || 1), 0);

  const value = {
    activeCategory,
    addToCart,
    cart,
    cartTotal,
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
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }
  return context;
}
