import React from "react";
import { heroProducts } from "../../data/shopData";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p>Big Saving Days Live</p>
        <h1>India&apos;s favourite deals up to <span>70% Off</span></h1>
        <small>Mobiles, fashion, appliances and daily essentials with UPI offers, EMI and fast delivery.</small>
        <div>
          <button className="primary">Shop Sale</button>
          <button className="secondary">View Offers</button>
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
