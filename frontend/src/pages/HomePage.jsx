import React from "react";
import { brands, deals, trending } from "../data/shopData";
import BenefitRow from "../components/common/BenefitRow";
import SectionTitle from "../components/common/SectionTitle";
import CategoryRail from "../components/home/CategoryRail";
import Hero from "../components/home/Hero";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ProductCard from "../components/product/ProductCard";

export default function HomePage() {
  return (
    <div className="desktop-page">
      <Header />
      <div className="layout">
        <Sidebar />
        <div className="content">
          <Hero />
          <BenefitRow />
          <CategoryRail />
          <SectionTitle title="Flash Deals" action="View All Deals" />
          <div className="product-grid">{deals.map((p) => <ProductCard product={p} key={p.name} />)}</div>
          <SectionTitle title="Trending Now" action="View All" />
          <div className="trend-grid">{trending.map((p) => <ProductCard product={p} key={p.name} />)}</div>
          <SectionTitle title="Top Brands" action="View All Brands" />
          <div className="brand-grid">{brands.map((b) => <strong key={b}>{b}</strong>)}</div>
        </div>
      </div>
    </div>
  );
}
