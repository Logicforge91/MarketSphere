import React, { useMemo, useState } from "react";
import { CalendarClock, Check, Clock3, Gift, History, Mail, RefreshCw, Search, Send, ShieldCheck, Sparkles } from "lucide-react";
import { money } from "../utils/format";
import { defaultGiftCards } from "../data/commerceState";
import { getStored, setStored } from "../utils/storage";

const themes = [
  { id: "celebrate", name: "Celebrate", note: "For birthdays and milestones", className: "celebrate" },
  { id: "thank-you", name: "Thank you", note: "A thoughtful gesture", className: "thank-you" },
  { id: "minimal", name: "MarketSphere", note: "Simple and versatile", className: "minimal" },
  { id: "festive", name: "Festive", note: "For joyful occasions", className: "festive" },
];

export default function GiftCardsPage() {
  const [cards, setCards] = useState(() => getStored("marketsphere:gift-cards", defaultGiftCards));
  const [tab, setTab] = useState("purchase");
  const [theme, setTheme] = useState("celebrate");
  const [form, setForm] = useState({ amount: "1000", recipient: "", email: "", sender: "", message: "", deliveryDate: new Date().toISOString().slice(0, 10) });
  const [lookup, setLookup] = useState({ code: "", pin: "" });
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const transactions = useMemo(() => cards.flatMap((card) => card.transactions.map((item) => ({ ...item, code: card.code }))).sort((a, b) => new Date(b.date) - new Date(a.date)), [cards]);

  function persist(next) {
    setCards(next);
    setStored("marketsphere:gift-cards", next);
  }

  function purchase(event) {
    event.preventDefault();
    const amount = Number(form.amount);
    if (amount < 250 || amount > 25000) return setMessage("Choose an amount between Rs. 250 and Rs. 25,000.");
    const now = new Date();
    const code = `MSPH-${now.getFullYear()}-${Date.now().toString().slice(-6)}`;
    const card = {
      code,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      amount,
      balance: amount,
      theme,
      recipient: form.recipient,
      email: form.email,
      sender: form.sender,
      note: form.message,
      deliveryDate: form.deliveryDate,
      expiry: new Date(now.setFullYear(now.getFullYear() + 1)).toISOString().slice(0, 10),
      status: form.deliveryDate > new Date().toISOString().slice(0, 10) ? "Scheduled" : "Delivered",
      transactions: [{ id: `GC-${Date.now().toString().slice(-5)}`, type: "credit", label: "Gift card purchased", amount, date: new Date().toISOString() }],
    };
    persist([card, ...cards]);
    setResult(card);
    setMessage(card.status === "Scheduled" ? `Gift card scheduled for ${new Date(`${form.deliveryDate}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" })}.` : "Gift card purchased and sent.");
    setTab("cards");
  }

  function checkBalance(event) {
    event.preventDefault();
    const card = cards.find((item) => item.code === lookup.code.trim().toUpperCase() && item.pin === lookup.pin.trim());
    setResult(card || null);
    setMessage(card ? "Gift card verified." : "The gift-card code or PIN is incorrect.");
  }

  function resend(card) {
    persist(cards.map((item) => item.code === card.code ? { ...item, status: "Delivered", lastSentAt: new Date().toISOString() } : item));
    setMessage(`Gift card resent to ${card.email}.`);
  }

  return <main className="real-page gift-card-page">
    <header className="gift-card-heading"><div><span>MarketSphere Gift Cards</span><h1>Give them the freedom to choose</h1><p>Send now or schedule a personalized digital gift card for later.</p></div><div className="gift-card-hero-mark"><Gift /><Sparkles /></div></header>
    {message && <p className="wallet-message"><Check /> {message}</p>}
    <nav className="gift-card-tabs">{[["purchase", "Purchase"], ["balance", "Check balance"], ["cards", "My gift cards"], ["history", "History"]].map(([id, label]) => <button className={tab === id ? "active" : ""} onClick={() => { setTab(id); setMessage(""); }} key={id}>{label}</button>)}</nav>

    {tab === "purchase" && <form className="gift-purchase-layout" onSubmit={purchase}>
      <section className="gift-card-form">
        <header><span>Digital gift card</span><h2>Personalize your gift</h2></header>
        <div className="gift-amounts">{[500, 1000, 2000, 5000].map((amount) => <button type="button" className={Number(form.amount) === amount ? "active" : ""} onClick={() => setForm({ ...form, amount: String(amount) })} key={amount}>{money(amount)}</button>)}</div>
        <label>Custom amount<input type="number" min="250" max="25000" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label>
        <div className="gift-field-row"><label>Recipient name<input required value={form.recipient} onChange={(event) => setForm({ ...form, recipient: event.target.value })} placeholder="Full name" /></label><label>Recipient email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@example.com" /></label></div>
        <div className="gift-field-row"><label>Your name<input required value={form.sender} onChange={(event) => setForm({ ...form, sender: event.target.value })} /></label><label>Delivery date<input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.deliveryDate} onChange={(event) => setForm({ ...form, deliveryDate: event.target.value })} /></label></div>
        <label>Personal message<textarea maxLength="180" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Write a short message" /><small>{form.message.length}/180</small></label>
        <button className="primary"><Send /> Purchase and send</button>
      </section>
      <aside className="gift-theme-panel"><header><span>Gift-card themes</span><h2>Choose a design</h2></header><div className="gift-theme-grid">{themes.map((item) => <button type="button" className={theme === item.id ? `active ${item.className}` : item.className} onClick={() => setTheme(item.id)} key={item.id}><Gift /><strong>{item.name}</strong><small>{item.note}</small></button>)}</div><article className={`gift-card-preview ${themes.find((item) => item.id === theme)?.className}`}><span>MARKETSPHERE</span><Gift /><div><small>Gift card value</small><strong>{money(Number(form.amount) || 0)}</strong></div><p>For {form.recipient || "someone special"}</p></article></aside>
    </form>}

    {tab === "balance" && <section className="gift-balance-check"><ShieldCheck /><span>Secure balance check</span><h2>Check a gift-card balance</h2><p>Enter the code and four-digit PIN from the gift-card email.</p><form onSubmit={checkBalance}><label>Gift-card code<input required value={lookup.code} onChange={(event) => setLookup({ ...lookup, code: event.target.value.toUpperCase() })} placeholder="MSPH-2026-000000" /></label><label>PIN<input required maxLength="4" value={lookup.pin} onChange={(event) => setLookup({ ...lookup, pin: event.target.value.replace(/\D/g, "") })} placeholder="4 digits" /></label><button className="primary"><Search /> Check balance</button></form>{result && <article><Gift /><div><span>Available balance</span><strong>{money(result.balance)}</strong><small>Expires {new Date(`${result.expiry}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "long" })}</small></div></article>}</section>}

    {tab === "cards" && <section className="gift-card-list"><header><div><span>Purchased and received</span><h2>My gift cards</h2></div><small>{cards.length} cards</small></header>{cards.map((card) => <article key={card.code}><div className={`gift-card-mini ${themes.find((item) => item.id === card.theme)?.className}`}><Gift /><strong>{money(card.balance)}</strong></div><div><strong>{card.recipient}</strong><span>{card.code} · PIN {card.pin}</span><small><Clock3 /> Expires {new Date(`${card.expiry}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" })}</small></div><i className={card.status.toLowerCase()}>{card.status}</i><button onClick={() => resend(card)} title="Resend gift card"><RefreshCw /> Resend</button></article>)}</section>}

    {tab === "history" && <section className="gift-history wallet-transactions"><header><div><span>Gift-card transactions</span><h2>Activity history</h2></div></header>{transactions.map((item) => <article key={`${item.code}-${item.id}`}><i className={item.type}>{item.type === "credit" ? <Mail /> : <Gift />}</i><div><strong>{item.label}</strong><span>{item.code} · {new Date(item.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></div><div><strong className={item.type}>{item.type === "credit" ? "+" : "-"}{money(item.amount)}</strong><span>{item.id}</span></div></article>)}</section>}

    <aside className="gift-card-terms"><CalendarClock /><p>Gift cards remain valid for 12 months from issue, cannot be withdrawn as cash, and may be used across eligible MarketSphere purchases.</p><History /><p>Every redemption appears in gift-card history after order confirmation.</p></aside>
  </main>;
}
