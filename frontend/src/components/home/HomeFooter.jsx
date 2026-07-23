import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeFooter() {
  return (
    <footer className="home-footer velora-footer">
      <section><h3>MARKETSPHERE</h3><p>Elevate everyday with considered fashion, beauty and accessories.</p></section>
      <section><h4>Shop</h4><Link to="/products">Women</Link><Link to="/products">Men</Link><Link to="/products">Bags</Link><Link to="/products">Shoes</Link></section>
      <section><h4>Help</h4><Link to="/faq">FAQs</Link><Link to="/orders">Shipping</Link><Link to="/returns">Returns</Link><Link to="/track-order">Track order</Link></section>
      <section><h4>About</h4><Link to="/about">About us</Link><Link to="/blog">Blog</Link><Link to="/brands">Brands</Link><Link to="/contact">Contact</Link></section>
      <section><h4>Customer care</h4><p><Phone size={14} /> +91 98765 43210</p><p><Mail size={14} /> care@marketsphere.in</p><p><MapPin size={14} /> Mumbai, India</p></section>
    </footer>
  );
}
