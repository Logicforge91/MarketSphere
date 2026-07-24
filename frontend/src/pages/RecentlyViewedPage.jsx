import React, { useMemo, useState } from "react";
import { Check, Clock3, Cloud, CloudOff, History, RefreshCw, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { catalog } from "../data/catalog";
import { useShop } from "../context/ShopContext";

function readHistory() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:recently-viewed")) || [];
  } catch {
    return [];
  }
}

function readSync() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:history-sync")) || { enabled: true, lastSyncedAt: new Date().toISOString() };
  } catch {
    return { enabled: true, lastSyncedAt: new Date().toISOString() };
  }
}

export default function RecentlyViewedPage() {
  const { addToCart, toggleWishlist } = useShop();
  const [history, setHistory] = useState(readHistory);
  const [sync, setSync] = useState(readSync);
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState("");

  const viewed = useMemo(() => history.map((entry) => {
    const product = catalog.find((item) => item.slug === entry.slug || item.id === entry.id);
    return product ? { ...product, viewedAt: entry.viewedAt, viewCount: entry.viewCount || 1 } : null;
  }).filter(Boolean), [history]);

  const recommendations = useMemo(() => {
    const viewedSlugs = new Set(viewed.map((item) => item.slug));
    const categoryScores = viewed.reduce((scores, item) => ({ ...scores, [item.category]: (scores[item.category] || 0) + (item.viewCount || 1) }), {});
    return catalog
      .filter((item) => !viewedSlugs.has(item.slug))
      .sort((a, b) => (categoryScores[b.category] || 0) - (categoryScores[a.category] || 0) || (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  }, [viewed]);

  function clearHistory() {
    setHistory([]);
    window.localStorage.setItem("marketsphere:recently-viewed", "[]");
    setConfirmClear(false);
    setMessage("Recently viewed history cleared.");
  }

  function toggleSync() {
    const next = { enabled: !sync.enabled, lastSyncedAt: !sync.enabled ? new Date().toISOString() : sync.lastSyncedAt };
    setSync(next);
    window.localStorage.setItem("marketsphere:history-sync", JSON.stringify(next));
    setMessage(next.enabled ? "History sync enabled across signed-in devices." : "History will remain on this device.");
  }

  function syncNow() {
    const next = { ...sync, lastSyncedAt: new Date().toISOString() };
    setSync(next);
    window.localStorage.setItem("marketsphere:history-sync", JSON.stringify(next));
    setMessage("Viewing history synced.");
  }

  return <main className="real-page recently-viewed-page">
    <header className="recent-heading"><div><span>Browsing history</span><h1>Recently viewed</h1><p>Pick up where you left off and rediscover products you explored.</p></div>{history.length > 0 && <button onClick={() => setConfirmClear(true)}><Trash2 /> Clear history</button>}</header>
    {message && <p className="wallet-message"><Check /> {message}</p>}

    <aside className="history-sync-panel">
      <div>{sync.enabled ? <Cloud /> : <CloudOff />}<span><strong>Sync history across devices</strong><small>{sync.enabled ? `Last synced ${new Date(sync.lastSyncedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}` : "History is stored only on this device"}</small></span></div>
      {sync.enabled && <button onClick={syncNow} title="Sync now"><RefreshCw /> Sync now</button>}
      <label className="switch"><input type="checkbox" checked={sync.enabled} onChange={toggleSync} /><i /></label>
    </aside>

    {viewed.length ? <section className="recent-history-section"><header><div><span>Recent products</span><h2>Your browsing history</h2></div><small>{viewed.length} {viewed.length === 1 ? "product" : "products"}</small></header><div className="recent-product-grid">{viewed.map((product) => <article key={product.slug}><ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} /><footer><Clock3 /><span>Viewed {new Date(product.viewedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>{product.viewCount > 1 && <b>{product.viewCount} views</b>}</footer></article>)}</div></section> : <section className="recent-empty"><History /><h2>No recently viewed products</h2><p>Products you open will appear here so you can find them again quickly.</p><Link className="primary" to="/products"><ShoppingBag /> Continue shopping</Link></section>}

    <section className="recent-recommendations"><header><div><span>Picked for you</span><h2>Personalized recommendations</h2><p>{viewed.length ? "Based on categories and products in your viewing history." : "Popular products to get your shopping started."}</p></div><Link to="/products">View all</Link></header><div className="product-grid compact">{recommendations.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.id} />)}</div></section>
    <div className="recent-continue"><Link to="/products"><ShoppingBag /> Continue shopping</Link></div>

    {confirmClear && <div className="wallet-modal-backdrop" onMouseDown={() => setConfirmClear(false)}><section className="history-clear-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><span>Browsing history</span><h2>Clear recently viewed?</h2></div><button onClick={() => setConfirmClear(false)}><X /></button></header><Trash2 /><p>This removes all viewed products from this device and synced history. Personalized recommendations will reset.</p><div><button onClick={() => setConfirmClear(false)}>Keep history</button><button className="danger-button" onClick={clearHistory}>Clear history</button></div></section></div>}
  </main>;
}
