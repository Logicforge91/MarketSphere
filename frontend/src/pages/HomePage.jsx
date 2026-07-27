import React, { useMemo } from "react";
import {
  BenefitStrip,
  BrandStrip,
  CategoryGrid,
  DealOfTheDay,
  FeaturedStores,
  FlashSale,
  Newsletter,
  PersonalizedEdit,
  PersonalizedOffers,
  ProductShelf,
  SaleBanner,
  ShopTheLook,
  SocialGallery,
  StorefrontHero,
  Testimonials,
  TrendingStories,
} from "../components/home/StorefrontSections";
import { brands, categories, deals, mobileProducts, shoeProducts, trending } from "../data/shopData";
import { useShop } from "../context/ShopContext";

export default function HomePage() {
  const { addToCart, toggleWishlist } = useShop();
  const arrivals = useMemo(() => [...deals, ...shoeProducts].slice(0, 4), []);

  return (
    <main className="velora-home">
      <StorefrontHero />
      <BenefitStrip />
      <CategoryGrid categories={categories} />
      <FlashSale products={deals} onAdd={addToCart} onWishlist={toggleWishlist} />
      <DealOfTheDay product={deals[1]} onAdd={addToCart} />
      <ProductShelf title="Featured products" products={mobileProducts} onAdd={addToCart} onWishlist={toggleWishlist} />
      <PersonalizedEdit products={[...deals, ...trending]} onAdd={addToCart} onWishlist={toggleWishlist} />
      <TrendingStories />
      <ProductShelf title="Trending products" products={trending.slice(0, 4)} onAdd={addToCart} onWishlist={toggleWishlist} />
      <ProductShelf title="New arrivals" products={arrivals} onAdd={addToCart} onWishlist={toggleWishlist} />
      <PersonalizedOffers />
      <BrandStrip brands={brands} />
      <FeaturedStores />
      <SaleBanner />
      <ProductShelf title="Best sellers" products={trending.slice(0, 4)} onAdd={addToCart} onWishlist={toggleWishlist} />
      <ProductShelf title="Limited-time deals" products={deals.slice(2, 6)} onAdd={addToCart} onWishlist={toggleWishlist} />
      <ProductShelf title="Recently viewed" products={[deals[0], trending[2], shoeProducts[0], deals[3]]} onAdd={addToCart} onWishlist={toggleWishlist} />
      <ShopTheLook products={deals.slice(1, 3)} onAdd={addToCart} onWishlist={toggleWishlist} />
      <Testimonials />
      <SocialGallery />
      <Newsletter />
    </main>
  );
}
