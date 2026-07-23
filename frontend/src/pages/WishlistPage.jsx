import React from "react";
import ProductCard from "../components/product/ProductCard";
import { useShop } from "../context/ShopContext";

export default function WishlistPage() {
  const { addToCart, toggleWishlist, wishlist } = useShop();

  return (
    <main className="real-page">
      <div className="page-heading"><div><p>Saved Items</p><h1>Wishlist</h1></div></div>
      {wishlist.length ? <div className="real-grid">{wishlist.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.name} />)}</div> : <div className="empty-state">Wishlist is empty</div>}
    </main>
  );
}
