import React, { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Gift, Heart, HelpCircle, LogOut, MapPin, Menu, Package, RefreshCw, Search, Settings, ShoppingBag, TicketPercent, UserRound, WalletCards, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useAuth } from "../../context/AuthContext";

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

const categoryGroups = [
  ["Women", ["Dresses", "Tops", "Bottoms"]],
  ["Men", ["Jackets", "Shirts", "Essentials"]],
  ["Shoes", ["Sneakers", "Running", "Lifestyle"]],
  ["Accessories", ["Bags", "Watches", "Jewellery"]],
];

const accountItems = [
  ["My profile", "/account", UserRound],
  ["My orders", "/orders", Package],
  ["Track orders", "/track-order", MapPin],
  ["Returns and refunds", "/returns", RefreshCw],
  ["Wishlist", "/wishlist", Heart],
  ["Saved addresses", "/addresses", MapPin],
  ["Saved payment methods", "/payment-methods", WalletCards],
  ["Coupons", "/offers", TicketPercent],
  ["Gift cards", "/gift-cards", Gift],
  ["Wallet", "/wallet", WalletCards],
  ["Rewards", "/rewards", Gift],
  ["Notifications", "/notifications", Bell],
  ["Help and support", "/support", HelpCircle],
  ["Settings", "/localization", Settings],
];

export default function Header() {
  const { cart, setQuery, wishlist } = useShop();
  const { region, t } = useLocalization();
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const accountRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const close = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) setAccountOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const isCurrent = (to) => `${location.pathname}${location.search}` === to;
  const navClass = (item) => `${item.className || ""} ${isCurrent(item.to) ? "active" : ""}`.trim();

  function submitSearch(event) {
    event.preventDefault();
    setQuery(search.trim());
    navigate("/search");
  }

  function signOut() {
    logout();
    setAccountOpen(false);
    navigate("/");
  }

  return <header className="topbar velora-header">
    <div className="velora-announcement"><span>{t("shipping")} · {region.country}</span><span>{t("returns")}</span></div>
    <div className="nav">
      <button className="mobile-menu-trigger" type="button" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu /></button>
      <Link to="/" className="velora-logo" aria-label="MarketSphere home">MARKETSPHERE<small>Elevate everyday</small></Link>
      {location.pathname !== "/search" ? <form className="desktop-header-search" role="search" onSubmit={submitSearch}><Search aria-hidden="true" /><label className="sr-only" htmlFor="desktop-product-search">Search MarketSphere</label><input id="desktop-product-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products, brands and more..." /><button type="submit">Search</button></form> : <div className="header-search-spacer" aria-hidden="true" />}
      <div className="actions">
        <Link to="/localization" className="header-location" aria-label={`Shopping location ${region.country}`}><MapPin /><span>{region.country}</span></Link>
        <Link to="/wishlist" className="header-action" aria-label={`${t("wishlist")} with ${wishlist.length} items`}><Heart /><span>{t("wishlist")}</span></Link>
        <div className="header-account" ref={accountRef}>
          <button className="header-action" type="button" aria-haspopup="menu" aria-expanded={accountOpen} onClick={() => setAccountOpen((value) => !value)}><UserRound /><span>{t("account")}</span><ChevronDown /></button>
          {accountOpen && <div className="customer-account-menu" role="menu"><header><strong>{isAuthenticated ? user?.name : "Welcome to MarketSphere"}</strong><span>{isAuthenticated ? user?.email : "Sign in to manage your account"}</span></header>{!isAuthenticated && <Link className="account-signin" to="/login">Sign in or register</Link>}<nav>{accountItems.map(([label, to, Icon]) => <Link role="menuitem" to={to} key={label}><Icon />{label}</Link>)}</nav>{isAuthenticated && <button className="account-logout" type="button" onClick={signOut}><LogOut /> Logout</button>}</div>}
        </div>
        <Link to="/cart" className="cart-dot header-action" data-count={cart.length} aria-label={`${t("bag")} with ${cart.length} items`}><ShoppingBag /><span>{t("bag")}</span></Link>
      </div>
    </div>
    <nav className="tabs" aria-label="Primary navigation">
      <details className="category-menu"><summary>Categories <ChevronDown /></summary><div>{categoryGroups.map(([group, children]) => <section key={group}><Link to={`/category/${group.toLowerCase()}`}>{group}</Link>{children.map((child) => <Link to={`/products?category=${group}&subcategory=${encodeURIComponent(child)}`} key={child}>{child}</Link>)}</section>)}</div></details>
      {navigation.map((item) => <Link className={navClass(item)} to={item.to} key={item.label}>{item.label}</Link>)}
    </nav>

    <div className={`mobile-nav-backdrop ${menuOpen ? "open" : ""}`} aria-hidden="true" onClick={() => setMenuOpen(false)} />
    <aside className={`mobile-nav-panel ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen} {...(!menuOpen ? { inert: "" } : {})}>
      <div className="mobile-nav-heading"><Link to="/" className="velora-logo">MARKETSPHERE</Link><button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X /></button></div>
      <Link className="mobile-location-link" to="/localization"><MapPin /> {region.country}<span>Change</span></Link>
      <nav aria-label="Mobile categories">{navigation.map((item) => <Link className={navClass(item)} to={item.to} key={item.label}>{item.label}<span>›</span></Link>)}</nav>
      <div className="mobile-account-menu"><strong>My account</strong>{accountItems.map(([label, to, Icon]) => <Link to={to} key={label}><Icon />{label}</Link>)}{isAuthenticated && <button onClick={signOut}><LogOut /> Logout</button>}</div>
    </aside>
  </header>;
}
