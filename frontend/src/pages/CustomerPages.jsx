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
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Plus,
  ShieldCheck,
  Truck,
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
  const addresses = [
    { icon: Home, label: "Home", name: "Rahul Sharma", address: "125, 4th Block, Koramangala, Bengaluru, Karnataka - 560034", phone: "+91 98765 43210", primary: true },
    { icon: Building2, label: "Office", name: "Rahul Sharma", address: "88, Brigade Road, MG Road, Bengaluru, Karnataka - 560001", phone: "+91 87654 32100" },
  ];

  return (
    <main className="real-page inner-page">
      <InnerHeading eyebrow="My account" title="Address book" copy="Manage delivery locations for a faster checkout." action={<button className="primary"><Plus size={16} /> Add address</button>} />
      <div className="address-grid">
        {addresses.map(({ icon: Icon, ...address }) => (
          <article className="address-card" key={address.label}>
            <div className="address-card-heading"><span><Icon size={17} /> {address.label}</span>{address.primary && <b>Default</b>}</div>
            <strong>{address.name}</strong><p>{address.address}</p><small>{address.phone}</small>
            <footer><button>Edit</button><button>Delete</button></footer>
          </article>
        ))}
        <button className="add-new-card"><Plus /><span>Add a new address</span></button>
      </div>
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
  const steps = [
    { label: "Order confirmed", date: "24 May, 10:25 AM", done: true },
    { label: "Packed", date: "25 May, 08:10 AM", done: true },
    { label: "Shipped", date: "25 May, 06:40 PM", done: true },
    { label: "Out for delivery", date: "Expected 27 May" },
  ];

  return (
    <main className="real-page inner-page track-page">
      <InnerHeading eyebrow="Order #MS205186" title="Track your order" copy="Estimated delivery: Wednesday, 27 May" />
      <section className="tracking-card">
        <div className="tracking-product"><PackageCheck /><div><strong>Floral Maxi Dress</strong><span>Size M · Multi colour · Qty 1</span></div><Link to="/product/floral-maxi-dress">View product</Link></div>
        <div className="tracking-timeline">{steps.map((step) => <div className={step.done ? "done" : ""} key={step.label}><i>{step.done ? <Check size={14} /> : <Truck size={14} />}</i><strong>{step.label}</strong><span>{step.date}</span></div>)}</div>
        <div className="tracking-meta"><div><span>Tracking number</span><strong>TMX34567890</strong></div><div><span>Delivery address</span><strong>Rahul Sharma, Koramangala, Bengaluru</strong></div></div>
      </section>
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
