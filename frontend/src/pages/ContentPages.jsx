import React, { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Check, CirclePlay, Clock3, Compass, Gift, PackageCheck, Play, ShieldCheck, Sparkles, Star, Tags, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { catalog } from "../data/catalog";
import { useShop } from "../context/ShopContext";

const guideCollections = {
  buying: {
    eyebrow: "Buying guides",
    title: "Choose with confidence",
    copy: "Practical advice for comparing quality, fit, materials, value and seller trust.",
    guides: [
      ["The complete sneaker buying guide", "Fit, cushioning, materials and everyday performance.", "Shoes", "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=82"],
      ["How to choose an everyday bag", "Capacity, construction and details worth checking.", "Bags", "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=82"],
      ["A smarter guide to watches", "Movement, materials, sizing and long-term care.", "Accessories", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=82"],
    ],
  },
  product: {
    eyebrow: "Product guides",
    title: "Know what you are buying",
    copy: "Product-specific explainers covering features, care, authenticity and use.",
    guides: [
      ["Understanding dress fabrics", "A clear guide to drape, comfort, opacity and care.", "Women", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=82"],
      ["Leather care that works", "Keep bags and accessories looking considered for longer.", "Bags", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=82"],
      ["Fragrance notes explained", "Find scent families that suit your day and season.", "Beauty", "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=82"],
    ],
  },
  style: {
    eyebrow: "Style guides",
    title: "Wear it your way",
    copy: "Useful edits for building outfits, refining proportions and shopping your wardrobe.",
    guides: [
      ["The modern capsule wardrobe", "Twelve versatile pieces and dozens of combinations.", "Women", "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=82"],
      ["Three ways to style denim", "From workday layers to relaxed weekends.", "Men", "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=900&q=82"],
      ["Accessories that change the look", "Small details with a useful visual impact.", "Accessories", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=82"],
    ],
  },
};

const brandStories = [
  ["NIKE", "Innovation in motion", "How performance research became everyday design.", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=84"],
  ["COACH", "Crafted for the everyday", "A closer look at leather, utility and enduring silhouettes.", "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1000&q=84"],
  ["MANGO", "A modern wardrobe language", "The ideas shaping a more versatile approach to dressing.", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=84"],
];

const videos = [
  ["Five looks, one dress", "Style", "04:18", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=84"],
  ["How to check sneaker fit", "Buying guide", "03:42", "https://images.unsplash.com/photo-1549298916-b41d5012-ad4803739b7c?auto=format&fit=crop&w=900&q=84"],
  ["Inside a considered wardrobe", "Brand story", "06:10", "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=84"],
];

function ContentHeading({ eyebrow, title, copy }) {
  return <header className="content-heading"><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></header>;
}

export function ContentHubPage() {
  const links = [
    ["/blog", "Journal", "Ideas, trends and cultural stories", BookOpen],
    ["/guides/buying", "Buying guides", "Make more informed product choices", Compass],
    ["/guides/product", "Product guides", "Features, materials, care and use", PackageCheck],
    ["/guides/style", "Style guides", "Practical outfit ideas and edits", Sparkles],
    ["/videos", "Video", "Watch guides, edits and stories", CirclePlay],
    ["/brand-stories", "Brand stories", "Meet the ideas behind leading labels", Star],
    ["/offers", "Offers", "Current campaigns and shopping events", Tags],
  ];
  return <main className="real-page content-hub"><ContentHeading eyebrow="MarketSphere content" title="Ideas for better shopping" copy="Editorial stories, useful guides, video and clear policy information in one place." /><section className="content-hub-grid">{links.map(([to, title, copy, Icon]) => <Link to={to} key={to}><Icon /><span><strong>{title}</strong><small>{copy}</small></span><ArrowRight /></Link>)}</section><section className="content-policy-links"><strong>Customer information</strong>{[["FAQ", "/faq"], ["Shipping policy", "/shipping"], ["Return policy", "/return-policy"], ["Refund policy", "/refund-policy"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"], ["About", "/about"]].map(([label, to]) => <Link to={to} key={to}>{label}</Link>)}</section></main>;
}

export function GuidesPage() {
  const { type = "buying" } = useParams();
  const content = guideCollections[type] || guideCollections.buying;
  return <main className="real-page editorial-page"><ContentHeading eyebrow={content.eyebrow} title={content.title} copy={content.copy} /><nav className="guide-tabs">{Object.entries(guideCollections).map(([key, item]) => <Link className={type === key ? "active" : ""} to={`/guides/${key}`} key={key}>{item.eyebrow}</Link>)}</nav><section className="guide-story-grid">{content.guides.map(([title, copy, category, image], index) => <article key={title}><img src={image} alt="" /><div><span>{category} · {5 + index} min read</span><h2>{title}</h2><p>{copy}</p><Link to={`/products?category=${category}`}>Explore products <ArrowRight /></Link></div></article>)}</section><GuideChecklist type={type} /></main>;
}

function GuideChecklist({ type }) {
  const points = type === "style" ? ["Start with pieces you already wear", "Build around colour and proportion", "Choose versatility over a single occasion"] : type === "product" ? ["Review specifications and materials", "Check care and warranty information", "Compare verified sellers"] : ["Define how you will use the product", "Compare total value, not price alone", "Read verified reviews and return terms"];
  return <aside className="guide-checklist"><ShieldCheck /><div><span>Quick checklist</span><h2>Before you choose</h2>{points.map((point) => <p key={point}><Check /> {point}</p>)}</div></aside>;
}

export function VideoContentPage() {
  const [playing, setPlaying] = useState(null);
  return <main className="real-page video-content-page"><ContentHeading eyebrow="Watch MarketSphere" title="Guides in motion" copy="Short, useful video content for products, personal style and better buying decisions." /><section className="video-grid">{videos.map(([title, category, duration, image]) => <article key={title}><button onClick={() => setPlaying({ title, image })}><img src={image} alt="" /><i><Play /></i><b>{duration}</b></button><span>{category}</span><h2>{title}</h2></article>)}</section>{playing && <div className="video-modal-backdrop" onMouseDown={() => setPlaying(null)}><section onMouseDown={(event) => event.stopPropagation()}><button onClick={() => setPlaying(null)}><X /></button><img src={playing.image} alt="" /><div><CirclePlay /><h2>{playing.title}</h2><p>MarketSphere editorial video preview</p></div></section></div>}</main>;
}

export function BrandStoriesPage() {
  return <main className="real-page brand-stories-page"><ContentHeading eyebrow="Behind the label" title="Brand stories" copy="The craft, ideas and people behind brands shaping how we shop today." /><section>{brandStories.map(([brand, title, copy, image], index) => <article key={brand}><img src={image} alt="" /><div><span>{brand}</span><h2>{title}</h2><p>{copy}</p><Link to={`/products?brand=${brand}`}>Shop the brand <ArrowRight /></Link></div><b>0{index + 1}</b></article>)}</section></main>;
}

export function OfferPages() {
  const { addToCart, toggleWishlist } = useShop();
  const offers = useMemo(() => catalog.filter((item) => item.oldPrice > item.price).sort((a, b) => (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice)).slice(0, 8), []);
  return <main className="real-page offers-content-page"><section className="offer-content-hero"><div><span>MarketSphere offers</span><h1>Offers worth opening</h1><p>Current product savings, member benefits and limited-time collections.</p><Link to="/membership">Explore member benefits <ArrowRight /></Link></div><Gift /></section><section className="offer-content-nav"><Link to="/collections/new-season">New season edit</Link><Link to="/collections/everyday-value">Everyday value</Link><Link to="/products?mode=deals">All deals</Link></section><div className="product-grid">{offers.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.id} />)}</div></main>;
}

export function CampaignLandingPage() {
  const { slug = "new-season" } = useParams();
  const { addToCart, toggleWishlist } = useShop();
  const content = slug === "everyday-value" ? { eyebrow: "Everyday value", title: "Useful pieces, considered prices", copy: "Reliable favourites selected for versatility and lasting value.", category: "Accessories" } : { eyebrow: "New season", title: "A fresh point of view", copy: "New shapes, useful layers and expressive details for the season ahead.", category: "Women" };
  const products = Array.from(new Map(catalog.filter((item) => item.category === content.category).concat(catalog).map((item) => [item.slug, item])).values()).slice(0, 8);
  return <main className="real-page campaign-page"><section className="campaign-hero"><img src={products[0].image} alt="" /><div><span>{content.eyebrow}</span><h1>{content.title}</h1><p>{content.copy}</p><a href="#campaign-products">Shop the edit <ArrowRight /></a></div></section><section id="campaign-products"><ContentHeading eyebrow="Curated collection" title="The edit" copy="Selected by the MarketSphere editorial team." /><div className="product-grid">{products.map((product) => <ProductCard product={product} onAdd={addToCart} onWishlist={toggleWishlist} key={product.id} />)}</div></section></main>;
}
