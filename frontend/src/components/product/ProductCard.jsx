import React, { memo } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { money } from "../../utils/format";
import { slugify } from "../../data/catalog";
import OptimizedImage from "../common/OptimizedImage";

function ProductCard({ product, onAdd, onWishlist }) {
  const productPath = `/product/${product.slug || slugify(product.name)}`;

  return (
    <article className="product-card">
      <div className="product-card-media">
        {product.discount && <span className="discount">{product.discount}</span>}
        {onWishlist && (
          <button className="heart" type="button" aria-label={`Save ${product.name}`} onClick={() => onWishlist(product)}>
            <Heart size={17} aria-hidden="true" />
          </button>
        )}
        <Link to={productPath} aria-label={`View ${product.name}`}>
          <OptimizedImage src={product.image} alt={product.name} width="600" height="750" />
        </Link>
      </div>
      <Link className="product-card-title" to={productPath}><h3>{product.name}</h3></Link>
      {product.price && (
        <p className="product-card-price">
          <strong>{money(product.price)}</strong>
          {product.oldPrice && <del>{money(product.oldPrice)}</del>}
        </p>
      )}
      {product.rating && <small className="product-card-rating"><Star size={13} fill="currentColor" aria-hidden="true" /> {product.rating} <span>(2.1K)</span></small>}
      {onAdd && <button className="card-add" type="button" onClick={() => onAdd(product)}><ShoppingBag size={14} aria-hidden="true" /> Add to cart</button>}
    </article>
  );
}

export default memo(ProductCard);
