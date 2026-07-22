import { Menu, Search } from "lucide-react";

export default function MobileHeader({ title }) {
  return <div className="mobile-head"><Menu size={18} /><b>{title || "ShopHub"}</b><Search size={18} /></div>;
}
