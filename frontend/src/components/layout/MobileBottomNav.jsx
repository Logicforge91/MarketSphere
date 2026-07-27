import React from "react";
import { Grid2X2, Heart, Home, Search, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

const items = [
  { label: "Home", to: "/", icon: Home },
  { label: "Categories", to: "/products", icon: Grid2X2 },
  { label: "Search", to: "/search", icon: Search },
  { label: "Wishlist", to: "/wishlist", icon: Heart, countKey: "wishlist" },
  { label: "Account", to: "/account", icon: UserRound },
];

export default function MobileBottomNav() {
  const { wishlist } = useShop();
  const counts = { wishlist: wishlist.length };

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
