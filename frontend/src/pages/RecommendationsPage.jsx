import React, { useMemo, useState } from "react";
import { Check, ChevronRight, Eye, Flame, History, MapPin, PackageCheck, ShoppingBag, Sparkles, Star, Tags, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { brands, categories } from "../data/shopData";
import { catalog } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";
import { getStored } from "../utils/storage";

function productBrand(product) {
  const match = brands.find((brand) => product.name.toLowerCase().includes(brand.toLowerCase()));
  if (match) return match;
  const categoryBrands = { Women: "MANGO", Men: "ZARA", Bags: "COACH", Shoes: "ALDO", Accessories: "GUESS", Beauty: "H&M" };
  return categoryBrands[product.category] || "MarketSphere Select";
}

function unique(items) {
  return Array.from(new Map(items.map((item) => [item.slug || item.name, item])).values());
}

function RecommendationSection({ eyebrow, title, copy, icon: Icon, products, addToCart, toggleWishlist }) {
  return <section className="recommendation-section"><header><div className="recommendation-title"><i><Icon /></i><span><small>{eyebrow}</small><h2>{title}</h2><p>{copy}</p></span></div><Link to="/products">View all <ChevronRight /></Link></header><div className="product-grid compact">{products.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.id} />)}</div></section>;
}

