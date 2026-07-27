import React, { useMemo, useState } from "react";
import { ArrowRight, Building2, Check, Clock3, LocateFixed, MapPin, PackageCheck, Search, ShieldCheck, Store, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export function CancellationPolicyPage() {
  const sections = [
    ["Before an order is packed", "You can cancel an entire order or individual eligible items from My Orders. Cancellation is immediate when fulfilment has not started."],
    ["After packing or shipping", "Once an item is packed, cancellation may no longer be available. You can refuse eligible deliveries or start a return after delivery."],
    ["Refund timing", "Prepaid cancellations are refunded to your selected method. Wallet refunds are usually immediate; bank, card and UPI refunds generally take five to seven business days."],
    ["Seller cancellations", "If a seller cannot fulfil an item, we cancel it automatically, notify you and issue a full refund without a cancellation fee."],
  ];
  return <main className="real-page inner-page policy-page"><header className="info-page-heading"><span>Order changes</span><h1>Cancellation policy</h1><p>When and how MarketSphere orders can be cancelled.</p></header><div className="policy-layout"><aside>{sections.map(([title]) => <a href={`#${title.replaceAll(" ", "-").toLowerCase()}`} key={title}>{title}</a>)}</aside><section>{sections.map(([title, copy]) => <article id={title.replaceAll(" ", "-").toLowerCase()} key={title}><h2>{title}</h2><p>{copy}</p></article>)}</section></div><Link className="primary info-policy-action" to="/orders">Review your orders <ArrowRight /></Link></main>;
}

export function SellerRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  return <main className="real-page seller-registration-page">
    <section className="seller-registration-intro"><span>MarketSphere partners</span><h1>Build your store where customers are ready to discover.</h1><p>Verified sellers get catalog tools, protected payments, shipping support and transparent performance insights.</p><div><article><Store /><strong>Curated storefront</strong><small>Tell your brand story</small></article><article><Truck /><strong>Delivery network</strong><small>Serve more regions</small></article><article><ShieldCheck /><strong>Protected payouts</strong><small>Clear settlement tracking</small></article></div></section>
    <form className="seller-registration-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><header><Building2 /><div><span>Seller registration</span><h2>Tell us about your business</h2></div></header><div><label>Business name<input required autoComplete="organization" /></label><label>Contact name<input required autoComplete="name" /></label><label>Business email<input required type="email" autoComplete="email" /></label><label>Mobile number<input required type="tel" autoComplete="tel" /></label><label>Business type<select><option>Brand</option><option>Retailer</option><option>Manufacturer</option><option>Authorized distributor</option></select></label><label>Primary category<select><option>Fashion</option><option>Beauty</option><option>Footwear</option><option>Accessories</option><option>Home and lifestyle</option></select></label><label className="wide">GSTIN or registration number<input required /></label><label className="wide auth-check"><input type="checkbox" required /><span>I confirm that I am authorized to register this business and accept the seller terms.</span></label></div><button className="primary">Submit for verification <ArrowRight /></button>{submitted && <p className="seller-submit-status" role="status"><Check /> Application received. Our marketplace team will contact you within two business days.</p>}</form>
  </main>;
}

const stores = [
  { city: "Mumbai", name: "MarketSphere Experience, BKC", address: "Maker Maxity, Bandra Kurla Complex", hours: "10 AM - 9 PM", services: "Pickup · Returns · Styling" },
  { city: "Bengaluru", name: "MarketSphere Indiranagar", address: "100 Feet Road, Indiranagar", hours: "10 AM - 9 PM", services: "Pickup · Returns · Beauty" },
  { city: "Delhi NCR", name: "MarketSphere CyberHub", address: "DLF Cyber City, Gurugram", hours: "11 AM - 10 PM", services: "Pickup · Returns · Styling" },
  { city: "Pune", name: "MarketSphere Koregaon Park", address: "North Main Road, Koregaon Park", hours: "10 AM - 9 PM", services: "Pickup · Returns" },
];

export function StoreLocatorPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => stores.filter((store) => `${store.city} ${store.name} ${store.address}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <main className="real-page store-locator-page"><header className="info-page-heading"><span>Visit MarketSphere</span><h1>Find a store or pickup point</h1><p>Explore products, collect orders and make eligible returns in person.</p><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search city, area or store" /></label></header><div className="store-locator-layout"><section className="store-map" aria-label="Store locations illustration"><div><LocateFixed /><strong>{results.length} locations</strong><span>Across major shopping districts</span></div>{results.map((store, index) => <i style={{ "--x": `${18 + index * 21}%`, "--y": `${30 + (index % 2) * 30}%` }} key={store.name}><MapPin /></i>)}</section><section className="store-results">{results.length ? results.map((store) => <article key={store.name}><MapPin /><div><span>{store.city}</span><h2>{store.name}</h2><p>{store.address}</p><small><Clock3 /> {store.hours}</small><small><PackageCheck /> {store.services}</small></div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`} target="_blank" rel="noreferrer">Directions <ArrowRight /></a></article>) : <div className="store-empty"><Store /><h2>No nearby locations found</h2><p>Try a larger city or another area.</p></div>}</section></div></main>;
}
