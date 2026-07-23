import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cartItems, mobileProducts, orders as seedOrders, shoeProducts } from "../data/shopData";
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
  const [savedForLater, setSavedForLater] = useState(() => readStoredState("marketsphere:saved-for-later", []));
  const [compareProducts, setCompareProducts] = useState(() => readStoredState("marketsphere:compare", shoeProducts.slice(0, 3)));
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceLimit, setPriceLimit] = useState(80000);
  const [sortBy, setSortBy] = useState("featured");
  const [notification, setNotification] = useState("");
  const [orders, setOrders] = useState(() => readStoredState("marketsphere:orders", seedOrders));
  const [returnRequests, setReturnRequests] = useState(() => readStoredState("marketsphere:returns", []));

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
    window.localStorage.setItem("marketsphere:cart-activity", new Date().toISOString());
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem("marketsphere:wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    window.localStorage.setItem("marketsphere:saved-for-later", JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    window.localStorage.setItem("marketsphere:compare", JSON.stringify(compareProducts));
  }, [compareProducts]);

  useEffect(() => {
    window.localStorage.setItem("marketsphere:orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    window.localStorage.setItem("marketsphere:returns", JSON.stringify(returnRequests));
  }, [returnRequests]);

  const addToCart = useCallback((product) => {
    setCart((items) => {
      const existing = items.find((item) => item.name === product.name);
      if (existing) {
        return items.map((item) => item.name === product.name ? { ...item, qty: (item.qty || 1) + (product.qty || 1), variant: product.variant || item.variant, sku: product.sku || item.sku } : item);
      }
      return [...items, { ...product, qty: product.qty || 1 }];
    });
    setNotification(`${product.name} added to your bag`);
  }, []);

  const removeFromCart = useCallback((name) => {
    setCart((items) => items.filter((item) => item.name !== name));
  }, []);

  const updateQty = useCallback((name, qty) => {
    setCart((items) => items.map((item) => item.name === name ? { ...item, qty: Math.min(5, Math.max(1, qty)) } : item));
  }, []);

  const updateCartVariant = useCallback((name, variant) => {
    setCart((items) => items.map((item) => item.name === name ? { ...item, variant, sku: `${item.id || "MS"}-${Object.values(variant).join("-")}` } : item));
    setNotification("Product options updated");
  }, []);

  const saveForLater = useCallback((name) => {
    setCart((items) => {
      const item = items.find((product) => product.name === name);
      if (item) setSavedForLater((saved) => [item, ...saved.filter((product) => product.name !== name)]);
      return items.filter((product) => product.name !== name);
    });
    setNotification("Product saved for later");
  }, []);

  const moveSavedToCart = useCallback((name) => {
    setSavedForLater((items) => {
      const item = items.find((product) => product.name === name);
      if (item) setCart((cartItems) => [...cartItems.filter((product) => product.name !== name), item]);
      return items.filter((product) => product.name !== name);
    });
    setNotification("Product moved to cart");
  }, []);

  const moveToWishlist = useCallback((name) => {
    setCart((items) => {
      const item = items.find((product) => product.name === name);
      if (item) setWishlist((saved) => [item, ...saved.filter((product) => product.name !== name)]);
      return items.filter((product) => product.name !== name);
    });
    setNotification("Product moved to wishlist");
  }, []);

  const toggleWishlist = useCallback((product) => {
    const exists = wishlist.some((item) => item.name === product.name);
    setWishlist((items) => {
      return exists ? items.filter((item) => item.name !== product.name) : [...items, product];
    });
    setNotification(exists ? `${product.name} removed from saved items` : `${product.name} saved for later`);
  }, [wishlist]);

  const clearNotification = useCallback(() => setNotification(""), []);

  const addToCompare = useCallback((product) => {
    setCompareProducts((items) => {
      if (items.some((item) => item.name === product.name)) return items;
      if (items.length >= 4) {
        setNotification("You can compare up to four products");
        return items;
      }
      setNotification(`${product.name} added to comparison`);
      return [...items, product];
    });
  }, []);

  const removeFromCompare = useCallback((name) => {
    setCompareProducts((items) => items.filter((item) => item.name !== name));
  }, []);

  const cartTotal = cart.reduce((total, item) => total + item.price * (item.qty || 1), 0);

  const placeOrder = useCallback(({ address, paymentMethod, total, ...checkoutDetails }) => {
    if (!cart.length) return null;
    const order = {
      address,
      date: new Date().toISOString(),
      id: `MS${Date.now().toString().slice(-10)}`,
      image: cart[0].image,
      items: cart,
      paymentMethod,
      ...checkoutDetails,
      status: "Confirmed",
      total: total ?? cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0),
    };
    setOrders((items) => [order, ...items]);
    setCart([]);
    setNotification("Order placed successfully");
    return order;
  }, [cart]);

  const updateOrder = useCallback((orderId, updater) => {
    setOrders((items) => items.map((order) => order.id === orderId
      ? (typeof updater === "function" ? updater(order) : { ...order, ...updater })
      : order));
  }, []);

  const cancelOrder = useCallback((orderId, details = {}) => {
    const cancelledAt = new Date().toISOString();
    const refundFailed = details.refundMethod === "Bank account" && details.bankAccount?.endsWith("0000");
    updateOrder(orderId, (order) => ({
      ...order,
      status: "Cancelled",
      cancelledAt,
      cancellation: { ...details, scope: "Full order", confirmedAt: cancelledAt },
      refund: {
        amount: order.total,
        method: details.refundMethod || "Original payment method",
        type: "Full refund",
        reference: `RF${Date.now().toString().slice(-10)}`,
        status: order.paymentMethod === "cod" ? "Not applicable" : refundFailed ? "Refund failed" : details.refundMethod === "MarketSphere Wallet" ? "Refund completed" : "Refund initiated",
        failureReason: refundFailed ? "Bank account verification failed. Check the account details and retry." : null,
        bankAccount: details.refundMethod === "Bank account" ? `Ending ${details.bankAccount?.slice(-4)}` : null,
        initiatedAt: cancelledAt,
        estimate: order.paymentMethod === "cod" ? null : "5-7 business days",
        timeline: [{ label: "Refund initiated", date: cancelledAt }],
      },
    }));
    setNotification("Order cancelled");
  }, [updateOrder]);

  const cancelOrderItem = useCallback((orderId, itemName, details = {}) => {
    updateOrder(orderId, (order) => ({
      ...order,
      items: order.items.map((item) => item.name === itemName ? {
        ...item,
        itemStatus: "Cancelled",
        cancellation: { ...details, confirmedAt: new Date().toISOString() },
        refund: {
          amount: item.price * (item.qty || 1),
          method: details.refundMethod || "Original payment method",
          type: "Partial refund",
          reference: `RF${Date.now().toString().slice(-10)}`,
          status: order.paymentMethod === "cod" ? "Not applicable" : details.refundMethod === "MarketSphere Wallet" ? "Refund completed" : "Refund initiated",
          estimate: order.paymentMethod === "cod" ? null : "5-7 business days",
          timeline: [{ label: "Refund initiated", date: new Date().toISOString() }],
        },
      } : item),
    }));
    setNotification(`${itemName} cancelled`);
  }, [updateOrder]);

  const retryRefund = useCallback((orderId) => {
    updateOrder(orderId, (order) => ({
      ...order,
      refund: {
        ...order.refund,
        status: "Refund initiated",
        failureReason: null,
        retriedAt: new Date().toISOString(),
        timeline: [...(order.refund?.timeline || []), { label: "Refund retry initiated", date: new Date().toISOString() }],
      },
    }));
    setNotification("Refund retry initiated");
  }, [updateOrder]);

  const createReturnRequest = useCallback((request) => {
    const createdAt = new Date().toISOString();
    const record = {
      ...request,
      id: `RET${Date.now().toString().slice(-9)}`,
      createdAt,
      status: "Request submitted",
      timeline: [{ label: "Request submitted", date: createdAt, done: true }],
    };
    setReturnRequests((items) => [record, ...items]);
    setNotification(`${request.type} request submitted`);
    return record;
  }, []);

  const updateReturnRequest = useCallback((requestId, updates) => {
    setReturnRequests((items) => items.map((request) => request.id === requestId ? { ...request, ...updates } : request));
  }, []);

  const cancelReturnRequest = useCallback((requestId) => {
    updateReturnRequest(requestId, {
      status: "Cancelled",
      cancelledAt: new Date().toISOString(),
    });
    setNotification("Return request cancelled");
  }, [updateReturnRequest]);

  const reorder = useCallback((orderId) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order?.items?.length) return;
    setCart((items) => {
      const next = [...items];
      order.items.filter((item) => item.itemStatus !== "Cancelled").forEach((product) => {
        const existing = next.find((item) => item.name === product.name);
        if (existing) existing.qty = Math.min(5, (existing.qty || 1) + (product.qty || 1));
        else next.push({ ...product });
      });
      return next;
    });
    setNotification("Order items added to your bag");
  }, [orders]);

  const latestOrder = orders[0] || null;

  const value = useMemo(() => ({
    activeCategory,
    addToCart,
    addToCompare,
    cart,
    cartTotal,
    cancelOrder,
    cancelOrderItem,
    cancelReturnRequest,
    clearNotification,
    compareProducts,
    createReturnRequest,
    latestOrder,
    notification,
    orders,
    priceLimit,
    products,
    query,
    returnRequests,
    removeFromCart,
    removeFromCompare,
    reorder,
    retryRefund,
    placeOrder,
    moveSavedToCart,
    moveToWishlist,
    saveForLater,
    savedForLater,
    setActiveCategory,
    setPriceLimit,
    setQuery,
    setSortBy,
    sortBy,
    toggleWishlist,
    updateCartVariant,
    updateOrder,
    updateReturnRequest,
    updateQty,
    wishlist,
  }), [
    activeCategory,
    addToCart,
    addToCompare,
    cart,
    cartTotal,
    cancelOrder,
    cancelOrderItem,
    cancelReturnRequest,
    clearNotification,
    compareProducts,
    createReturnRequest,
    latestOrder,
    notification,
    orders,
    priceLimit,
    products,
    query,
    returnRequests,
    removeFromCart,
    removeFromCompare,
    reorder,
    retryRefund,
    placeOrder,
    moveSavedToCart,
    moveToWishlist,
    saveForLater,
    savedForLater,
    sortBy,
    toggleWishlist,
    updateCartVariant,
    updateOrder,
    updateReturnRequest,
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
