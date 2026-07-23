import React from "react";
import { Award, Bell, Check, Gift, Headphones, Plus, RotateCcw, Scale, ShoppingBag, Star, Wallet, X } from "lucide-react";
import ListRow from "../components/board/ListRow";
import CompactProduct from "../components/board/CompactProduct";
import { mobileProducts, shoeProducts } from "../data/shopData";
import { catalog } from "../data/catalog";
import { money } from "../utils/format";
import { useShop } from "../context/ShopContext";

export function NotificationsPage() {
  return <UtilityPage icon={Bell} title="Notifications" items={["Order delivered", "Price drop on Nike shoes", "Refund processed", "Big Saving Days starts tonight"]} />;
}

export function WalletPage() {
  return <UtilityPage icon={Wallet} title="MarketSphere Wallet" highlight="Rs. 1,250" items={["Added money +Rs. 500", "Order refund +Rs. 750", "Order payment -Rs. 1,299"]} />;
}

export function RewardsPage() {
  return <UtilityPage icon={Award} title="Rewards" highlight="1,280 Points" items={["Order reward +120", "Referral bonus +300", "Coupon unlocked"]} />;
}

export function ReferralsPage() {
  return <UtilityPage icon={Gift} title="Refer & Earn" highlight="MARKET123" items={["Rahul joined", "Jenny joined", "Rs. 100 reward pending"]} />;
}

export function SupportPage() {
  return <UtilityPage icon={Headphones} title="Help Center" items={["Where is my order?", "Cancel or return item", "Payment refund status", "Chat with support"]} />;
}

export function ReturnsPage() {
  return <UtilityPage icon={RotateCcw} title="Returns & Refunds" items={["Nike shoes return requested", "Refund initiated", "Pickup scheduled tomorrow"]} />;
}

export function ComparePage() {
  const { addToCart, addToCompare, compareProducts, removeFromCompare } = useShop();
  const remaining = catalog.filter((product) => !compareProducts.some((item) => item.name === product.name));
  const rows = [
    { label: "Price", values: compareProducts.map((item) => money(item.price)), priority: true },
    { label: "Original price", values: compareProducts.map((item) => money(item.oldPrice || item.price)) },
    { label: "Customer rating", values: compareProducts.map((item) => `${item.rating || 4.5} / 5`), priority: true },
    { label: "Seller", values: compareProducts.map((_, index) => ["MarketSphere Select", "Sole Society", "The Modern Wardrobe", "Style District"][index]) },
    { label: "Category", values: compareProducts.map((item) => item.category || "Shoes") },
    { label: "Material", values: compareProducts.map((_, index) => ["Premium mesh", "Knit textile", "Leather blend", "Recycled fabric"][index]) },
    { label: "Colour options", values: compareProducts.map((_, index) => `${4 + index} colours`) },
    { label: "Warranty", values: compareProducts.map((_, index) => index % 2 ? "6 months" : "12 months") },
    { label: "Delivery", values: compareProducts.map((_, index) => `${2 + index}-${3 + index} days`), priority: true },
    { label: "Return policy", values: compareProducts.map((_, index) => index === 1 ? "10-day exchange" : "7-day returns") },
    { label: "Free shipping", values: compareProducts.map((item) => item.price >= 4000 ? "Included" : "Rs. 99") },
  ];

  return (
    <main className="real-page product-comparison-page">
      <header className="product-compare-heading"><div><span>Product comparison</span><h1>Compare before you choose</h1><p>Review prices, specifications, ratings, sellers and fulfilment side by side.</p></div><Scale /></header>
      {compareProducts.length < 4 && <label className="compare-product-picker"><Plus size={15} /><span>Add a product</span><select value="" onChange={(event) => { const product = catalog.find((item) => item.id === event.target.value); if (product) addToCompare(product); }}><option value="">Choose from catalog</option>{remaining.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>}
      {compareProducts.length ? <section className="product-compare-matrix" style={{ "--compare-count": compareProducts.length }}>
        <div className="compare-product-row"><strong>Products</strong>{compareProducts.map((product) => <article key={product.name}><button className="compare-remove" onClick={() => removeFromCompare(product.name)} title={`Remove ${product.name}`}><X size={15} /></button><img src={product.image} alt={product.name} /><span>{product.category || "Featured"}</span><h2>{product.name}</h2><div><Star size={13} fill="currentColor" /> {product.rating || 4.5}</div><strong>{money(product.price)}</strong><button className="primary" onClick={() => addToCart(product)}><ShoppingBag size={14} /> Add to cart</button></article>)}</div>
        <div className="difference-key"><span><i /> Differences highlighted</span><button onClick={() => compareProducts.slice(1).forEach((item) => removeFromCompare(item.name))}>Keep first only</button></div>
        {rows.map((row) => {
          const different = new Set(row.values).size > 1;
          return <div className={`comparison-spec-row ${different ? "different" : ""}`} key={row.label}><strong>{row.label}{different && <small>Different</small>}</strong>{row.values.map((value, index) => <span className={row.priority && index === bestIndex(row.label, row.values) ? "best" : ""} key={`${value}-${index}`}>{row.priority && index === bestIndex(row.label, row.values) && <Check size={12} />}{value}</span>)}</div>;
        })}
      </section> : <section className="comparison-empty"><Scale /><h2>No products selected</h2><p>Add products from the catalog or a product details page to compare them.</p><button className="primary" onClick={() => catalog.slice(0, 3).forEach(addToCompare)}>Compare popular products</button></section>}
    </main>
  );
}

function bestIndex(label, values) {
  const numbers = values.map((value) => Number(String(value).replace(/[^\d.]/g, "")) || 0);
  if (label === "Price" || label === "Delivery") return numbers.indexOf(Math.min(...numbers));
  return numbers.indexOf(Math.max(...numbers));
}

export function RecentlyViewedPage() {
  return (
    <main className="real-page">
      <div className="page-heading"><div><p>History</p><h1>Recently Viewed</h1></div></div>
      <div className="real-grid">{[...shoeProducts, ...mobileProducts].map((product) => <CompactProduct product={product} key={product.name} />)}</div>
    </main>
  );
}

function UtilityPage({ icon: Icon, title, highlight, items }) {
  return (
    <main className="real-page utility-page">
      <section className="utility-card">
        <Icon size={42} />
        <h1>{title}</h1>
        {highlight && <strong>{highlight}</strong>}
        {items.map((item) => <ListRow title={item} key={item} />)}
      </section>
    </main>
  );
}
