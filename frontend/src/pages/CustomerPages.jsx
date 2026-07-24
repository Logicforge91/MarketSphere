import React, { useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Headphones,
  Home,
  LocateFixed,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Truck,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { brands } from "../data/shopData";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";

function InnerHeading({ eyebrow, title, copy, action }) {
  return (
    <header className="inner-heading">
      <div><span>{eyebrow}</span><h1>{title}</h1>{copy && <p>{copy}</p>}</div>
      {action}
    </header>
  );
}

export function AddressBookPage() {
  const storageKey = "marketsphere:addresses";
  const emptyAddress = { id: "", type: "Home", name: "", phone: "", line1: "", area: "", city: "", state: "", pincode: "", landmark: "", instructions: "", latitude: null, longitude: null, primary: false };
  const [addresses, setAddresses] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey)) || [
        { ...emptyAddress, id: "home-1", type: "Home", name: "Rahul Sharma", phone: "+91 98765 43210", line1: "125, 4th Block", area: "Koramangala", city: "Bengaluru", state: "Karnataka", pincode: "560034", landmark: "Near Forum Mall", instructions: "Call on arrival", primary: true },
        { ...emptyAddress, id: "work-1", type: "Work", name: "Rahul Sharma", phone: "+91 87654 32100", line1: "88, Brigade Road", area: "MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001", primary: false },
      ];
    } catch {
      return [];
    }
  });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyAddress);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState("");
  const serviceable = /^(110|400|560|600)\d{3}$/.test(form.pincode);
  const validPincode = /^\d{6}$/.test(form.pincode);
  const suggestions = [
    "Koramangala, Bengaluru, Karnataka",
    "MG Road, Bengaluru, Karnataka",
    "Bandra West, Mumbai, Maharashtra",
    "Connaught Place, New Delhi",
  ].filter((item) => form.area.length > 2 && item.toLowerCase().includes(form.area.toLowerCase())).slice(0, 3);

  function persist(next) {
    setAddresses(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function openEditor(address = null) {
    setForm(address ? { ...address } : { ...emptyAddress, id: `address-${Date.now()}` });
    setEditing(address?.id || "new");
    setNotice("");
  }

  function saveAddress(event) {
    event.preventDefault();
    if (!validPincode || !serviceable) return;
    let next = addresses.some((item) => item.id === form.id) ? addresses.map((item) => item.id === form.id ? form : item) : [...addresses, form];
    if (form.primary || next.length === 1) next = next.map((item) => ({ ...item, primary: item.id === form.id }));
    persist(next);
    setEditing(null);
    setNotice("Address saved successfully");
  }

  function removeAddress(id) {
    const next = addresses.filter((item) => item.id !== id);
    if (next.length && !next.some((item) => item.primary)) next[0] = { ...next[0], primary: true };
    persist(next);
    setNotice("Address deleted");
  }

  function setDefault(id) {
    persist(addresses.map((item) => ({ ...item, primary: item.id === id })));
    setNotice("Default address updated");
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      setNotice("Location detection is unavailable in this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setForm((current) => ({ ...current, latitude: coords.latitude, longitude: coords.longitude, area: current.area || "Current map location" }));
      setLocating(false);
      setNotice("Location pin updated");
    }, () => {
      setLocating(false);
      setNotice("Location permission was not granted");
    }, { timeout: 8000 });
  }

  function selectSuggestion(value) {
    const [area, city, state] = value.split(", ");
    setForm({ ...form, area, city, state });
  }

  function selectMapPoint(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setForm({ ...form, latitude: 12.8 + (1 - y) * .4, longitude: 77.4 + x * .5 });
    setNotice("Map pin selected");
  }

  const typeIcons = { Home, Work: Building2, Other: MapPin };

  return (
    <main className="real-page inner-page advanced-address-page">
      <InnerHeading eyebrow="My account" title="Address book" copy="Manage saved locations, delivery details and serviceability." action={<button className="primary" onClick={() => openEditor()}><Plus size={16} /> Add address</button>} />
      {notice && <p className="address-notice" role="status"><Check size={14} /> {notice}</p>}
      <div className="address-grid">
        {addresses.map((address) => {
          const Icon = typeIcons[address.type] || MapPin;
          return <article className="address-card" key={address.id}>
            <div className="address-card-heading"><span><Icon size={17} /> {address.type}</span>{address.primary && <b>Default</b>}</div>
            <strong>{address.name}</strong><p>{address.line1}, {address.area}, {address.city}, {address.state} - {address.pincode}</p>{address.landmark && <small>Landmark: {address.landmark}</small>}<small>{address.phone}</small>{address.instructions && <em>{address.instructions}</em>}
            <footer><button onClick={() => openEditor(address)}>Edit</button>{!address.primary && <button onClick={() => setDefault(address.id)}>Set default</button>}<button onClick={() => removeAddress(address.id)}>Delete</button></footer>
          </article>
        })}
        <button className="add-new-card" onClick={() => openEditor()}><Plus /><span>Add a new address</span></button>
      </div>

      {editing && <div className="address-editor-backdrop" onClick={() => setEditing(null)}><section className="address-editor" onClick={(event) => event.stopPropagation()}>
        <header><div><span>{editing === "new" ? "New delivery location" : "Update location"}</span><h2>{editing === "new" ? "Add address" : "Edit address"}</h2></div><button onClick={() => setEditing(null)} aria-label="Close"><X /></button></header>
        <form onSubmit={saveAddress}>
          <fieldset className="address-type-picker"><legend>Address type</legend>{["Home", "Work", "Other"].map((type) => { const Icon = typeIcons[type]; return <button className={form.type === type ? "active" : ""} type="button" onClick={() => setForm({ ...form, type })} key={type}><Icon size={15} /> {type}</button>; })}</fieldset>
          <div className="address-form-row"><label>Full name<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Mobile number<input required autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label></div>
          <label>Flat, house or building<input required autoComplete="address-line1" value={form.line1} onChange={(event) => setForm({ ...form, line1: event.target.value })} /></label>
          <label className="autocomplete-field">Area or locality<div><Search size={14} /><input required autoComplete="address-line2" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} /></div>{suggestions.length > 0 && <section>{suggestions.map((item) => <button type="button" onClick={() => selectSuggestion(item)} key={item}><MapPin size={13} /> {item}</button>)}</section>}</label>
          <div className="address-form-row"><label>City<input required value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label><label>State<input required value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} /></label></div>
          <label>Pincode<input required inputMode="numeric" maxLength="6" value={form.pincode} onChange={(event) => setForm({ ...form, pincode: event.target.value.replace(/\D/g, "") })} />{form.pincode && <small className={serviceable ? "serviceable" : "not-serviceable"}>{!validPincode ? "Enter a valid 6-digit PIN" : serviceable ? "Delivery available at this PIN code" : "We do not currently deliver to this PIN code"}</small>}</label>
          <div className="address-form-row"><label>Landmark<input value={form.landmark} onChange={(event) => setForm({ ...form, landmark: event.target.value })} placeholder="Optional" /></label><label>Delivery instructions<input value={form.instructions} onChange={(event) => setForm({ ...form, instructions: event.target.value })} placeholder="Gate, floor, call preferences" /></label></div>
          <section className="address-map"><div className="map-grid" onClick={selectMapPoint} role="button" tabIndex="0" aria-label="Select address location on map"><i className="map-pin" style={{ left: form.longitude ? "58%" : "50%", top: form.latitude ? "42%" : "50%" }}><MapPin /></i></div><div><strong>Pin address on map</strong><span>{form.latitude ? `${form.latitude.toFixed(4)}, ${form.longitude.toFixed(4)}` : "Click the map or detect your location"}</span><button type="button" onClick={detectLocation}><LocateFixed size={14} /> {locating ? "Detecting..." : "Use current location"}</button></div></section>
          <label className="default-address-check"><input type="checkbox" checked={form.primary} onChange={(event) => setForm({ ...form, primary: event.target.checked })} /> Set as default delivery address</label>
          <footer><button type="button" className="secondary" onClick={() => setEditing(null)}>Cancel</button><button className="primary" disabled={!serviceable}><Save size={15} /> Save address</button></footer>
        </form>
      </section></div>}
    </main>
  );
}

