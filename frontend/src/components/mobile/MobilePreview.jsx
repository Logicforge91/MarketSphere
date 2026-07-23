import React from "react";
import { ChevronRight } from "lucide-react";
import { cartItems, categories, deals } from "../../data/shopData";
import { money } from "../../utils/format";
import SectionTitle from "../common/SectionTitle";
import Hero from "../home/Hero";
import ProductCard from "../product/ProductCard";
import MobileHeader from "./MobileHeader";
import MobileNav from "./MobileNav";

export default function MobilePreview() {
  return (
    <aside className="phone-stack">
      <div className="phone"><MobileHeader /><Hero /><SectionTitle title="Flash Deals" action="See All" /><div className="two-col">{deals.slice(0, 2).map((p) => <ProductCard product={p} key={p.name} />)}</div><MobileNav /></div>
      <div className="phone"><MobileHeader title="Categories" />{categories.map(({ name, icon: Icon }) => <button className="mobile-row" key={name}><Icon size={18} /> {name}<ChevronRight size={14} /></button>)}<MobileNav /></div>
      <div className="phone"><MobileHeader title="My Cart (3)" />{cartItems.map((item) => <div className="cart-item" key={item.name}><img src={item.image} alt={item.name} /><div><b>{item.name}</b><span>{money(item.price)}</span></div></div>)}<button className="checkout">Checkout</button></div>
    </aside>
  );
}
