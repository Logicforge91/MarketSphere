import React from "react";
import { Grid2X2 } from "lucide-react";
import { categories } from "../../data/shopData";
import SectionTitle from "../common/SectionTitle";

export default function CategoryRail() {
  return (
    <section className="home-category-rail">
      <SectionTitle title="Shop by Category" action="View All" />
      <div className="category-grid">
        {categories.slice(0, 7).map(({ name, icon: Icon, accent }) => (
          <article className="category-card" key={name}>
            <div style={{ backgroundColor: accent }}><Icon size={36} /></div>
            <strong>{name}</strong>
          </article>
        ))}
        <article className="category-card more"><Grid2X2 size={34} /><strong>More</strong></article>
      </div>
    </section>
  );
}