export function PaymentMethodsPage() {
  return (
    <main className="real-page inner-page">
      <InnerHeading eyebrow="My account" title="Payment methods" copy="Your saved payment details are encrypted and secure." action={<button className="primary"><Plus size={16} /> Add payment method</button>} />
      <section className="payment-list">
        <article><div className="card-brand visa">VISA</div><div><strong>Visa ending in 4242</strong><span>Expires 12/28</span></div><b>Default</b><button>Manage</button></article>
        <article><div className="card-brand mastercard">●●</div><div><strong>Mastercard ending in 8808</strong><span>Expires 08/27</span></div><button>Manage</button></article>
        <article><div className="card-brand upi">UPI</div><div><strong>rahul@upi</strong><span>Verified UPI ID</span></div><button>Manage</button></article>
      </section>
      <aside className="security-note"><ShieldCheck /><div><strong>Payments stay private</strong><p>MarketSphere never stores your full card or UPI credentials.</p></div></aside>
    </main>
  );
}

export function TrackOrderPage() {
  const { latestOrder } = useShop();
  const shipments = latestOrder?.shipments || [];
  const steps = [
    { label: "Order confirmed", date: "24 May, 10:25 AM", done: true },
    { label: "Packed", date: "25 May, 08:10 AM", done: true },
    { label: "Shipped", date: "25 May, 06:40 PM", done: true },
    { label: "Out for delivery", date: "Expected 27 May" },
  ];

  return (
    <main className="real-page inner-page track-page">
      <InnerHeading eyebrow={`Order #${latestOrder?.id || "MS205186"}`} title="Track your order" copy={latestOrder ? `${latestOrder.deliveryMethod?.name || "Standard delivery"} · ${latestOrder.deliveryDate || "Estimated in 3-5 business days"}` : "Estimated delivery: Wednesday, 27 May"} />
      <section className="tracking-card">
        <div className="tracking-product"><PackageCheck /><div><strong>Floral Maxi Dress</strong><span>Size M · Multi colour · Qty 1</span></div><Link to="/product/floral-maxi-dress">View product</Link></div>
        <div className="tracking-timeline">{steps.map((step) => <div className={step.done ? "done" : ""} key={step.label}><i>{step.done ? <Check size={14} /> : <Truck size={14} />}</i><strong>{step.label}</strong><span>{step.date}</span></div>)}</div>
        <div className="tracking-meta"><div><span>Tracking number</span><strong>TMX34567890</strong></div><div><span>Delivery address</span><strong>Rahul Sharma, Koramangala, Bengaluru</strong></div></div>
      </section>
      {latestOrder && <section className="shipment-dashboard">
        <header><div><span>Shipment status</span><h2>{shipments.length || 1} active {(shipments.length || 1) === 1 ? "package" : "packages"}</h2></div><b>{latestOrder.deliveryMethod?.name}</b></header>
        <div className="seller-shipment-list">{(shipments.length ? shipments : [{ id: "SHP-1", seller: "MarketSphere Select", items: latestOrder.items || [], estimate: "3-5 days" }]).map((shipment, index) => <article className="seller-shipment-card" key={shipment.id}>
          <div className="shipment-card-heading"><div><small>Package {index + 1}</small><strong>{shipment.seller}</strong></div><span>{index ? "Processing" : "Shipped"}</span></div>
          <div className="shipment-product-list">{shipment.items.map((item) => <div key={`${shipment.id}-${item.id || item.name}`}><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>Qty {item.qty || 1}</small></span></div>)}</div>
          <div className="shipment-progress"><i className="done" /><i className="done" /><i className={index ? "" : "done"} /><i /></div>
          <div className="shipment-progress-labels"><span>Confirmed</span><span>Packed</span><span>Shipped</span><span>Delivered</span></div>
          <footer><span>Tracking ID <strong>{shipment.id}-{latestOrder.id}</strong></span><span>Estimated <strong>{shipment.estimate}</strong></span></footer>
        </article>)}</div>
        <aside className="delivery-preference-summary"><div><strong>{latestOrder.pickupStore ? "Pickup location" : "Delivery preference"}</strong><span>{latestOrder.pickupStore || (latestOrder.contactless ? "Contactless delivery" : "Hand delivery")}</span></div>{latestOrder.deliverySlot && <div><strong>Selected slot</strong><span>{latestOrder.deliveryDate} · {latestOrder.deliverySlot}</span></div>}{latestOrder.deliveryInstructions && <div><strong>Instructions</strong><span>{latestOrder.deliveryInstructions}</span></div>}</aside>
      </section>}
    </main>
  );
}

