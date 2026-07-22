import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { deals } from "../data/shopData";
import BenefitRow from "../components/common/BenefitRow";
import SectionTitle from "../components/common/SectionTitle";
import ProductCard from "../components/product/ProductCard";
import ProductDetail from "../components/product/ProductDetail";
import ReviewsAndBundles from "../components/product/ReviewsAndBundles";
import { useShop } from "../context/ShopContext";

export default function ProductPage() {
  const { addToCart, toggleWishlist } = useShop();

  return (
    <main className="desktop-page product-page real-product-page">
      <ProductDetail />
      <BenefitRow />
      <ReviewsAndBundles />
      <SectionTitle title="You May Also Like" action={<SlidersHorizontal size={16} />} />
      <div className="product-grid compact">{deals.slice(0, 5).map((p) => <ProductCard product={p} onAdd={addToCart} onWishlist={toggleWishlist} key={p.name} />)}</div>
    </main>
  );
}
