import { Bell, Heart, Search, ShieldCheck, ShoppingCart, Truck, User } from "lucide-react";

export default function Header() {
  return (
    <header className="topbar">
      <div className="service-strip">
        <span><Truck size={14} /> Free Shipping on orders above $49</span>
        <span><ShieldCheck size={14} /> Easy Returns</span>
        <span><Bell size={14} /> 24/7 Support</span>
      </div>
      <div className="nav">
        <div className="brand"><ShoppingCart size={28} /> Shop<span>Hub</span></div>
        <label className="search">
          <Search size={18} />
          <input placeholder="Search for products, brands and more..." />
          <button>Search</button>
        </label>
        <div className="actions">
          <button><Heart size={20} /><span>Wishlist</span></button>
          <button className="cart-dot"><ShoppingCart size={20} /><span>Cart</span></button>
          <button><User size={20} /><span>Account</span></button>
        </div>
      </div>
      <nav className="tabs">
        {["Home", "Categories", "Brands", "Deals", "New Arrivals", "Best Sellers"].map((item) => (
          <a className={item === "Home" ? "active" : ""} key={item}>{item}</a>
        ))}
      </nav>
    </header>
  );
}
