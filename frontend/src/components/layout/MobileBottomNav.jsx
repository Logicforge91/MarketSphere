import React from "react";
import { Heart, Home, Search, ShoppingBag, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

const items = [
  { label: "Home", to: "/", icon: Home },
  { label: "Discover", to: "/search", icon: Search },
  { label: "Saved", to: "/wishlist", icon: Heart, countKey: "wishlist" },
  { label: "Bag", to: "/cart", icon: ShoppingBag, countKey: "cart" },
  { label: "Account", to: "/account", icon: UserRound },
];

export default function MobileBottomNav() {
  const { cart, wishlist } = useShop();
  const counts = { cart: cart.length, wishlist: wishlist.length };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map(({ label, to, icon: Icon, countKey }) => (
        <NavLink to={to} key={label}>
          <span><Icon size={19} aria-hidden="true" />{countKey && counts[countKey] > 0 && <b>{counts[countKey]}</b>}</span>
          <small>{label}</small>
        </NavLink>
      ))}
    </nav>
  );
}
