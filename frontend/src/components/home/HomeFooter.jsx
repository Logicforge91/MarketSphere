import React from "react";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

export default function HomeFooter() {
  return (
    <footer className="home-footer">
      <section>
        <h3>ShopHub</h3>
        <p>India-first ecommerce for mobiles, fashion, home, beauty and daily essentials.</p>
        <div className="footer-social"><Facebook size={18} /><Instagram size={18} /><Twitter size={18} /></div>
      </section>
      <section>
        <h4>Shop</h4>
        <a>Mobiles</a>
        <a>Fashion</a>
        <a>Appliances</a>
        <a>Grocery</a>
      </section>
      <section>
        <h4>Support</h4>
        <a>Help Center</a>
        <a>Track Order</a>
        <a>Returns</a>
        <a>Payments</a>
      </section>
      <section>
        <h4>Contact</h4>
        <p><MapPin size={15} /> Bengaluru, Karnataka</p>
        <p><Phone size={15} /> +91 98765 43210</p>
        <p><Mail size={15} /> support@shophub.in</p>
      </section>
    </footer>
  );
}