export default function RecommendationsPage() {
  const { addToCart, orders, toggleWishlist } = useShop();
  const [message, setMessage] = useState("");
  const viewedHistory = useMemo(() => getStored("marketsphere:recently-viewed", []), []);
  const addresses = useMemo(() => getStored("marketsphere:addresses", []), []);
  const location = addresses.find((item) => item.primary)?.city || addresses[0]?.city || "Bengaluru";

  const signals = useMemo(() => {
    const viewed = viewedHistory.map((entry) => catalog.find((item) => item.slug === entry.slug)).filter(Boolean);
    const purchasedNames = orders.flatMap((order) => order.items || []).map((item) => item.name);
    const purchased = purchasedNames.map((name) => catalog.find((item) => item.name === name)).filter(Boolean);
    const categoryScores = [...viewed, ...purchased, ...purchased].reduce((scores, product) => ({ ...scores, [product.category]: (scores[product.category] || 0) + 1 }), {});
    const brandScores = [...viewed, ...purchased, ...purchased].reduce((scores, product) => {
      const brand = productBrand(product);
      return { ...scores, [brand]: (scores[brand] || 0) + 1 };
    }, {});
    const ranked = [...catalog].sort((a, b) => (categoryScores[b.category] || 0) - (categoryScores[a.category] || 0) || (brandScores[productBrand(b)] || 0) - (brandScores[productBrand(a)] || 0) || b.rating - a.rating);
    return { viewed, purchased, purchasedNames, categoryScores, brandScores, ranked };
  }, [orders, viewedHistory]);

  const personalizedCategories = categories.filter((item) => signals.categoryScores[item.name]).sort((a, b) => signals.categoryScores[b.name] - signals.categoryScores[a.name]).slice(0, 5);
  const fallbackCategories = personalizedCategories.length ? personalizedCategories : categories.slice(0, 5);
  const personalizedBrands = Object.entries(signals.brandScores).sort((a, b) => b[1] - a[1]).map(([brand]) => brand);
  const shownBrands = personalizedBrands.length ? personalizedBrands.slice(0, 6) : brands.slice(0, 6);
  const viewedSlugs = new Set(signals.viewed.map((item) => item.slug));
  const purchasedNames = new Set(signals.purchasedNames);
  const forYou = signals.ranked.filter((item) => !purchasedNames.has(item.name)).slice(0, 5);
  const fromBrowsing = signals.ranked.filter((item) => !viewedSlugs.has(item.slug) && signals.categoryScores[item.category]).slice(0, 5);
  const fromPurchases = signals.ranked.filter((item) => !purchasedNames.has(item.name) && signals.purchased.some((product) => product.category === item.category)).slice(0, 5);
  const anchor = signals.viewed[0] || signals.purchased[0] || catalog[0];
  const similar = catalog.filter((item) => item.slug !== anchor.slug && item.category === anchor.category).slice(0, 5);
  const alsoViewed = unique([...catalog].sort((a, b) => b.rating - a.rating)).filter((item) => item.slug !== anchor.slug).slice(0, 5);
  const alsoPurchased = catalog.filter((item) => !purchasedNames.has(item.name)).sort((a, b) => (b.rating * 100 + b.price / 1000) - (a.rating * 100 + a.price / 1000)).slice(0, 5);
  const trendingNearYou = [...catalog].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.discount ? 1 : 0) - (a.discount ? 1 : 0)).slice(0, 5);
  const bundle = unique([anchor, ...catalog.filter((item) => item.category !== anchor.category)]).slice(0, 3);
  const bundleTotal = bundle.reduce((sum, item) => sum + item.price, 0);

  function addBundle() {
    bundle.forEach(addToCart);
    setMessage(`${bundle.length} frequently bought together products added to your bag.`);
  }

  return <main className="real-page recommendations-page">
    <header className="recommendations-heading"><div><span>Personalized shopping</span><h1>Recommended for you</h1><p>Suggestions shaped by your browsing, purchases and current shopping interests.</p></div><div><Sparkles /><span><strong>{viewedHistory.length + signals.purchased.length}</strong><small>signals improving your picks</small></span></div></header>
    {message && <p className="wallet-message"><Check /> {message}</p>}

    <section className="preference-strip"><div><Tags /><span><small>Personalized categories</small><strong>{fallbackCategories.map((item) => item.name).join(" · ")}</strong></span></div><div><Star /><span><small>Personalized brands</small><strong>{shownBrands.join(" · ")}</strong></span></div></section>
    <section className="recommendation-category-links">{fallbackCategories.map((category) => <Link to={`/category/${category.name.toLowerCase().replace(/\s/g, "-")}`} key={category.name}>{category.image ? <img src={category.image} alt="" /> : <category.icon />}<span>{category.name}</span></Link>)}</section>

    <RecommendationSection eyebrow="Your edit" title="Top picks for you" copy="A blended ranking from your strongest shopping signals." icon={Sparkles} products={forYou} addToCart={addToCart} toggleWishlist={toggleWishlist} />
    <RecommendationSection eyebrow="Browsing history" title="Because you viewed similar styles" copy={signals.viewed.length ? `Inspired by ${signals.viewed.slice(0, 2).map((item) => item.name).join(" and ")}.` : "Popular choices to start building your browsing profile."} icon={History} products={fromBrowsing.length ? fromBrowsing : forYou} addToCart={addToCart} toggleWishlist={toggleWishlist} />
    <RecommendationSection eyebrow="Purchase history" title="Based on past purchases" copy={signals.purchased.length ? "Complements categories and brands you have ordered before." : "These become more personal after your first order."} icon={PackageCheck} products={fromPurchases.length ? fromPurchases : alsoPurchased} addToCart={addToCart} toggleWishlist={toggleWishlist} />
    <RecommendationSection eyebrow={`Similar to ${anchor.name}`} title="Similar products" copy={`More highly rated options from ${anchor.category}.`} icon={Eye} products={similar.length ? similar : forYou} addToCart={addToCart} toggleWishlist={toggleWishlist} />

    <section className="recommendation-bundle"><header><div><small>Complete the order</small><h2>Frequently bought together</h2><p>A useful combination based on common basket patterns.</p></div></header><div>{bundle.map((product, index) => <React.Fragment key={product.slug}>{index > 0 && <b>+</b>}<article><img src={product.image} alt={product.name} /><span><strong>{product.name}</strong><small>{money(product.price)}</small></span></article></React.Fragment>)}<aside><small>Bundle total</small><strong>{money(bundleTotal)}</strong><button className="primary" onClick={addBundle}><ShoppingBag /> Add all</button></aside></div></section>

    <RecommendationSection eyebrow="Shared interest" title="Customers also viewed" copy="Products explored by shoppers with similar interests." icon={Users} products={alsoViewed} addToCart={addToCart} toggleWishlist={toggleWishlist} />
    <RecommendationSection eyebrow="Complete their picks" title="Customers also purchased" copy="Frequently ordered by customers shopping similar products." icon={ShoppingBag} products={alsoPurchased} addToCart={addToCart} toggleWishlist={toggleWishlist} />
    <RecommendationSection eyebrow={`Popular in ${location}`} title="Trending near you" copy="High-interest products based on your selected delivery region." icon={Flame} products={trendingNearYou} addToCart={addToCart} toggleWishlist={toggleWishlist} />
    <aside className="recommendation-location"><MapPin /><span>Regional trends use your selected delivery city: <strong>{location}</strong></span><Link to="/addresses">Change location</Link></aside>
  </main>;
}