export function OrderSuccessPage() {
  const { latestOrder } = useShop();

  if (!latestOrder) {
    return <main className="order-success-page"><div className="success-ring"><Check /></div><h1>No recent order</h1><p>Complete checkout to see your confirmation here.</p><div className="success-actions"><Link className="primary" to="/products">Start shopping</Link></div></main>;
  }

  return (
    <main className="order-success-page">
      <div className="success-ring"><Check /></div>
      <span>Order #{latestOrder.id}</span><h1>Order placed successfully</h1>
      <p>Thank you for shopping with MarketSphere. We sent a confirmation to your email.</p>
      <div className="success-summary"><div><Truck /><span>Order total<strong>{money(latestOrder.total)}</strong></span></div><div><CreditCard /><span>Payment method<strong>{latestOrder.paymentMethod || "Paid"}</strong></span></div></div>
      <section className="payment-receipt">
        <header><div><span>Payment receipt</span><strong>{latestOrder.payment?.status || "Order confirmed"}</strong></div><button onClick={() => window.print()}>Print receipt</button></header>
        <div><span>Receipt number</span><strong>RCT-{latestOrder.id}</strong></div>
        <div><span>Transaction reference</span><strong>{latestOrder.payment?.transactionId || "Pay on delivery"}</strong></div>
        <div><span>Processed by</span><strong>{latestOrder.payment?.gateway || "MarketSphere"}</strong></div>
        <div><span>Payment instrument</span><strong>{latestOrder.payment?.instrument || latestOrder.paymentMethod}</strong></div>
        <div className="receipt-total"><span>Amount</span><strong>{money(latestOrder.total)}</strong></div>
      </section>
      <div className="success-actions"><Link className="primary" to="/">Continue shopping</Link><Link className="secondary" to="/track-order">Track order</Link></div>
    </main>
  );
}

