import { Grid2X2, Heart, Home, ShoppingCart, User } from "lucide-react";

export default function MobileNav() {
  return <nav className="mobile-nav">{[Home, Grid2X2, Heart, ShoppingCart, User].map((Icon, i) => <button key={i}><Icon size={17} /></button>)}</nav>;
}
