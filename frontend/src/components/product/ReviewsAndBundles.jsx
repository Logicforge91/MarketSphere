import React, { useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, HelpCircle, MessageCircleQuestion, Star } from "lucide-react";
import { money } from "../../utils/format";
import ProductReviews from "./ProductReviews";
import ProductQuestions from "./ProductQuestions";

const specifications = [
  ["Material", "Premium blended fabric"],
  ["Fit", "Regular fit"],
  ["Care", "Gentle wash, dry in shade"],
  ["Country of origin", "India"],
  ["Package includes", "1 product, care guide"],
];

export default function ReviewsAndBundles({ product, bundleProducts = [], onAdd }) {
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");
  const bundleTotal = bundleProducts.reduce((total, item) => total + item.price, product.price);

  function addBundle() {
    [product, ...bundleProducts].forEach(onAdd);
    setMessage("Bundle added to your cart");
  }

  return (
    <div className="product-content-sections">
      <section className="product-facts">
        <article><h2>Description</h2><p>Designed for everyday versatility with considered materials, dependable construction and an easy-to-style finish.</p><h3>Highlights</h3><ul><li>Quality-checked construction</li><li>Comfort-focused design</li><li>Responsibly packaged</li><li>Easy-care finish</li></ul></article>
        <article><h2>Specifications</h2><dl>{specifications.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></article>
        <article id="size-chart"><h2>Size chart</h2><table><thead><tr><th>Size</th><th>Chest</th><th>Waist</th></tr></thead><tbody>{[["XS", "32", "26"], ["S", "34", "28"], ["M", "36", "30"], ["L", "38", "32"], ["XL", "40", "34"]].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></article>
      </section>

      <section className="bundle-section"><div><span>Complete the set</span><h2>Frequently bought together</h2></div><div className="bundle-products">{[product, ...bundleProducts].map((item, index) => <React.Fragment key={item.id || item.name}>{index > 0 && <b>+</b>}<article><img src={item.image} alt={item.name} /><strong>{item.name}</strong><small>{money(item.price)}</small></article></React.Fragment>)}<aside><span>Bundle total</span><strong>{money(bundleTotal)}</strong><button className="primary" onClick={addBundle}>Add all to cart</button></aside></div>{message && <p role="status">{message}</p>}</section>

      <ProductReviews product={product} />

      <ProductQuestions product={product} />

      <section className="product-service-actions"><button onClick={() => setMessage("Back-in-stock notification enabled")}><Bell size={16} /><span><strong>Back-in-stock notification</strong><small>Get notified when unavailable variants return</small></span></button><button onClick={() => setMessage("Report received. Our catalog team will review it.")}><AlertTriangle size={16} /><span><strong>Report this product</strong><small>Flag incorrect or inappropriate information</small></span></button></section>
      {message && <p className="product-global-notice" role="status">{message}</p>}
    </div>
  );
}
