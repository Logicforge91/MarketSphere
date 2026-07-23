import React, { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

const navigation = [
  { label: "New in", to: "/products?mode=new" },
  { label: "Women", to: "/category/women" },
  { label: "Men", to: "/category/men" },
  { label: "Bags", to: "/category/bags" },
  { label: "Shoes", to: "/category/shoes" },
  { label: "Accessories", to: "/category/accessories" },
  { label: "Beauty", to: "/category/beauty" },
  { label: "Sale", to: "/products?mode=deals", className: "sale-link" },
];

export default function Header() {
  const { cart, wishlist } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);
  const isCurrent = (to) => `${location.pathname}${location.search}` === to;
  const navClass = (item) => `${item.className || ""} ${isCurrent(item.to) ? "active" : ""}`.trim();

  return (
    <header className="topbar velora-header">
      <div className="velora-announcement">
        <span>Complimentary shipping above Rs. 1,999</span>
        <span>Easy 7-day returns</span>
      </div>
      <div className="nav">
        <button className="mobile-menu-trigger" type="button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
        <Link to="/" className="velora-logo" aria-label="MarketSphere home">MARKETSPHERE<small>Elevate everyday</small></Link>
        <div className="header-search-spacer" aria-hidden="true" />
        <div className="actions">
          <Link to="/search" aria-label="Search"><Search size={19} /></Link>
          <Link to="/wishlist" className="header-action" aria-label={`Wishlist with ${wishlist.length} items`}><Heart size={19} /><span>Wishlist</span></Link>
          <Link to="/account" className="header-action" aria-label="Account"><UserRound size={19} /><span>Account</span></Link>
          <Link to="/cart" className="cart-dot header-action" data-count={cart.length} aria-label={`Bag with ${cart.length} items`}><ShoppingBag size={19} /><span>Bag</span></Link>
        </div>
      </div>
      <nav className="tabs" aria-label="Primary navigation">
        {navigation.map((item) => <Link className={navClass(item)} to={item.to} key={item.label}>{item.label}</Link>)}
      </nav>

      <div className={`mobile-nav-backdrop ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <aside className={`mobile-nav-panel ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-nav-heading"><Link to="/" className="velora-logo">MARKETSPHERE</Link><button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X /></button></div>
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => <Link className={navClass(item)} to={item.to} key={item.label}>{item.label}<span>&rsaquo;</span></Link>)}
        </nav>
        <div className="mobile-nav-account">
          <Link to="/account"><UserRound size={18} /> My account</Link>
          <Link to="/wishlist"><Heart size={18} /> Wishlist ({wishlist.length})</Link>
        </div>
      </aside>
    </header>
  );
}
