import React from "react";
import { BadgePercent, CreditCard, RotateCcw, ShieldCheck, Smartphone, Truck } from "lucide-react";

const highlights = [
  { title: "Same-day delivery", text: "Available in Bengaluru, Delhi NCR, Mumbai and Hyderabad.", icon: Truck },
  { title: "UPI & No Cost EMI", text: "Pay with UPI, cards, wallet, EMI or cash on delivery.", icon: CreditCard },
  { title: "ShopHub Assured", text: "Quality checked products from verified sellers.", icon: ShieldCheck },
  { title: "Easy returns", text: "Pickup, replacement and refund tracking from your account.", icon: RotateCcw },
  { title: "App-only rewards", text: "Extra coupons and coins on every prepaid order.", icon: Smartphone },
  { title: "Bank offers", text: "Instant discounts on top Indian bank cards and UPI.", icon: BadgePercent },
];

export default function StoreHighlights() {
  return (
    <section className="store-highlights">
      {highlights.map(({ title, text, icon: Icon }) => (
        <article key={title}>
          <Icon size={24} />
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}
