import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, Instagram, Mail, Quote, Store, Tag } from "lucide-react";
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
      <img src={slide.image} style={{ objectPosition: slide.imagePosition }} alt={`${slide.title} ${slide.offer}`} width="1200" height="720" fetchPriority="high" />
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

function useCountdown(hours = 8) {
  const [seconds, setSeconds] = useState(hours * 3600 + 23 * 60 + 42);
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value > 0 ? value - 1 : hours * 3600), 1000);
    return () => window.clearInterval(timer);
  }, [hours]);
  const pad = (value) => String(value).padStart(2, "0");
  return { hours: pad(Math.floor(seconds / 3600)), minutes: pad(Math.floor((seconds % 3600) / 60)), seconds: pad(seconds % 60) };
}

export function FlashSale({ products, onAdd, onWishlist }) {
  const countdown = useCountdown(5);
  return (
    <section className="home-sale-section">
      <div className="sale-section-heading">
        <div><span><Tag size={14} /> Flash sale</span><h2>Prices dropping now</h2></div>
        <div className="sale-countdown"><small>Ends in</small><b>{countdown.hours}</b><i>:</i><b>{countdown.minutes}</b><i>:</i><b>{countdown.seconds}</b></div>
      </div>
      <div className="velora-product-grid">{products.slice(0, 4).map((product) => <ProductCard product={product} onAdd={onAdd} onWishlist={onWishlist} key={product.name} />)}</div>
    </section>
  );
}

export function DealOfTheDay({ product, onAdd }) {
  const countdown = useCountdown(11);
  return (
    <section className="daily-deal">
      <img src={product.image} alt={product.name} loading="lazy" />
      <div><span>Deal of the day</span><h2>{product.name}</h2><p>A standout MarketSphere pick at its best price today. Limited quantities available.</p><div className="daily-deal-price"><strong>Rs. {product.price.toLocaleString("en-IN")}</strong><del>Rs. {product.oldPrice.toLocaleString("en-IN")}</del></div><div className="compact-countdown"><Clock3 size={15} /> {countdown.hours}:{countdown.minutes}:{countdown.seconds} remaining</div><button className="primary" type="button" onClick={() => onAdd(product)}>Add to bag</button></div>
    </section>
  );
}

const storeData = [
  { name: "The Modern Wardrobe", category: "Contemporary fashion", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=700&q=80" },
  { name: "Sole Society", category: "Sneakers and footwear", image: "https://images.unsplash.com/photo-1555529771-35a38bb54c3f?auto=format&fit=crop&w=700&q=80" },
  { name: "The Beauty Room", category: "Skin, scent and colour", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9f?auto=format&fit=crop&w=700&q=80" },
];

export function FeaturedStores() {
  return <section className="velora-section"><SectionHeading title="Featured stores" action="Explore stores" /><div className="featured-stores">{storeData.map((item) => <Link to="/products" key={item.name}><img src={item.image} alt="" loading="lazy" /><div><Store size={17} /><span>{item.category}</span><h3>{item.name}</h3><small>Visit store <ArrowRight size={13} /></small></div></Link>)}</div></section>;
}

export function PersonalizedOffers() {
  return <section className="personal-offers" aria-labelledby="personal-offers-title"><div><span>Just for you</span><h2 id="personal-offers-title">More value, matched to your shop</h2><p>Sign in to unlock member pricing and offers shaped by your favourite categories.</p></div><div className="offer-coupons"><article><strong>20% off</strong><span>Fashion first order</span><small>Code: HELLO20</small></article><article><strong>Rs. 500 back</strong><span>On your next UPI order</span><small>Minimum spend applies</small></article></div><Link className="secondary" to="/login">Unlock my offers</Link></section>;
}

const testimonials = [
  { quote: "The recommendations feel genuinely useful, and my order arrived earlier than promised.", name: "Ananya Mehta", detail: "Verified customer, Mumbai" },
  { quote: "Easy returns and clear tracking make MarketSphere my first stop for everyday fashion.", name: "Rhea Kapoor", detail: "Member since 2024" },
  { quote: "I found three independent labels I had never seen elsewhere. The curation is excellent.", name: "Ishita Rao", detail: "Verified customer, Bengaluru" },
];

export function Testimonials() {
  return <section className="velora-section testimonials-section"><SectionHeading title="Loved by our customers" action="Our story" to="/about" /><div className="testimonial-grid">{testimonials.map((item) => <article key={item.name}><Quote size={22} /><p>{item.quote}</p><strong>{item.name}</strong><small>{item.detail}</small></article>)}</div></section>;
}

const editOptions = {
  "Everyday": { copy: "Relaxed pieces that work from coffee runs to late plans.", offset: 0 },
  "Work": { copy: "Polished layers and modern tailoring for days in motion.", offset: 1 },
  "Occasion": { copy: "Statement silhouettes selected for your next invitation.", offset: 2 },
};

export function PersonalizedEdit({ products, onAdd, onWishlist }) {
  const [preference, setPreference] = useState("Everyday");
  const selected = editOptions[preference];
  const recommendations = [...products.slice(selected.offset), ...products.slice(0, selected.offset)].slice(0, 4);

  return (
    <section className="personalized-edit" aria-labelledby="personalized-edit-title">
      <div className="personalized-edit-heading">
        <div><span>Curated for you</span><h2 id="personalized-edit-title">Build your edit</h2><p>{selected.copy}</p></div>
        <div className="preference-control" aria-label="Choose an occasion">
          {Object.keys(editOptions).map((option) => <button type="button" className={preference === option ? "active" : ""} aria-pressed={preference === option} onClick={() => setPreference(option)} key={option}>{option}</button>)}
        </div>
      </div>
      <div className="velora-product-grid">
        {recommendations.map((product) => <ProductCard product={product} onAdd={onAdd} onWishlist={onWishlist} key={product.name} />)}
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
