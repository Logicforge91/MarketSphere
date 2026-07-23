import React from "react";
import { Package, ShoppingCart } from "lucide-react";

export default function DesignSystemPanel() {
  return (
    <aside className="design-panel">
      <div className="brand big"><ShoppingCart size={35} /> Shop<span>Hub</span></div>
      <h2>E-Commerce UI/UX Design 2026</h2>
      <p>A modern, clean and conversion-focused shopping experience.</p>
      <h3>Design System</h3>
      <div className="colors">{["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#64748b"].map((c) => <span style={{ background: c }} key={c} />)}</div>
      <h3>Typography</h3>
      <div className="type"><b>Ag</b><span>Inter<br />ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />0123456789</span></div>
      <h3>UI Elements</h3>
      <button className="primary wide">Primary Button</button>
      <button className="secondary wide">Secondary Button</button>
      <div className="offer"><h3>Special Offers</h3>{["10% Instant Discount", "Flat $20 Off", "Free Shipping"].map((item) => <p key={item}><Package size={18} /> {item}<b>AXIS10</b></p>)}<button>View All Offers</button></div>
    </aside>
  );
}
