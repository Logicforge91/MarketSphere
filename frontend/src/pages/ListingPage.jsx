import React from "react";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { categories } from "../data/shopData";
import { useShop } from "../context/ShopContext";

export default function ListingPage() {
  const { activeCategory, addToCart, priceLimit, products, setActiveCategory, setPriceLimit, toggleWishlist } = useShop();

  return (
    <main className="real-page two-pane-page">
      <aside className="filter-sidebar">
        <h2>Filters</h2>
        <label>Category</label>
        <button className={activeCategory === "All" ? "selected" : ""} onClick={() => setActiveCategory("All")}>All Products</button>
        {categories.map(({ name }) => <button className={activeCategory === name ? "selected" : ""} onClick={() => setActiveCategory(name)} key={name}>{name}</button>)}
        <label>Max Price: {priceLimit}</label>
        <input type="range" min="1000" max="80000" value={priceLimit} onChange={(event) => setPriceLimit(Number(event.target.value))} />
      </aside>
      <section>
        <div className="page-heading"><div><p>Shop products</p><h1>Categories & Listing</h1></div><button className="secondary"><SlidersHorizontal size={16} /> Sort</button></div>
        <div className="real-grid">{products.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.name} />)}</div>
      </section>
    </main>
  );
}
