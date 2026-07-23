import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Grid2X2, List, SlidersHorizontal, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { catalog } from "../data/catalog";
import { brands } from "../data/shopData";
import { useShop } from "../context/ShopContext";

const PAGE_SIZE = 8;
const sellers = ["MarketSphere Select", "The Modern Wardrobe", "Sole Society", "The Beauty Room"];
const collections = ["Everyday Edit", "Workwear Refresh", "Weekend Ready", "Occasion Icons"];
const subcategories = {
  Women: ["Dresses", "Tops", "Bottoms"],
  Men: ["Jackets", "Shirts", "Essentials"],
  Bags: ["Shoulder Bags", "Totes", "Day Bags"],
  Shoes: ["Sneakers", "Running", "Lifestyle"],
  Accessories: ["Watches", "Jewellery", "Small Accessories"],
  Beauty: ["Fragrance", "Makeup", "Skincare"],
};

function enrichProduct(product, index) {
  return {
    ...product,
    brand: brands[index % brands.length],
    collection: collections[index % collections.length],
    isBestSeller: product.rating >= 4.7,
    isDeal: Boolean(product.discount) || product.oldPrice > product.price * 1.2,
    isNew: index % 3 === 0,
    seller: sellers[index % sellers.length],
    subcategory: subcategories[product.category]?.[index % (subcategories[product.category]?.length || 1)] || "Featured",
  };
}

const discoveryCatalog = catalog.map(enrichProduct);

