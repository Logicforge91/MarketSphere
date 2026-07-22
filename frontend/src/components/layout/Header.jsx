import React from "react";
import { Bell, Heart, Search, ShieldCheck, ShoppingCart, Truck, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

export default function Header() {
  const { cart, query, setQuery, wishlist } = useShop();
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/search");
  }

  return (
    <header className="topbar">
      <div className="service-strip">
        <span><Truck size={14} /> Free Shipping on orders above $49</span>
        <span><ShieldCheck size={14} /> Easy Returns</span>
        <span><Bell size={14} /> 24/7 Support</span>
      </div>
      <div className="nav">
        <Link to="/" className="brand"><ShoppingCart size={28} /> Shop<span>Hub</span></Link>
        <form className="search" onSubmit={handleSubmit}>
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for products, brands and more..." />
          <button>Search</button>
        </form>
        <div className="actions">
          <Link to="/wishlist"><Heart size={20} /><span>Wishlist ({wishlist.length})</span></Link>
          <Link to="/cart" className="cart-dot" data-count={cart.length}><ShoppingCart size={20} /><span>Cart</span></Link>
          <Link to="/orders"><User size={20} /><span>Account</span></Link>
        </div>
      </div>
      <nav className="tabs">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Categories</NavLink>
        <NavLink to="/products">Deals</NavLink>
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/orders">Orders</NavLink>
      </nav>
    </header>
  );
}
