import React from "react";
import { heroProducts } from "../../data/shopData";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p>New Collection</p>
        <h1>Upgrade Your Lifestyle Up to <span>60% Off</span></h1>
        <small>Discover top brands and latest products at unbeatable prices.</small>
        <div>
          <button className="primary">Shop Now</button>
          <button className="secondary">Explore Deals</button>
        </div>
      </div>
      <div className="hero-media">
        {heroProducts.map((product, index) => (
          <img className={`hero-img hero-img-${index}`} src={product.image} alt={product.title} key={product.title} />
        ))}
        <div className="badge">Best Deals</div>
      </div>
    </section>
  );
}
