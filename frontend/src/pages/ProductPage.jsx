import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { deals } from "../data/shopData";
import BenefitRow from "../components/common/BenefitRow";
import SectionTitle from "../components/common/SectionTitle";
import Header from "../components/layout/Header";
import ProductCard from "../components/product/ProductCard";
import ProductDetail from "../components/product/ProductDetail";
import ReviewsAndBundles from "../components/product/ReviewsAndBundles";

export default function ProductPage() {
  return (
    <div className="desktop-page product-page">
      <Header />
      <ProductDetail />
      <BenefitRow />
      <ReviewsAndBundles />
      <SectionTitle title="You May Also Like" action={<SlidersHorizontal size={16} />} />
      <div className="product-grid compact">{deals.slice(0, 5).map((p) => <ProductCard product={p} key={p.name} />)}</div>
    </div>
  );
}