const faqItems = [
  ["How can I track my order?", "Open My Orders and select Track Order. Live shipment milestones appear as soon as the courier updates them."],
  ["What is your return policy?", "Eligible products can be returned within seven days of delivery in their original condition."],
  ["How long does shipping take?", "Standard delivery usually takes three to six business days depending on your location."],
  ["Can I change my delivery address?", "You can update the address before an order is packed from the order detail screen."],
  ["How do I contact customer support?", "Use the contact page, email care@marketsphere.in, or call our customer-care team."],
];

export function FaqPage() {
  const [open, setOpen] = useState(0);
  return (
    <main className="real-page inner-page narrow-page">
      <InnerHeading eyebrow="Help centre" title="Frequently asked questions" copy="Quick answers for shopping, delivery, payment, and returns." />
      <div className="faq-list">{faqItems.map(([question, answer], index) => <article className={open === index ? "open" : ""} key={question}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>{question}<ChevronDown /></button>{open === index && <p>{answer}</p>}</article>)}</div>
    </main>
  );
}

export function ContactPage() {
  return (
    <main className="real-page inner-page">
      <InnerHeading eyebrow="Customer care" title="Get in touch" copy="Our team is available Monday to Saturday, 9 AM to 8 PM." />
      <div className="contact-layout">
        <section className="contact-methods">
          <article><Phone /><div><strong>Call us</strong><span>+91 98765 43210</span></div></article>
          <article><Mail /><div><strong>Email</strong><span>care@marketsphere.in</span></div></article>
          <article><Headphones /><div><strong>Live support</strong><span>Average response under 5 minutes</span></div></article>
          <article><MapPin /><div><strong>Office</strong><span>BKC, Mumbai, Maharashtra</span></div></article>
        </section>
        <form className="contact-form" onSubmit={(event) => event.preventDefault()}><label>Name<input required /></label><label>Email<input type="email" required /></label><label>Topic<select><option>Order support</option><option>Returns and refunds</option><option>Product information</option></select></label><label>Message<textarea required /></label><button className="primary">Send message <ArrowRight size={16} /></button></form>
      </div>
    </main>
  );
}

