import React from "react";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { categories } from "../data/shopData";
import { useShop } from "../context/ShopContext";

export default function ListingPage() {
  const { activeCategory, addToCart, priceLimit, products, setActiveCategory, setPriceLimit, setSortBy, sortBy, toggleWishlist } = useShop();

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
        <div className="page-heading"><div><p>{products.length} products</p><h1>{activeCategory === "All" ? "Shop all" : activeCategory}</h1></div><label className="sort-control"><SlidersHorizontal size={15} /><span>Sort by</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div>
        {products.length ? <div className="real-grid">{products.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.id} />)}</div> : <div className="empty-state">No products match these filters</div>}
      </section>
    </main>
  );
}
