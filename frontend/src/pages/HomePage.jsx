import React, { useMemo } from "react";
import HomeFooter from "../components/home/HomeFooter";
import {
  BenefitStrip,
  BrandStrip,
  CategoryGrid,
  Newsletter,
  ProductShelf,
  SaleBanner,
  ShopTheLook,
  SocialGallery,
  StorefrontHero,
  TrendingStories,
} from "../components/home/StorefrontSections";
import { brands, categories, deals, shoeProducts, trending } from "../data/shopData";
import { useShop } from "../context/ShopContext";

export default function HomePage() {
  const { addToCart, toggleWishlist } = useShop();
  const arrivals = useMemo(() => [...deals, ...shoeProducts].slice(0, 4), []);

  return (
    <main className="velora-home">
      <StorefrontHero />
      <BenefitStrip />
      <CategoryGrid categories={categories} />
      <ProductShelf title="New arrivals" products={arrivals} onAdd={addToCart} onWishlist={toggleWishlist} />
      <TrendingStories />
      <BrandStrip brands={brands} />
      <SaleBanner />
      <ProductShelf title="Best sellers" products={trending.slice(0, 4)} onAdd={addToCart} onWishlist={toggleWishlist} />
      <ShopTheLook products={deals.slice(1, 3)} onAdd={addToCart} onWishlist={toggleWishlist} />
      <SocialGallery />
      <Newsletter />
      <HomeFooter />
    </main>
  );
}
