import { Heart, Star } from "lucide-react";
import { money } from "../../utils/format";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      {product.discount && <span className="discount">{product.discount}</span>}
      <button className="heart"><Heart size={18} /></button>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      {product.price && <p><strong>{money(product.price)}</strong> <del>{money(product.oldPrice)}</del></p>}
      {product.rating && <small><Star size={14} fill="currentColor" /> {product.rating} (2.1K)</small>}
    </article>
  );
}
