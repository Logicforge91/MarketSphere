import React from "react";
import { BadgePercent } from "lucide-react";
import { indianOffers } from "../../data/shopData";

export default function OfferList() {
  return (
    <section className="india-card">
      <h3><BadgePercent size={18} /> Available Offers</h3>
      {indianOffers.map((offer, index) => <p key={offer}><strong>{["Bank offer", "Card offer", "EMI option", "Coupon offer"][index]}</strong>{offer}</p>)}
    </section>
  );
}