const stories = [
  { title: "How to build a timeless capsule wardrobe", category: "Style", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" },
  { title: "The new rules of occasion dressing", category: "Trends", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80" },
  { title: "Five accessories that transform a look", category: "The edit", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80" },
];

export function BlogPage() {
  return <main className="real-page inner-page"><InnerHeading eyebrow="MarketSphere journal" title="Stories, style and culture" copy="Fresh perspectives from our editors and creative community." /><div className="story-grid">{stories.map((story) => <article key={story.title}><img src={story.image} alt="" loading="lazy" /><span>{story.category}</span><h2>{story.title}</h2><Link to="/blog">Read story <ArrowRight size={14} /></Link></article>)}</div></main>;
}

export function BrandsPage() {
  const allBrands = [...brands, "Levi's", "ONLY", "Vero Moda", "Biba", "Fabindia", "Lakme", "Forest Essentials", "Titan"];
  return <main className="real-page inner-page"><InnerHeading eyebrow="Brand directory" title="Brands on MarketSphere" copy="Explore global icons and emerging Indian labels." /><div className="brand-directory">{allBrands.map((brand) => <Link to="/products" key={brand}><strong>{brand}</strong><span>Shop collection <ArrowRight size={13} /></span></Link>)}</div></main>;
}

export function AboutPage() {
  return (
    <main className="real-page inner-page about-page">
      <section className="about-hero"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85" alt="MarketSphere fashion team" /><div><span>About MarketSphere</span><h1>Shopping, made more considered</h1><p>We connect modern shoppers with fashion, beauty, and lifestyle products chosen for quality, relevance, and everyday value.</p></div></section>
      <section className="value-grid"><article><ShieldCheck /><h2>Quality first</h2><p>Products and sellers are reviewed before reaching our marketplace.</p></article><article><CircleHelp /><h2>Customer focused</h2><p>Clear policies and helpful support at every stage of the journey.</p></article><article><Truck /><h2>Built for India</h2><p>Payments, delivery, and discovery designed around how India shops.</p></article></section>
    </main>
  );
}

const policyContent = {
  shipping: {
    eyebrow: "Delivery information",
    title: "Shipping and delivery",
    copy: "Clear delivery timelines and options for every MarketSphere order.",
    sections: [
      ["Standard delivery", "Most orders arrive within three to six business days. Delivery estimates are shown before payment and in your order confirmation."],
      ["Express delivery", "Express delivery is available for eligible products and pincodes. The applicable fee and estimated date appear during checkout."],
      ["Order tracking", "A tracking link becomes available as soon as your order ships. You can also follow every milestone from My Orders."],
      ["Delivery issues", "If a parcel is delayed or marked delivered incorrectly, contact customer care within 48 hours so we can investigate."],
    ],
  },
  privacy: {
    eyebrow: "Your data",
    title: "Privacy policy",
    copy: "How MarketSphere collects, uses, and protects your information.",
    sections: [
      ["Information we collect", "We collect account, order, payment-reference, device, and preference information needed to provide and improve our services."],
      ["How we use information", "Information supports order fulfilment, fraud prevention, customer support, product discovery, and communications you choose to receive."],
      ["Your choices", "You can update profile details, communication preferences, and saved addresses from your account at any time."],
      ["Security", "Sensitive data is protected using access controls, encryption, and trusted payment processors. Full card credentials are not stored by MarketSphere."],
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms and conditions",
    copy: "The rules that govern use of MarketSphere services.",
    sections: [
      ["Using MarketSphere", "You agree to provide accurate information, keep account credentials secure, and use the service only for lawful personal shopping."],
      ["Orders and pricing", "Orders remain subject to product availability and payment confirmation. We may cancel and refund orders affected by listing or pricing errors."],
      ["Returns and refunds", "Returns are governed by the policy displayed on each product and the condition of the item received by our return centre."],
      ["Marketplace content", "Product names, images, editorial content, and interface elements may not be reproduced without permission."],
    ],
  },
  refund: {
    eyebrow: "Money back",
    title: "Refund policy",
    copy: "How approved refunds are calculated, issued, and tracked.",
    sections: [
      ["Refund eligibility", "Refunds are issued after an eligible cancellation or after a returned product passes inspection. Any non-refundable fees are shown before confirmation."],
      ["Refund methods", "Approved amounts can return to the original payment method, MarketSphere Wallet, or an eligible bank account selected during the request."],
      ["Processing timelines", "Wallet refunds are usually immediate after approval. Card, UPI, and bank refunds generally take five to seven business days."],
      ["Partial and failed refunds", "Item-level returns receive partial refunds. If a transfer fails, you can update details and retry from the order refund timeline."],
    ],
  },
  return: {
    eyebrow: "Easy resolutions",
    title: "Return and exchange policy",
    copy: "Eligibility, pickup, replacement, and exchange information.",
    sections: [
      ["Return window", "Most eligible products may be returned within seven days of delivery. The exact window and exclusions appear on each product page."],
      ["Product condition", "Items must be unused, unwashed, and returned with original packaging, labels, accessories, and authenticity material."],
      ["Pickup and inspection", "Choose an eligible pickup address and slot. Refund or replacement processing begins after the product passes inspection."],
      ["Replacement and exchange", "Eligible products may be replaced or exchanged for available size or colour variants. Unavailable variants can be refunded instead."],
    ],
  },
};

function PolicyPage({ type }) {
  const content = policyContent[type];
  return (
    <main className="real-page inner-page policy-page">
      <InnerHeading eyebrow={content.eyebrow} title={content.title} copy={content.copy} />
      <div className="policy-layout">
        <aside>{content.sections.map(([title]) => <a href={`#${title.toLowerCase().replaceAll(" ", "-")}`} key={title}>{title}</a>)}</aside>
        <section>{content.sections.map(([title, body]) => <article id={title.toLowerCase().replaceAll(" ", "-")} key={title}><h2>{title}</h2><p>{body}</p></article>)}</section>
      </div>
    </main>
  );
}

export function ShippingPage() {
  return <PolicyPage type="shipping" />;
}

export function PrivacyPage() {
  return <PolicyPage type="privacy" />;
}

export function TermsPage() {
  return <PolicyPage type="terms" />;
}

export function RefundPolicyPage() {
  return <PolicyPage type="refund" />;
}

export function ReturnPolicyPage() {
  return <PolicyPage type="return" />;
}

export function CareersPage() {
  const roles = [
    ["Senior Frontend Engineer", "Technology · Bengaluru · Hybrid"],
    ["Category Manager, Fashion", "Merchandising · Mumbai · On-site"],
    ["Product Designer", "Design · Bengaluru · Hybrid"],
    ["Customer Experience Lead", "Operations · Gurugram · On-site"],
  ];
  return (
    <main className="real-page inner-page careers-page">
      <section className="careers-hero"><span>Careers at MarketSphere</span><h1>Build the future of shopping</h1><p>Join a multidisciplinary team creating useful, inclusive commerce experiences for millions of customers.</p><a href="#open-roles">Explore open roles <ArrowRight size={15} /></a></section>
      <section id="open-roles" className="role-list"><InnerHeading eyebrow="Open positions" title="Find your next role" />{roles.map(([role, meta]) => <article key={role}><div><strong>{role}</strong><span>{meta}</span></div><button>View role <ArrowRight size={14} /></button></article>)}</section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <span>404</span><h1>This page stepped out</h1><p>The link may be outdated, but the latest MarketSphere edit is waiting.</p>
      <div><Link className="primary" to="/">Go home</Link><Link className="secondary" to="/products">Shop products</Link></div>
    </main>
  );
}
