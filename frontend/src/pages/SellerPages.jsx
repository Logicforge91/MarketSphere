import React, { useMemo, useState } from "react";
import { BadgeCheck, ChevronRight, Flag, Mail, MapPin, MessageCircle, PackageCheck, Phone, ShieldCheck, Star, Store, Truck, UserPlus } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { catalog } from "../data/catalog";
import { getSeller, sellerProducts, sellers } from "../data/sellerData";
import { money } from "../utils/format";
import { useShop } from "../context/ShopContext";

export function StoreProfilePage() {
  const { slug } = useParams();
  const seller = getSeller(slug);
  const products = sellerProducts(seller.slug);
  const { addToCart, toggleWishlist } = useShop();
  const [following, setFollowing] = useState(false);
  const [notice, setNotice] = useState("");

  return (
    <main className="seller-page real-page">
      <nav className="seller-breadcrumb"><Link to="/">Home</Link><ChevronRight size={13} /><span>Stores</span><ChevronRight size={13} /><strong>{seller.name}</strong></nav>
      <section className="seller-profile-hero">
        <img src={seller.image} alt={`${seller.name} storefront`} />
        <div className="seller-profile-copy"><div className="seller-logo"><Store /></div><span>{seller.category}</span><h1>{seller.name} {seller.verified && <BadgeCheck size={20} />}</h1><p>{seller.description}</p><div className="seller-metrics"><div><strong>{seller.rating}</strong><span><Star size={12} fill="currentColor" /> Seller rating</span></div><div><strong>{seller.reviewCount.toLocaleString()}</strong><span>Customer reviews</span></div><div><strong>{seller.followers}</strong><span>Followers</span></div></div><div className="seller-hero-actions"><button className={following ? "secondary" : "primary"} onClick={() => setFollowing((value) => !value)}><UserPlus size={15} /> {following ? "Following" : "Follow store"}</button><button className="secondary" onClick={() => setNotice("Message request opened")}><MessageCircle size={15} /> Contact seller</button><button className="icon-button" title="Report seller" onClick={() => setNotice("Report submitted for review")}><Flag size={16} /></button></div></div>
      </section>

      {notice && <p className="seller-notice" role="status">{notice}</p>}

      <section className="seller-trust-strip">
        <article><BadgeCheck /><div><strong>Verified seller</strong><span>Identity and business checked</span></div></article>
        <article><MapPin /><div><strong>{seller.location}</strong><span>Seller location</span></div></article>
        <article><MessageCircle /><div><strong>{seller.responseTime}</strong><span>Response time</span></div></article>
        <article><PackageCheck /><div><strong>{seller.deliveryDays}</strong><span>Typical delivery</span></div></article>
      </section>

      <section className="seller-info-grid">
        <article><h2>Store offers</h2>{seller.offers.map((offer) => <p key={offer}><BadgeCheck size={14} /> {offer}</p>)}</article>
        <article><h2>Seller policies</h2>{seller.policies.map((policy) => <p key={policy}><ShieldCheck size={14} /> {policy}</p>)}</article>
        <article><h2>Contact options</h2><p><MessageCircle size={14} /> MarketSphere secure chat</p><p><Mail size={14} /> Send an email request</p><p><Phone size={14} /> Request a callback</p></article>
      </section>

      <section className="seller-products-section"><div className="seller-section-heading"><div><span>Shop this store</span><h2>Products from {seller.name}</h2></div><Link to={`/products?seller=${encodeURIComponent(seller.name)}`}>View all <ChevronRight size={14} /></Link></div><div className="real-grid">{products.slice(0, 8).map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.id} />)}</div></section>

      <section className="seller-reviews"><div><span>Seller reviews</span><h2>What customers say</h2><strong>{seller.rating}<Star size={18} fill="currentColor" /></strong><p>{seller.reviewCount.toLocaleString()} ratings</p></div><div>{[["Reliable fulfilment", "Well packed and delivered within the promised window."], ["Helpful seller", "Quick response to my sizing question and an easy exchange."]].map(([title, copy]) => <article key={title}><strong>{title}</strong><div>{[1, 2, 3, 4, 5].map((item) => <Star size={12} fill="currentColor" key={item} />)}</div><p>{copy}</p><small>Verified buyer</small></article>)}</div></section>

      <Link className="seller-compare-cta" to={`/sellers/compare?product=${products[0].slug}`}><div><span>Compare before you buy</span><strong>See this product from multiple verified sellers</strong></div><ChevronRight /></Link>
    </main>
  );
}

export function SellerComparisonPage() {
  const [params] = useSearchParams();
  const product = catalog.find((item) => item.slug === params.get("product")) || catalog[0];
  const [pincode, setPincode] = useState("560102");
  const [sort, setSort] = useState("recommended");
  const { addToCart } = useShop();

  const comparisons = useMemo(() => sellers.map((seller, index) => ({
    seller,
    price: Math.round(product.price * seller.priceFactor),
    stock: index === 3 ? 4 : 12 - index,
    delivery: pincode.length === 6 ? seller.deliveryDays : "Enter PIN code",
  })).sort((a, b) => sort === "price" ? a.price - b.price : sort === "delivery" ? Number(a.delivery[0]) - Number(b.delivery[0]) : b.seller.rating - a.seller.rating), [pincode, product.price, sort]);

  return (
    <main className="seller-compare-page real-page">
      <header className="compare-heading"><div><span>Multiple seller comparison</span><h1>Choose the right seller</h1><p>Compare verified seller price, rating, shipping and delivery for the same product.</p></div><label>Delivery PIN<input inputMode="numeric" maxLength="6" value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, ""))} /></label></header>
      <section className="compare-product"><img src={product.image} alt={product.name} /><div><span>Comparing offers for</span><h2>{product.name}</h2><p>All offers include MarketSphere payment protection.</p></div><label>Sort sellers<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="price">Lowest price</option><option value="delivery">Fastest delivery</option></select></label></section>
      <div className="seller-comparison-table"><div className="comparison-header"><span>Seller</span><span>Price</span><span>Delivery</span><span>Shipping</span><span>Policy</span><span /></div>{comparisons.map(({ seller, price, stock, delivery }) => <article key={seller.slug}><div><Link to={`/store/${seller.slug}`}>{seller.name} {seller.verified && <BadgeCheck size={13} />}</Link><small><Star size={11} fill="currentColor" /> {seller.rating} · {seller.reviewCount.toLocaleString()} reviews</small></div><div><strong>{money(price)}</strong><small>{stock} in stock</small></div><div><strong><Truck size={13} /> {delivery}</strong><small>Order today</small></div><div><strong>{seller.shipping ? money(seller.shipping) : "Free"}</strong><small>{seller.shipping ? "Shipping charge" : "Included"}</small></div><div><strong>{seller.policies[0]}</strong><small>{seller.policies[1]}</small></div><button className="primary" onClick={() => addToCart({ ...product, price, seller: seller.name })}>Add to cart</button></article>)}</div>
    </main>
  );
}
