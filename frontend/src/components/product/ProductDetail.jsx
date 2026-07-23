import React from "react";
import { Heart, Minus, Plus, ShieldCheck, Star } from "lucide-react";
import { productDetail } from "../../data/shopData";
import { money } from "../../utils/format";
import OfferList from "../commerce/OfferList";
import PincodeDelivery from "../commerce/PincodeDelivery";

export default function ProductDetail({ product = productDetail, onAdd }) {
  const swatches = product.swatches || productDetail.swatches;
  return (
    <section className="detail-panel">
      <div className="gallery">
        <div className="thumbs">{[1, 2, 3, 4].map((i) => <img src={product.image} alt="" key={i} />)}</div>
        <img className="main-product" src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <span className="seller">Best Seller</span>
        <h2>{product.name}</h2>
        <div className="rating"><Star size={17} fill="currentColor" /> {product.rating} ({(product.reviews || 2100).toLocaleString()} reviews) <span>{product.sold || "1K+"} sold</span></div>
        <div className="price"><strong>{money(product.price)}</strong><del>{money(product.oldPrice)}</del><span>{product.discount || "New season"}</span></div>
        <p>A flowing floral silhouette with a softly fitted bodice, designed for effortless day-to-evening dressing.</p>
        <strong className="option-label">Colour: Multi colour</strong>
        <div className="swatches">{swatches.map((color) => <button aria-label={`Choose colour ${color}`} style={{ backgroundColor: color }} key={color} />)}</div>
        <strong className="option-label">Size: M</strong>
        <div className="size-options">{["XS", "S", "M", "L", "XL"].map((size) => <button className={size === "M" ? "active" : ""} key={size}>{size}</button>)}</div>
        <div className="qty"><button><Minus size={14} /></button><span>1</span><button><Plus size={14} /></button></div>
        <div className="buy-actions"><button className="primary" onClick={() => onAdd?.(product)}>Add to cart</button><button className="secondary">Buy now</button></div>
        <button className="product-wishlist"><Heart size={16} /> Add to wishlist</button>
        <OfferList />
        <PincodeDelivery />
      </div>
      <aside className="store-box">
        <strong>MarketSphere promise</strong>
        {["Quality checked", "100% original products", "7-day easy returns", "Free delivery over Rs. 1,999"].map((item) => <span key={item}><ShieldCheck size={16} /> {item}</span>)}
      </aside>
    </section>
  );
}
