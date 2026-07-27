import React, { useEffect } from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import BenefitRow from "../components/common/BenefitRow";
import SectionTitle from "../components/common/SectionTitle";
import ProductCard from "../components/product/ProductCard";
import ProductDetail from "../components/product/ProductDetail";
import ReviewsAndBundles from "../components/product/ReviewsAndBundles";
import { catalog, getProductBySlug } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import { getStored, setStored } from "../utils/storage";

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart, addToCompare, toggleWishlist } = useShop();
  const product = getProductBySlug(slug);

  useEffect(() => {
    if (!product) return;
    const history = getStored("marketsphere:recently-viewed", []);
    const previous = history.find((item) => item.slug === product.slug);
    const entry = { id: product.id, slug: product.slug, viewedAt: new Date().toISOString(), viewCount: (previous?.viewCount || 0) + 1 };
    setStored("marketsphere:recently-viewed", [entry, ...history.filter((item) => item.slug !== product.slug)].slice(0, 24));
    const sync = getStored("marketsphere:history-sync", null);
    if (sync?.enabled) setStored("marketsphere:history-sync", { ...sync, lastSyncedAt: new Date().toISOString() });
  }, [product]);

  if (!product) {
    return (
      <main className="product-not-found">
        <span>Product unavailable</span><h1>We could not find this item</h1><p>It may have sold out or moved to a new collection.</p>
        <Link className="primary" to="/products"><ArrowLeft size={16} /> Browse products</Link>
      </main>
    );
  }

  const recommendations = catalog
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 5);

  return (
    <main className="desktop-page product-page real-product-page">
      <ProductDetail product={product} onAdd={addToCart} onCompare={addToCompare} onWishlist={toggleWishlist} />
      <BenefitRow />
      <ReviewsAndBundles product={product} bundleProducts={catalog.filter((item) => item.slug !== product.slug).slice(0, 2)} onAdd={addToCart} />
      <SectionTitle title="You may also like" action={<SlidersHorizontal size={16} />} />
      <div className="product-grid compact">{recommendations.map((item) => <ProductCard product={item} onAdd={addToCart} onWishlist={toggleWishlist} key={item.id} />)}</div>
      <SectionTitle title="Similar products" action={<SlidersHorizontal size={16} />} />
      <div className="product-grid compact">{catalog.filter((item) => item.slug !== product.slug).slice(5, 10).map((item) => <ProductCard product={item} onAdd={addToCart} onWishlist={toggleWishlist} key={item.id} />)}</div>
    </main>
  );
}
