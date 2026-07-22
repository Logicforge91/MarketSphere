import React from "react";
import { Search } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { useShop } from "../context/ShopContext";

export default function SearchPage() {
  const { addToCart, products, query, setQuery, toggleWishlist } = useShop();

  return (
    <main className="real-page">
      <div className="page-heading"><div><p>Search Results</p><h1>{query ? `Results for "${query}"` : "Search products"}</h1></div></div>
      <label className="large-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sneakers, phones, headphones..." /></label>
      {products.length ? <div className="real-grid">{products.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.name} />)}</div> : <div className="empty-state">No products found</div>}
    </main>
  );
}
