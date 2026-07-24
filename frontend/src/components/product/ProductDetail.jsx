import React, { useMemo, useState } from "react";
import { Bell, Box, Check, ChevronDown, Heart, Minus, Play, Plus, RotateCw, Scale, ShieldCheck, Star, ZoomIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { productDetail } from "../../data/shopData";
import { money } from "../../utils/format";
import OfferList from "../commerce/OfferList";
import PincodeDelivery from "../commerce/PincodeDelivery";
import ShareDialog from "../common/ShareDialog";

const variantOptions = {
  size: ["XS", "S", "M", "L", "XL"],
  color: ["Violet", "Black", "Rose", "Ivory"],
  storage: ["Standard", "128 GB", "256 GB"],
  weight: ["250 g", "500 g", "1 kg"],
  pack: ["Single", "Pack of 2", "Pack of 4"],
};

function variantImage(image, color) {
  const positions = { Violet: "center", Black: "center 35%", Rose: "center 20%", Ivory: "center 60%" };
  return { image, position: positions[color] };
}

export default function ProductDetail({ product = productDetail, onAdd, onCompare, onWishlist }) {
  const navigate = useNavigate();
  const [selection, setSelection] = useState({ size: "M", color: "Violet", storage: "Standard", weight: "250 g", pack: "Single" });
  const [quantity, setQuantity] = useState(1);
  const [mediaMode, setMediaMode] = useState("image");
  const [zoomed, setZoomed] = useState(false);
  const [notice, setNotice] = useState("");

  const variant = useMemo(() => {
    const sizeIndex = variantOptions.size.indexOf(selection.size);
    const colorIndex = variantOptions.color.indexOf(selection.color);
    const storageIndex = variantOptions.storage.indexOf(selection.storage);
    const weightIndex = variantOptions.weight.indexOf(selection.weight);
    const packIndex = variantOptions.pack.indexOf(selection.pack);
    const unavailable = (sizeIndex + colorIndex + storageIndex + weightIndex + packIndex) % 7 === 0;
    const price = product.price + storageIndex * 900 + weightIndex * 300 + packIndex * 750;
    return {
      ...variantImage(product.image, selection.color),
      available: !unavailable,
      price,
      sku: `MS-${product.id || "PRD"}-${sizeIndex}${colorIndex}${storageIndex}${weightIndex}${packIndex}`.toUpperCase(),
      stock: unavailable ? 0 : Math.max(2, 14 - sizeIndex - colorIndex - packIndex * 2),
    };
  }, [product, selection]);

  function isUnavailable(type, value) {
    const next = { ...selection, [type]: value };
    const indices = Object.keys(next).map((key) => variantOptions[key].indexOf(next[key]));
    return indices.reduce((total, item) => total + item, 0) % 7 === 0;
  }

  function choose(type, value) {
    if (isUnavailable(type, value)) return;
    setSelection((current) => ({ ...current, [type]: value }));
    setQuantity(1);
  }

  function addToCart(buyNow = false) {
    const selectedProduct = { ...product, image: variant.image, price: variant.price, sku: variant.sku, variant: selection, qty: quantity };
    onAdd?.(selectedProduct);
    if (buyNow) navigate("/cart");
  }

  return (
    <section className="product-detail-shell">
      <div className="advanced-gallery">
        <div className="media-mode-switch">
          <button className={mediaMode === "image" ? "active" : ""} onClick={() => setMediaMode("image")} title="Product photos"><Box size={16} /></button>
          <button className={mediaMode === "video" ? "active" : ""} onClick={() => setMediaMode("video")} title="Product video"><Play size={16} /></button>
          <button className={mediaMode === "360" ? "active" : ""} onClick={() => setMediaMode("360")} title="360 degree view"><RotateCw size={16} /></button>
        </div>
        <div className="product-thumbnails">{variantOptions.color.map((color) => <button className={selection.color === color ? "active" : ""} onClick={() => choose("color", color)} key={color}><img src={product.image} alt={`${color} view`} /></button>)}</div>
        <div className={`product-media-stage ${zoomed ? "zoomed" : ""} mode-${mediaMode}`}>
          <img src={variant.image} style={{ objectPosition: variant.position }} alt={`${product.name} in ${selection.color}`} />
          {mediaMode === "video" && <div className="media-overlay"><Play size={38} /><strong>Product video</strong><span>See the fit and movement</span></div>}
          {mediaMode === "360" && <div className="media-overlay"><RotateCw size={38} /><strong>Drag for 360° view</strong><span>Interactive preview</span></div>}
          {mediaMode === "image" && <button className="zoom-control" onClick={() => setZoomed((value) => !value)}><ZoomIn size={17} /> {zoomed ? "Reset" : "Zoom"}</button>}
        </div>
      </div>

      <div className="advanced-product-info">
        <div className="product-badges"><span>Best seller</span><span>Authenticity verified</span></div>
        <h1>{product.name}</h1>
        <p className="product-sku">SKU: {variant.sku}</p>
        <div className="rating"><Star size={16} fill="currentColor" /> {product.rating} <button>2,534 reviews</button><span>2K+ sold</span></div>
        <div className="advanced-price"><strong>{money(variant.price)}</strong><del>{money(product.oldPrice)}</del><span>{Math.round((1 - variant.price / product.oldPrice) * 100)}% off</span></div>
        <p className="tax-copy">Inclusive of all taxes. EMI available from {money(Math.ceil(variant.price / 6))}/month.</p>
        <p className="product-description">A considered MarketSphere essential designed for reliable everyday use, refined comfort and lasting quality.</p>

        <VariantGroup title="Colour" type="color" options={variantOptions.color} selection={selection} choose={choose} unavailable={isUnavailable} swatches />
        <VariantGroup title="Size" type="size" options={variantOptions.size} selection={selection} choose={choose} unavailable={isUnavailable} extra={<button className="size-chart-link" onClick={() => document.getElementById("size-chart")?.scrollIntoView({ behavior: "smooth" })}><Scale size={13} /> Size chart</button>} />
        <VariantGroup title="Storage" type="storage" options={variantOptions.storage} selection={selection} choose={choose} unavailable={isUnavailable} />
        <VariantGroup title="Weight" type="weight" options={variantOptions.weight} selection={selection} choose={choose} unavailable={isUnavailable} />
        <VariantGroup title="Pack size" type="pack" options={variantOptions.pack} selection={selection} choose={choose} unavailable={isUnavailable} />

        <div className={`stock-line ${variant.available ? "" : "unavailable"}`}><Check size={15} /><strong>{variant.available ? `${variant.stock} items in stock` : "Combination unavailable"}</strong></div>
        <div className="purchase-row"><div className="qty"><button disabled={quantity === 1} onClick={() => setQuantity((value) => value - 1)}><Minus size={14} /></button><span>{quantity}</span><button disabled={quantity >= variant.stock} onClick={() => setQuantity((value) => value + 1)}><Plus size={14} /></button></div><button className="primary" disabled={!variant.available} onClick={() => addToCart(false)}>Add to cart</button><button className="secondary" disabled={!variant.available} onClick={() => addToCart(true)}>Buy now</button></div>
        <div className="product-secondary-actions"><button onClick={() => onWishlist?.(product)}><Heart size={16} /> Wishlist</button><ShareDialog title={product.name} text={`Shop ${product.name} on MarketSphere`} path={`/product/${product.slug}`} type="product">Share</ShareDialog><button onClick={() => { onCompare?.(product); navigate("/compare"); }}><Scale size={16} /> Compare</button><button onClick={() => setNotice("Price-drop alert enabled")}><Bell size={16} /> Price alert</button></div>
        {notice && <p className="product-notice" role="status">{notice}</p>}

        <PincodeDelivery />
        <OfferList />
        <section className="seller-panel"><div><span>Sold by</span><strong>MarketSphere Select</strong><small><Star size={12} fill="currentColor" /> 4.8 seller rating</small></div><button onClick={() => navigate("/store/marketsphere-select")}>Visit store</button></section>
        <div className="policy-accordion">
          <details open><summary>Shipping and returns <ChevronDown size={15} /></summary><p>Free shipping above Rs. 1,999. Easy 7-day returns in original condition.</p></details>
          <details><summary>Warranty and authenticity <ChevronDown size={15} /></summary><p>12-month seller warranty where applicable. Every product is sourced from verified sellers and authenticity checked.</p></details>
        </div>
      </div>
    </section>
  );
}

function VariantGroup({ title, type, options, selection, choose, unavailable, swatches = false, extra }) {
  return <div className="variant-group"><div><strong>{title}: <span>{selection[type]}</span></strong>{extra}</div><div>{options.map((option) => <button className={`${selection[type] === option ? "active" : ""} ${swatches ? "color-variant" : ""}`} disabled={unavailable(type, option)} onClick={() => choose(type, option)} title={unavailable(type, option) ? "This combination is unavailable" : option} key={option}>{swatches && <i className={option.toLowerCase()} />}{option}</button>)}</div></div>;
}