export default function ListingPage() {
  const { addToCart, toggleWishlist } = useShop();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState("grid");
  const [loadMode, setLoadMode] = useState("pages");
  const [page, setPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [priceLimit, setPriceLimit] = useState(80000);
  const [sortBy, setSortBy] = useState("featured");
  const loadMarker = useRef(null);

  const mode = params.get("mode") || "all";
  const category = params.get("category") || "All";
  const subcategory = params.get("subcategory") || "All";
  const brand = params.get("brand") || "All";
  const seller = params.get("seller") || "All";
  const collection = params.get("collection") || "All";

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "All" || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const setCategory = (value) => {
    const next = new URLSearchParams(params);
    next.delete("subcategory");
    if (value === "All") next.delete("category");
    else next.set("category", value);
    setParams(next);
  };

  const products = useMemo(() => {
    const filtered = discoveryCatalog.filter((product) => {
      if (category !== "All" && product.category !== category) return false;
      if (subcategory !== "All" && product.subcategory !== subcategory) return false;
      if (brand !== "All" && product.brand !== brand) return false;
      if (seller !== "All" && product.seller !== seller) return false;
      if (collection !== "All" && product.collection !== collection) return false;
      if (product.price > priceLimit) return false;
      if (mode === "deals" && !product.isDeal) return false;
      if (mode === "new" && !product.isNew) return false;
      if (mode === "best" && !product.isBestSeller) return false;
      if (mode === "recommended" && product.rating < 4.6) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return Number(b.isNew) - Number(a.isNew);
      return Number(b.isBestSeller) - Number(a.isBestSeller);
    });
  }, [brand, category, collection, mode, priceLimit, seller, sortBy, subcategory]);

  useEffect(() => {
    setPage(1);
    setVisibleCount(PAGE_SIZE);
  }, [brand, category, collection, loadMode, mode, priceLimit, seller, sortBy, subcategory]);

  useEffect(() => {
    if (loadMode !== "infinite" || !loadMarker.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + PAGE_SIZE, products.length));
    }, { rootMargin: "200px" });
    observer.observe(loadMarker.current);
    return () => observer.disconnect();
  }, [loadMode, products.length, visibleCount]);

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visibleProducts = loadMode === "infinite" ? products.slice(0, visibleCount) : products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const title = mode === "deals" ? "Deals and offers" : mode === "new" ? "New arrivals" : mode === "best" ? "Best sellers" : mode === "recommended" ? "Recommended for you" : category === "All" ? "All products" : category;

  return (
    <main className="real-page discovery-page">
      <nav className="discovery-modes" aria-label="Product collections">
        {[["all", "All products"], ["new", "New arrivals"], ["best", "Best sellers"], ["deals", "Deals"], ["recommended", "Recommended"]].map(([value, label]) => <button className={mode === value ? "active" : ""} onClick={() => setFilter("mode", value)} key={value}>{label}</button>)}
      </nav>

      <div className="discovery-layout">
        <aside className="discovery-filters">
          <div className="filter-title"><SlidersHorizontal size={16} /><h2>Filters</h2><button onClick={() => setParams({})}>Reset</button></div>
          <FilterGroup title="Category" value={category} options={["All", ...Object.keys(subcategories)]} onChange={setCategory} />
          {category !== "All" && <FilterGroup title="Subcategory" value={subcategory} options={["All", ...subcategories[category]]} onChange={(value) => setFilter("subcategory", value)} />}
          <FilterGroup title="Brand" value={brand} options={["All", ...brands]} onChange={(value) => setFilter("brand", value)} />
          <FilterGroup title="Seller" value={seller} options={["All", ...sellers]} onChange={(value) => setFilter("seller", value)} />
          <FilterGroup title="Collection" value={collection} options={["All", ...collections]} onChange={(value) => setFilter("collection", value)} />
          <div className="filter-range"><label htmlFor="listing-price">Price up to <strong>Rs. {priceLimit.toLocaleString("en-IN")}</strong></label><input id="listing-price" type="range" min="2000" max="80000" step="1000" value={priceLimit} onChange={(event) => setPriceLimit(Number(event.target.value))} /></div>
        </aside>

        <section className="discovery-results">
          <header className="discovery-heading">
            <div><span>{products.length} products</span><h1>{title}</h1>{subcategory !== "All" && <p>{subcategory}</p>}</div>
            <div className="discovery-controls">
              <label><span>Sort</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
              <div className="view-switch" aria-label="Product view"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} title="Grid view"><Grid2X2 size={16} /></button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} title="List view"><List size={17} /></button></div>
            </div>
          </header>

          <div className="active-filters">{[category, subcategory, brand, seller, collection].filter((value) => value !== "All").map((value) => <span key={value}>{value}</span>)}</div>

          {visibleProducts.length ? <div className={`real-grid discovery-products ${view === "list" ? "list-view" : ""}`}>{visibleProducts.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.id} />)}</div> : <div className="discovery-empty"><Sparkles /><h2>No products match these filters</h2><p>Reset the filters to explore the full collection.</p><button className="secondary" onClick={() => setParams({})}>Reset filters</button></div>}

          {products.length > PAGE_SIZE && <footer className="listing-navigation">
            <div className="load-mode"><button className={loadMode === "pages" ? "active" : ""} onClick={() => setLoadMode("pages")}>Pages</button><button className={loadMode === "infinite" ? "active" : ""} onClick={() => setLoadMode("infinite")}>Continuous</button></div>
            {loadMode === "pages" ? <nav aria-label="Pagination"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={15} /></button>{Array.from({ length: pageCount }, (_, index) => <button className={page === index + 1 ? "active" : ""} onClick={() => setPage(index + 1)} key={index + 1}>{index + 1}</button>)}<button disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}><ChevronRight size={15} /></button></nav> : <div ref={loadMarker} className="infinite-marker">{visibleCount < products.length ? "Loading more products..." : "You have reached the end"}</div>}
          </footer>}
        </section>
      </div>
    </main>
  );
}

function FilterGroup({ title, value, options, onChange }) {
  return <fieldset className="filter-group"><legend>{title}</legend>{options.map((option) => <label key={option}><input type="radio" checked={value === option} onChange={() => onChange(option)} /><span>{option}</span></label>)}</fieldset>;
}
