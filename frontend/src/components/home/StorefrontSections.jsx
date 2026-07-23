import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";
import { heroSlides, lookbookContent, saleContent, socialGallery, storefrontBenefits, trendStories } from "../../data/marketSphereContent";

export function SectionHeading({ title, action = "View all", to = "/products" }) {
  return (
    <div className="velora-section-heading">
      <h2>{title}</h2>
      <Link to={to}>{action} <ArrowRight size={14} /></Link>
    </div>
  );
}

export function StorefrontHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = heroSlides[activeSlide];

  function moveSlide(direction) {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  }

  return (
    <section className="velora-hero" aria-labelledby="storefront-hero-title">
      <div className="velora-hero-copy">
        <span>{slide.eyebrow}</span>
        <h1 id="storefront-hero-title">{slide.title}<br />{slide.offer}</h1>
        <p>{slide.description}</p>
        <Link to="/products">Shop now <ArrowRight size={15} /></Link>
      </div>
      <img src={slide.image} style={{ objectPosition: slide.imagePosition }} alt={`${slide.title} ${slide.offer}`} />
      <div className="hero-controls">
        <button type="button" aria-label="Previous campaign" onClick={() => moveSlide(-1)}><ArrowLeft size={16} /></button>
        <div className="hero-dots">
          {heroSlides.map((item, index) => <button type="button" className={index === activeSlide ? "active" : ""} aria-label={`Show ${item.eyebrow}`} aria-current={index === activeSlide} onClick={() => setActiveSlide(index)} key={item.eyebrow} />)}
        </div>
        <button type="button" aria-label="Next campaign" onClick={() => moveSlide(1)}><ArrowRight size={16} /></button>
      </div>
    </section>
  );
}

export function BenefitStrip() {
  return (
    <section className="velora-benefits" aria-label="Shopping benefits">
      {storefrontBenefits.map(({ title, detail, icon: Icon }) => (
        <article key={title}><Icon aria-hidden="true" /><div><strong>{title}</strong><span>{detail}</span></div></article>
      ))}
    </section>
  );
}

export function CategoryGrid({ categories }) {
  return (
    <section className="velora-section">
      <SectionHeading title="Shop by category" />
      <div className="velora-categories">
        {categories.slice(0, 6).map(({ name, image }) => (
          <Link to="/products" key={name}><span><img src={image} alt="" loading="lazy" /></span><strong>{name}</strong><small>Explore</small></Link>
        ))}
      </div>
    </section>
  );
}

export function ProductShelf({ title, products, onAdd, onWishlist }) {
  return (
    <section className="velora-section">
      <SectionHeading title={title} />
      <div className="velora-product-grid">
        {products.map((product) => <ProductCard product={product} onAdd={onAdd} onWishlist={onWishlist} key={product.name} />)}
      </div>
    </section>
  );
}

export function BrandStrip({ brands }) {
  return (
    <section className="velora-section">
      <SectionHeading title="Popular brands" />
      <div className="velora-brands">{brands.slice(0, 6).map((brand) => <strong key={brand}>{brand}</strong>)}</div>
    </section>
  );
}

export function TrendingStories() {
  return (
    <section className="velora-section">
      <SectionHeading title="Trending now" action="Explore trends" />
      <div className="velora-trend-grid">
        {trendStories.map((story, index) => (
          <article className={`${story.tone} ${index === 0 ? "featured" : ""}`} key={story.title}>
            <img src={story.image} alt={story.title} loading="lazy" />
            <div><span>{story.eyebrow}</span><h3>{story.title}</h3><p>{story.description}</p><Link to="/products">Shop the trend <ArrowRight size={14} /></Link></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ShopTheLook({ products, onAdd, onWishlist }) {
  return (
    <section className="velora-lookbook" aria-labelledby="lookbook-title">
      <div className="velora-lookbook-image">
        <img src={lookbookContent.image} alt="MarketSphere modern romance look" loading="lazy" />
        <div><span>{lookbookContent.eyebrow}</span><h2 id="lookbook-title">{lookbookContent.title}</h2><p>{lookbookContent.description}</p></div>
      </div>
      <div className="velora-lookbook-products">
        {products.slice(0, 2).map((product) => <ProductCard product={product} onAdd={onAdd} onWishlist={onWishlist} key={product.name} />)}
      </div>
    </section>
  );
}

export function SaleBanner() {
  return (
    <section className="velora-promo" aria-labelledby="sale-title">
      <div><span>{saleContent.eyebrow}</span><h2 id="sale-title">{saleContent.title}</h2><Link to="/products">Shop now</Link></div>
      <img src={saleContent.image} alt="MarketSphere summer sale collection" />
    </section>
  );
}

export function SocialGallery() {
  return (
    <section className="velora-section">
      <SectionHeading title="Instagram feeds" action="Follow us" to="/" />
      <div className="velora-instagram">
        {socialGallery.map(({ src, alt }) => <Link to="/products" key={src}><img src={src} alt={alt} loading="lazy" /><Instagram size={22} aria-hidden="true" /></Link>)}
      </div>
    </section>
  );
}

export function Newsletter() {
  const [status, setStatus] = useState("idle");

  function subscribe(event) {
    event.preventDefault();
    setStatus("subscribed");
  }

  return (
    <section className="velora-newsletter" aria-labelledby="newsletter-title">
      <div><Mail size={22} aria-hidden="true" /><div><strong id="newsletter-title">Newsletter</strong><span>{status === "subscribed" ? "You are on the list. Welcome to MarketSphere." : "Get 10% off your first order"}</span></div></div>
      <form onSubmit={subscribe}>
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input id="newsletter-email" type="email" autoComplete="email" required placeholder="Enter your email" />
        <button aria-label="Subscribe"><ArrowRight size={17} /></button>
      </form>
    </section>
  );
}
