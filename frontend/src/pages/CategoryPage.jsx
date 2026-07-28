import React, { useMemo, useState } from "react";
import { ArrowRight, ChevronRight, SlidersHorizontal, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { catalog } from "../data/catalog";
import { getCategoryContent } from "../data/categoryData";
import { useShop } from "../context/ShopContext";
import ShareDialog from "../components/common/ShareDialog";

export default function CategoryPage() {
  const { slug } = useParams();
  const content = getCategoryContent(slug);
  const { addToCart, toggleWishlist } = useShop();
  const [subcategory, setSubcategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [attribute, setAttribute] = useState("All");

  const products = useMemo(() => {
    const categoryProducts = catalog.filter((product) => product.category === content.name);
    const source = categoryProducts.length ? categoryProducts : catalog;
    return source.filter((product, index) => {
      const assignedSubcategory = content.subcategories[index % content.subcategories.length].name;
      const assignedBrand = content.brands[index % content.brands.length];
      const assignedAttribute = content.filters[index % content.filters.length];
      return (subcategory === "All" || assignedSubcategory === subcategory) && (brand === "All" || assignedBrand === brand) && (attribute === "All" || assignedAttribute === attribute);
    }).slice(0, 8);
  }, [attribute, brand, content, subcategory]);

  return (
    <main className="category-page real-page">
      <nav className="category-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight size={13} /><span>{content.name}</span></nav>

      <section className="category-hero" style={{ backgroundColor: content.accent }}>
        <img src={content.image} alt={`${content.name} collection`} />
        <div><span>{content.eyebrow}</span><h1>{content.title}</h1><p>{content.description}</p><div className="category-hero-actions"><Link to={`/products?category=${content.name}`}>Shop all {content.name.toLowerCase()} <ArrowRight size={15} /></Link><ShareDialog title={`${content.name} at MarketSphere`} text={`Explore the latest ${content.name.toLowerCase()} collection`} path={`/category/${slug}`} type="category">Share</ShareDialog></div></div>
      </section>

      <nav className="category-tree" aria-label={`${content.name} category navigation`}>
        {content.subcategories.map((item) => <div key={item.name}><button className={subcategory === item.name ? "active" : ""} onClick={() => setSubcategory(item.name)}>{item.name}</button><div>{item.children.map((child) => <Link to={`/products?category=${content.name}&subcategory=${encodeURIComponent(item.name)}`} key={child}>{child}</Link>)}</div></div>)}
      </nav>

      <section className="category-featured">
        <div className="velora-section-heading"><h2>Featured categories</h2><button onClick={() => setSubcategory("All")}>View all <ArrowRight size={14} /></button></div>
        <div>{content.subcategories.map((item) => <button onClick={() => setSubcategory(item.name)} key={item.name}><img src={item.image} alt="" loading="lazy" /><span>{item.name}</span><small>{item.children.join(" · ")}</small></button>)}</div>
      </section>

      <section className="category-offer"><Tag /><div><span>Category offer</span><strong>{content.offer}</strong></div><Link to={`/products?category=${content.name}&mode=deals`}>Explore offer <ArrowRight size={14} /></Link></section>

      <section className="category-products">
        <div className="category-product-heading"><div><span>Selected for {content.name}</span><h2>{subcategory === "All" ? "Category favourites" : subcategory}</h2></div><div className="category-specific-filters"><SlidersHorizontal size={15} /><select value={attribute} onChange={(event) => setAttribute(event.target.value)} aria-label="Category attribute"><option value="All">All attributes</option>{content.filters.map((filter) => <option key={filter}>{filter}</option>)}</select><select value={brand} onChange={(event) => setBrand(event.target.value)} aria-label="Brand"><option>All</option>{content.brands.map((item) => <option key={item}>{item}</option>)}</select></div></div>
        {products.length ? <div className="real-grid">{products.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.id} />)}</div> : <div className="empty-state">No products match this category selection.</div>}
      </section>

      <section className="category-brands"><div><span>Brands to know</span><h2>Featured in {content.name}</h2></div><div>{content.brands.map((item) => <button onClick={() => setBrand(item)} key={item}>{item}</button>)}</div></section>

      <article className="category-seo"><h2>{content.seoTitle}</h2><p>{content.seoCopy}</p><div>{content.subcategories.map((item) => <section key={item.name}><h3>{item.name}</h3><p>Explore {item.children.join(", ").toLowerCase()} with relevant filters, trusted sellers and current MarketSphere offers.</p></section>)}</div></article>
    </main>
  );
}
