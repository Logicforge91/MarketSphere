import React from "react";
import { brands, deals, indianOffers, mobileProducts, shoeProducts, trending } from "../data/shopData";
import BenefitRow from "../components/common/BenefitRow";
import SectionTitle from "../components/common/SectionTitle";
import CategoryRail from "../components/home/CategoryRail";
import Hero from "../components/home/Hero";
import HomeFooter from "../components/home/HomeFooter";
import PromoMosaic from "../components/home/PromoMosaic";
import StoreHighlights from "../components/home/StoreHighlights";
import ProductCard from "../components/product/ProductCard";
import { useShop } from "../context/ShopContext";

export default function HomePage() {
  const { addToCart, toggleWishlist } = useShop();

  return (
    <main className="desktop-page home-real">
      <CategoryRail />
      <Hero />
      <section className="bank-offers">
        {indianOffers.map((offer) => <article key={offer}>{offer}</article>)}
      </section>
      <PromoMosaic />
      <MarketShelf title="Deals of the Day" products={deals} onAdd={addToCart} onWishlist={toggleWishlist} />
      <section className="home-banner">
        <div>
          <p>Festive Store</p>
          <h2>Top phones, fashion and home essentials at prices made for India</h2>
          <button className="primary">Explore Sale</button>
        </div>
      </section>
      <MarketShelf title="Best Mobiles" products={mobileProducts} onAdd={addToCart} onWishlist={toggleWishlist} />
      <MarketShelf title="Footwear Picks" products={shoeProducts} onAdd={addToCart} onWishlist={toggleWishlist} />
      <MarketShelf title="Trending Now" products={trending} onAdd={addToCart} onWishlist={toggleWishlist} />
      <SectionTitle title="Top Brands" action="View All Brands" />
      <div className="brand-grid">{brands.map((b) => <strong key={b}>{b}</strong>)}</div>
      <BenefitRow />
      <StoreHighlights />
      <HomeFooter />
    </main>
  );
}

function MarketShelf({ title, products, onAdd, onWishlist }) {
  return (
    <section className="market-shelf">
      <SectionTitle title={title} action="View All" />
      <div className="shelf-scroll">
        {products.map((p) => <ProductCard product={p} onAdd={onAdd} onWishlist={onWishlist} key={p.name} />)}
      </div>
    </section>
  );
}
