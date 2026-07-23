import React from "react";

const promos = [
  { title: "Mobiles from ₹6,999", text: "5G phones, exchange bonuses and bank savings.", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80" },
  { title: "Fashion under ₹999", text: "Shoes, denim, bags and festive styles.", image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=80" },
  { title: "Home upgrades", text: "Kitchen, decor and appliances for every budget.", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80" },
];

export default function PromoMosaic() {
  return (
    <section className="promo-mosaic">
      {promos.map((promo) => (
        <article style={{ backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.78), rgba(15,23,42,.14)), url(${promo.image})` }} key={promo.title}>
          <h3>{promo.title}</h3>
          <p>{promo.text}</p>
          <button>Shop Now</button>
        </article>
      ))}
    </section>
  );
}
