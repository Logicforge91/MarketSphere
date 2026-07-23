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
const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["Black", "White", "Blue", "Red", "Neutral"];
const materials = ["Cotton", "Linen", "Leather", "Denim", "Synthetic"];
const styles = ["Casual", "Formal", "Sport", "Occasion"];
const subcategories = {
  Women: ["Dresses", "Tops", "Bottoms"],
  Men: ["Jackets", "Shirts", "Essentials"],
  Bags: ["Shoulder Bags", "Totes", "Day Bags"],
  Shoes: ["Sneakers", "Running", "Lifestyle"],
  Accessories: ["Watches", "Jewellery", "Small Accessories"],
  Beauty: ["Fragrance", "Makeup", "Skincare"],
};

function enrichProduct(product, index) {
  const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  return {
    ...product,
    brand: brands[index % brands.length],
    collection: collections[index % collections.length],
    isBestSeller: product.rating >= 4.7,
    isDeal: Boolean(product.discount) || product.oldPrice > product.price * 1.2,
    isNew: index % 3 === 0,
    availability: index % 5 === 0 ? "Limited stock" : "In stock",
    cashOnDelivery: index % 4 !== 0,
    color: colors[index % colors.length],
    deliveryZones: index % 3 === 0 ? ["400001", "560001"] : ["400001", "560001", "110001", "600001"],
    discountPercent,
    freeShipping: product.price >= 4000,
    gender: product.category === "Men" ? "Men" : product.category === "Women" ? "Women" : "Unisex",
    material: materials[index % materials.length],
    popularity: 9200 - index * 317,
    sizes: sizes.slice(index % 2, 4 + (index % 2)),
    soldCount: 4100 - index * 113,
    style: styles[index % styles.length],
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
  const [priceRange, setPriceRange] = useState([0, 80000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [facets, setFacets] = useState({
    availability: [],
    cod: false,
    colors: [],
    delivery: "",
    discount: 0,
    freeShipping: false,
    genders: [],
    materials: [],
    rating: 0,
    sizes: [],
    styles: [],
  });
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

  const toggleFacet = (key, value) => {
    setFacets((current) => {
      const values = current[key];
      return { ...current, [key]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value] };
    });
  };

  const resetFilters = () => {
    setParams({});
    setPriceRange([0, 80000]);
    setFacets({ availability: [], cod: false, colors: [], delivery: "", discount: 0, freeShipping: false, genders: [], materials: [], rating: 0, sizes: [], styles: [] });
  };

  const products = useMemo(() => {
    const filtered = discoveryCatalog.filter((product) => {
      if (category !== "All" && product.category !== category) return false;
      if (subcategory !== "All" && product.subcategory !== subcategory) return false;
      if (brand !== "All" && product.brand !== brand) return false;
      if (seller !== "All" && product.seller !== seller) return false;
      if (collection !== "All" && product.collection !== collection) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (product.discountPercent < facets.discount || product.rating < facets.rating) return false;
      if (facets.availability.length && !facets.availability.includes(product.availability)) return false;
      if (facets.sizes.length && !facets.sizes.some((size) => product.sizes.includes(size))) return false;
      if (facets.colors.length && !facets.colors.includes(product.color)) return false;
      if (facets.materials.length && !facets.materials.includes(product.material)) return false;
      if (facets.genders.length && !facets.genders.includes(product.gender)) return false;
      if (facets.styles.length && !facets.styles.includes(product.style)) return false;
      if (facets.delivery.length === 6 && !product.deliveryZones.includes(facets.delivery)) return false;
      if (facets.cod && !product.cashOnDelivery) return false;
      if (facets.freeShipping && !product.freeShipping) return false;
      if (mode === "deals" && !product.isDeal) return false;
      if (mode === "new" && !product.isNew) return false;
      if (mode === "best" && !product.isBestSeller) return false;
      if (mode === "recommended" && product.rating < 4.6) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "latest") return Number(b.isNew) - Number(a.isNew);
      if (sortBy === "discount") return b.discountPercent - a.discountPercent;
      if (sortBy === "rated") return b.rating - a.rating;
      if (sortBy === "popularity") return b.popularity - a.popularity;
      if (sortBy === "best-selling") return b.soldCount - a.soldCount;
      return Number(b.isBestSeller) - Number(a.isBestSeller) || b.rating - a.rating;
    });
  }, [brand, category, collection, facets, mode, priceRange, seller, sortBy, subcategory]);

  useEffect(() => {
    setPage(1);
    setVisibleCount(PAGE_SIZE);
  }, [brand, category, collection, facets, loadMode, mode, priceRange, seller, sortBy, subcategory]);

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
          <div className="filter-title"><SlidersHorizontal size={16} /><h2>Filters</h2><button onClick={resetFilters}>Reset</button></div>
          <FilterGroup title="Category" value={category} options={["All", ...Object.keys(subcategories)]} onChange={setCategory} />
          {category !== "All" && <FilterGroup title="Subcategory" value={subcategory} options={["All", ...subcategories[category]]} onChange={(value) => setFilter("subcategory", value)} />}
          <FilterGroup title="Brand" value={brand} options={["All", ...brands]} onChange={(value) => setFilter("brand", value)} />
          <FilterGroup title="Seller" value={seller} options={["All", ...sellers]} onChange={(value) => setFilter("seller", value)} />
          <FilterGroup title="Collection" value={collection} options={["All", ...collections]} onChange={(value) => setFilter("collection", value)} />
          <div className="filter-range"><label>Price range <strong>Rs. {priceRange[0].toLocaleString("en-IN")} - {priceRange[1].toLocaleString("en-IN")}</strong></label><div className="price-inputs"><input aria-label="Minimum price" type="number" min="0" max={priceRange[1]} step="500" value={priceRange[0]} onChange={(event) => setPriceRange([Number(event.target.value), priceRange[1]])} /><input aria-label="Maximum price" type="number" min={priceRange[0]} max="80000" step="500" value={priceRange[1]} onChange={(event) => setPriceRange([priceRange[0], Number(event.target.value)])} /></div></div>
          <SelectFilter title="Minimum discount" value={facets.discount} options={[[0, "Any discount"], [10, "10% and above"], [20, "20% and above"], [30, "30% and above"]]} onChange={(discount) => setFacets({ ...facets, discount })} />
          <SelectFilter title="Customer rating" value={facets.rating} options={[[0, "Any rating"], [4, "4 stars and above"], [4.5, "4.5 stars and above"]]} onChange={(rating) => setFacets({ ...facets, rating })} />
          <CheckFilter title="Availability" values={facets.availability} options={["In stock", "Limited stock"]} onChange={(value) => toggleFacet("availability", value)} />
          <CheckFilter title="Size" values={facets.sizes} options={sizes} onChange={(value) => toggleFacet("sizes", value)} />
          <CheckFilter title="Color" values={facets.colors} options={colors} onChange={(value) => toggleFacet("colors", value)} swatches />
          <CheckFilter title="Material" values={facets.materials} options={materials} onChange={(value) => toggleFacet("materials", value)} />
          <CheckFilter title="Gender" values={facets.genders} options={["Women", "Men", "Unisex"]} onChange={(value) => toggleFacet("genders", value)} />
          <CheckFilter title="Product style" values={facets.styles} options={styles} onChange={(value) => toggleFacet("styles", value)} />
          <fieldset className="filter-group commerce-filters"><legend>Delivery and payment</legend><label><input type="checkbox" checked={facets.cod} onChange={(event) => setFacets({ ...facets, cod: event.target.checked })} /><span>Cash on delivery</span></label><label><input type="checkbox" checked={facets.freeShipping} onChange={(event) => setFacets({ ...facets, freeShipping: event.target.checked })} /><span>Free shipping</span></label><input className="delivery-input" inputMode="numeric" maxLength="6" value={facets.delivery} onChange={(event) => setFacets({ ...facets, delivery: event.target.value.replace(/\D/g, "") })} placeholder="Delivery PIN code" /></fieldset>
        </aside>

        <section className="discovery-results">
          <header className="discovery-heading">
            <div><span>{products.length} products</span><h1>{title}</h1>{subcategory !== "All" && <p>{subcategory}</p>}</div>
            <div className="discovery-controls">
              <label><span>Sort</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="relevance">Relevance</option><option value="popularity">Popularity</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="latest">Latest products</option><option value="discount">Highest discount</option><option value="rated">Highest rated</option><option value="best-selling">Best selling</option></select></label>
              <div className="view-switch" aria-label="Product view"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} title="Grid view"><Grid2X2 size={16} /></button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} title="List view"><List size={17} /></button></div>
            </div>
          </header>

          <div className="active-filters">{[category, subcategory, brand, seller, collection, ...facets.availability, ...facets.sizes, ...facets.colors, ...facets.materials, ...facets.genders, ...facets.styles].filter((value) => value !== "All").map((value) => <span key={value}>{value}</span>)}</div>

          {visibleProducts.length ? <div className={`real-grid discovery-products ${view === "list" ? "list-view" : ""}`}>{visibleProducts.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.id} />)}</div> : <div className="discovery-empty"><Sparkles /><h2>No products match these filters</h2><p>Reset the filters to explore the full collection.</p><button className="secondary" onClick={resetFilters}>Reset filters</button></div>}

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

function CheckFilter({ title, values, options, onChange, swatches = false }) {
  return <fieldset className="filter-group"><legend>{title}</legend>{options.map((option) => <label key={option}><input type="checkbox" checked={values.includes(option)} onChange={() => onChange(option)} />{swatches && <i className={`filter-swatch ${option.toLowerCase()}`} />}<span>{option}</span></label>)}</fieldset>;
}

function SelectFilter({ title, value, options, onChange }) {
  return <div className="filter-select"><label>{title}</label><select value={value} onChange={(event) => onChange(Number(event.target.value))}>{options.map(([option, label]) => <option value={option} key={option}>{label}</option>)}</select></div>;
}
