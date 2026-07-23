import React from "react";
import { Heart, Plus, Star } from "lucide-react";
import { money } from "../../utils/format";

export default function CompactProduct({ product, action = "heart" }) {
  return (
    <article className="compact-product">
      <img src={product.image} alt={product.name} />
      <div>
        <strong>{product.name}</strong>
        <small><Star size={12} fill="currentColor" /> {product.rating || 4.5} <span>{product.discount}</span></small>
        <b>{money(product.price)}</b>
      </div>
      <button>{action === "add" ? <Plus size={15} /> : <Heart size={15} />}</button>
    </article>
  );
}
