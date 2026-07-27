import React, { useState } from "react";
import { Apple, ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, Play, ShieldCheck, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { getStored, setStored } from "../../utils/storage";

const groups = [
  ["Company", [["About us", "/about"], ["Careers", "/careers"], ["Contact us", "/contact"], ["Sell on MarketSphere", "/sell-with-us"], ["Store locator", "/stores"]]],
  ["Customer care", [["Help centre", "/support"], ["FAQs", "/faq"], ["Track order", "/track-order"], ["Returns", "/returns"], ["Chat support", "/chat"]]],
  ["Policies", [["Terms and conditions", "/terms"], ["Privacy policy", "/privacy"], ["Shipping policy", "/shipping"], ["Return policy", "/return-policy"], ["Refund policy", "/refund-policy"], ["Cancellation policy", "/cancellation-policy"]]],
];

export default function SiteFooter() {
  const [email, setEmail] = useState(() => getStored("marketsphere:newsletter-email", ""));
  const [status, setStatus] = useState("");

  function subscribe(event) {
    event.preventDefault();
    setStored("marketsphere:newsletter-email", email);
    setStatus("Subscription confirmed. Check your inbox for the welcome offer.");
  }

  return <footer className="site-footer">
    <section className="site-footer-newsletter">
      <div><span>MarketSphere notes</span><h2>New arrivals, useful edits and private offers.</h2><p>One thoughtful email at a time. Unsubscribe whenever you choose.</p></div>
      <form onSubmit={subscribe}><label className="sr-only" htmlFor="footer-email">Email address</label><div><Mail /><input id="footer-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" /><button aria-label="Subscribe to newsletter"><ArrowRight /></button></div><small><ShieldCheck /> Your email is protected by our privacy policy.</small><p role="status">{status}</p></form>
    </section>
    <div className="site-footer-main">
      <section className="site-footer-brand"><Link to="/">MARKETSPHERE<small>Elevate everyday</small></Link><p>Considered fashion, beauty and lifestyle products from verified brands and sellers.</p><span><MapPin /> Mumbai · Bengaluru · Delhi NCR</span><div className="footer-socials"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="MarketSphere on Instagram"><Instagram /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="MarketSphere on Facebook"><Facebook /></a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="MarketSphere on YouTube"><Youtube /></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="MarketSphere on LinkedIn"><Linkedin /></a></div></section>
      {groups.map(([title, links]) => <nav aria-label={title} key={title}><h3>{title}</h3>{links.map(([label, to]) => <Link to={to} key={to}>{label}</Link>)}</nav>)}
      <section className="footer-apps"><h3>Shop on the app</h3><p>Save products offline and get delivery updates.</p><a href="https://play.google.com/store" target="_blank" rel="noreferrer"><Play /><span><small>GET IT ON</small>Google Play</span></a><a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer"><Apple /><span><small>DOWNLOAD ON THE</small>App Store</span></a></section>
    </div>
    <aside className="site-footer-legal"><span>© 2026 MarketSphere Commerce</span><span>Secure payments · Verified sellers · Customer-first support</span><Link to="/security-privacy">Privacy choices</Link></aside>
  </footer>;
}
