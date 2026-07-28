import React from "react";
import { Check, Plus, Scale, ShoppingBag, Star, X } from "lucide-react";
import { catalog } from "../data/catalog";
import { money } from "../utils/format";
import { useShop } from "../context/ShopContext";

function bestIndex(label, values) {
  const numbers = values.map((value) => Number(String(value).replace(/[^\d.]/g, "")) || 0);
  return label === "Price" || label === "Delivery" ? numbers.indexOf(Math.min(...numbers)) : numbers.indexOf(Math.max(...numbers));
}

export default function ComparePage() {
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

  return <main className="real-page product-comparison-page">
    <header className="product-compare-heading"><div><span>Product comparison</span><h1>Compare before you choose</h1><p>Review prices, specifications, ratings, sellers and fulfilment side by side.</p></div><Scale /></header>
    {compareProducts.length < 4 && <label className="compare-product-picker"><Plus size={15} /><span>Add a product</span><select value="" onChange={(event) => { const product = catalog.find((item) => item.id === event.target.value); if (product) addToCompare(product); }}><option value="">Choose from catalog</option>{remaining.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>}
    {compareProducts.length ? <section className="product-compare-matrix" style={{ "--compare-count": compareProducts.length }}><div className="compare-product-row"><strong>Products</strong>{compareProducts.map((product) => <article key={product.name}><button className="compare-remove" onClick={() => removeFromCompare(product.name)} title={`Remove ${product.name}`}><X size={15} /></button><img src={product.image} alt={product.name} /><span>{product.category || "Featured"}</span><h2>{product.name}</h2><div><Star size={13} fill="currentColor" /> {product.rating || 4.5}</div><strong>{money(product.price)}</strong><button className="primary" onClick={() => addToCart(product)}><ShoppingBag size={14} /> Add to cart</button></article>)}</div><div className="difference-key"><span><i /> Differences highlighted</span><button onClick={() => compareProducts.slice(1).forEach((item) => removeFromCompare(item.name))}>Keep first only</button></div>{rows.map((row) => { const different = new Set(row.values).size > 1; const best = row.priority ? bestIndex(row.label, row.values) : -1; return <div className={`comparison-spec-row ${different ? "different" : ""}`} key={row.label}><strong>{row.label}{different && <small>Different</small>}</strong>{row.values.map((value, index) => <span className={index === best ? "best" : ""} key={`${value}-${index}`}>{index === best && <Check size={12} />}{value}</span>)}</div>; })}</section> : <section className="comparison-empty"><Scale /><h2>No products selected</h2><p>Add products from the catalog or a product details page to compare them.</p><button className="primary" onClick={() => catalog.slice(0, 3).forEach(addToCompare)}>Compare popular products</button></section>}
  </main>;
}
