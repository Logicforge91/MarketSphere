import React, { useMemo, useRef, useState } from "react";
import { Camera, ChevronRight, Clock3, History, Image, Mic, QrCode, Search, Store, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { catalog } from "../data/catalog";
import { brands } from "../data/shopData";
import { useShop } from "../context/ShopContext";

const HISTORY_KEY = "marketsphere:search-history";
const popularSearches = ["Summer dresses", "White sneakers", "Shoulder bags", "Smart watches", "Linen edit", "Beauty essentials"];
const stores = ["The Modern Wardrobe", "Sole Society", "The Beauty Room", "MarketSphere Select"];

function readHistory() {
  try {
    return JSON.parse(window.localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function productBrand(product, index) {
  return brands[index % brands.length];
}

export default function SearchPage() {
  const { addToCart, query, setQuery, toggleWishlist } = useShop();
  const [draft, setDraft] = useState(query);
  const [activeType, setActiveType] = useState("All");
  const [history, setHistory] = useState(readHistory);
  const [listening, setListening] = useState(false);
  const [visualStatus, setVisualStatus] = useState("");
  const fileInput = useRef(null);

  const categories = useMemo(() => ["All", ...new Set(catalog.map((product) => product.category))], []);
  const normalized = draft.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!normalized) return [];
    const productMatches = catalog.filter((item) => item.name.toLowerCase().includes(normalized)).slice(0, 4).map((item) => ({ label: item.name, type: "Product" }));
    const categoryMatches = categories.filter((item) => item !== "All" && item.toLowerCase().includes(normalized)).map((label) => ({ label, type: "Category" }));
    const brandMatches = brands.filter((item) => item.toLowerCase().includes(normalized)).map((label) => ({ label, type: "Brand" }));
    const storeMatches = stores.filter((item) => item.toLowerCase().includes(normalized)).map((label) => ({ label, type: "Store" }));
    return [...productMatches, ...categoryMatches, ...brandMatches, ...storeMatches].slice(0, 7);
  }, [categories, normalized]);

  const results = useMemo(() => catalog.filter((product, index) => {
    if (!normalized) return true;
    const brand = productBrand(product, index).toLowerCase();
    const store = stores[index % stores.length].toLowerCase();
    if (activeType === "Products") return product.name.toLowerCase().includes(normalized);
    if (activeType === "Categories") return product.category.toLowerCase().includes(normalized);
    if (activeType === "Brands") return brand.includes(normalized);
    if (activeType === "Stores") return store.includes(normalized);
    return `${product.name} ${product.category} ${brand} ${store}`.toLowerCase().includes(normalized);
  }), [activeType, normalized]);

  function commitSearch(value) {
    const next = value.trim();
    setDraft(next);
    setQuery(next);
    if (!next) return;
    const nextHistory = [next, ...history.filter((item) => item.toLowerCase() !== next.toLowerCase())].slice(0, 8);
    setHistory(nextHistory);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  }

  function clearHistory() {
    setHistory([]);
    window.localStorage.removeItem(HISTORY_KEY);
  }

  function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVisualStatus("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    setListening(true);
    recognition.onresult = (event) => commitSearch(event.results[0][0].transcript);
    recognition.onerror = () => setVisualStatus("We could not hear that. Please try again.");
    recognition.onend = () => setListening(false);
    recognition.start();
  }

  function useVisualSearch(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const inferred = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    setVisualStatus(`Image received: ${file.name}. Showing visually related products.`);
    commitSearch(inferred.length > 2 ? inferred : "fashion");
    event.target.value = "";
  }

  const recommendations = catalog.slice(0, 4);

  return (
    <main className="real-page search-discovery">
      <header className="search-page-heading"><span>Search MarketSphere</span><h1>Find exactly what you have in mind</h1><p>Search products, categories, brands and curated stores from one place.</p></header>

      <form className="discovery-search" onSubmit={(event) => { event.preventDefault(); commitSearch(draft); }}>
        <Search size={21} />
        <input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Try 'linen dress', 'Nike' or 'Sole Society'" aria-label="Search MarketSphere" />
        {draft && <button type="button" aria-label="Clear search" onClick={() => { setDraft(""); setQuery(""); }}><X size={18} /></button>}
        <button className={listening ? "active" : ""} type="button" aria-label="Voice search" title="Voice search" onClick={startVoiceSearch}><Mic size={19} /></button>
        <button type="button" aria-label="Search by barcode or QR code" title="Barcode or QR search" onClick={() => fileInput.current?.click()}><QrCode size={19} /></button>
        <button type="button" aria-label="Search with an image" title="Image search" onClick={() => fileInput.current?.click()}><Camera size={19} /></button>
        <button className="search-submit" type="submit">Search</button>
        <input ref={fileInput} className="sr-only" type="file" accept="image/*" capture="environment" onChange={useVisualSearch} />
      </form>

      {visualStatus && <div className="search-status" role="status"><Image size={16} /><span>{visualStatus}</span><button onClick={() => setVisualStatus("")} aria-label="Dismiss"><X size={14} /></button></div>}

      {draft && suggestions.length > 0 && draft !== query && <section className="search-suggestions" aria-label="Search suggestions">{suggestions.map((item) => <button type="button" onClick={() => commitSearch(item.label)} key={`${item.type}-${item.label}`}><Search size={14} /><span>{item.label}</span><small>{item.type}</small><ChevronRight size={14} /></button>)}</section>}

      {!normalized && <section className="search-start">
        {history.length > 0 && <div className="search-chip-group"><div className="search-subheading"><h2><Clock3 size={16} /> Recent searches</h2><button onClick={clearHistory}><Trash2 size={14} /> Clear history</button></div><div>{history.map((item) => <button onClick={() => commitSearch(item)} key={item}><History size={13} /> {item}</button>)}</div></div>}
        <div className="search-chip-group"><div className="search-subheading"><h2>Popular right now</h2></div><div>{popularSearches.map((item) => <button onClick={() => commitSearch(item)} key={item}>{item}</button>)}</div></div>
      </section>}

      <nav className="search-type-tabs" aria-label="Search result type">{["All", "Products", "Categories", "Brands", "Stores"].map((type) => <button className={activeType === type ? "active" : ""} onClick={() => setActiveType(type)} key={type}>{type}</button>)}</nav>

      <section className="search-results-heading"><div><span>{normalized ? `${results.length} matches` : "Explore the catalog"}</span><h2>{normalized ? `Results for "${draft}"` : "Recommended products"}</h2></div>{activeType === "Stores" && <Store size={22} />}</section>

      {results.length > 0 ? <div className="real-grid">{results.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.name} />)}</div> : <section className="search-no-results"><Search size={28} /><h2>No exact matches found</h2><p>Check the spelling, try a broader term, or browse these popular picks.</p><button className="secondary" onClick={() => { setDraft(""); setQuery(""); setActiveType("All"); }}>Clear search</button><div className="real-grid">{recommendations.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.name} />)}</div><Link to="/products">Browse all products <ChevronRight size={14} /></Link></section>}
    </main>
  );
}
