import React, { useState } from "react";
import { CalendarClock, Check, Clock3, Crown, CreditCard, Gift, PackageCheck, ShieldCheck, Sparkles, Star, Truck, X } from "lucide-react";
import { money } from "../utils/format";
import { defaultMembership } from "../data/commerceState";
import { getStored, setStored } from "../utils/storage";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Essential shopping benefits for every MarketSphere customer.",
    benefits: ["Standard rewards earning", "Member-only sale prices", "Order and price-drop alerts", "Free delivery above Rs. 1,999"],
  },
  {
    id: "premium-monthly",
    name: "Premium Monthly",
    price: 299,
    period: "month",
    description: "Flexible premium access with monthly renewal.",
    benefits: ["Free standard delivery", "5% exclusive checkout discount", "24-hour early sale access", "Priority customer support"],
  },
  {
    id: "premium-annual",
    name: "Premium Annual",
    price: 2499,
    period: "year",
    description: "Our best value with enhanced delivery benefits.",
    badge: "Save Rs. 1,089",
    benefits: ["Free standard and express delivery", "5% exclusive checkout discount", "48-hour early sale access", "Priority support and exclusive launches"],
  },
];

export default function MembershipPage() {
  const [membership, setMembership] = useState(() => getStored("marketsphere:membership", defaultMembership));
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payment, setPayment] = useState({ method: "card", card: "", expiry: "", cvv: "", upi: "" });
  const [message, setMessage] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const currentPlan = plans.find((plan) => plan.id === membership.planId) || plans[0];

  function persist(next) {
    setMembership(next);
    setStored("marketsphere:membership", next);
  }

  function subscribe(event) {
    event.preventDefault();
    if (!selectedPlan) return;
    const valid = payment.method === "upi" ? /^[\w.-]+@[\w.-]+$/.test(payment.upi) : payment.card.replace(/\D/g, "").length === 16 && /^\d{2}\/\d{2}$/.test(payment.expiry) && /^\d{3}$/.test(payment.cvv);
    if (!valid) return setMessage("Enter valid payment details to continue.");
    const now = new Date();
    const renewal = new Date(now);
    if (selectedPlan.period === "month") renewal.setMonth(renewal.getMonth() + 1);
    else renewal.setFullYear(renewal.getFullYear() + 1);
    const next = {
      planId: selectedPlan.id,
      status: "Active",
      startedAt: now.toISOString(),
      renewsAt: renewal.toISOString(),
      autoRenew: true,
      paymentMethod: payment.method === "upi" ? `UPI ${payment.upi}` : `Card ending ${payment.card.slice(-4)}`,
      history: [{ id: `MB-${Date.now().toString().slice(-6)}`, label: `${selectedPlan.name} membership payment`, amount: selectedPlan.price, date: now.toISOString(), status: "Paid" }, ...(membership.history || [])],
    };
    persist(next);
    setSelectedPlan(null);
    setMessage(`${selectedPlan.name} is active. Your benefits are ready to use.`);
  }

  function cancelMembership() {
    persist({
      ...membership,
      status: "Cancellation scheduled",
      autoRenew: false,
      history: [{ id: `MB-${Date.now().toString().slice(-6)}`, label: "Membership cancellation requested", amount: 0, date: new Date().toISOString(), status: "Scheduled" }, ...(membership.history || [])],
    });
    setShowCancel(false);
    setMessage(`Premium benefits remain active until ${new Date(membership.renewsAt).toLocaleDateString("en-IN", { dateStyle: "long" })}.`);
  }

  function resumeRenewal() {
    persist({ ...membership, status: "Active", autoRenew: true });
    setMessage("Automatic membership renewal restored.");
  }

  return <main className="real-page membership-page">
    <header className="membership-heading"><div><span>MarketSphere Membership</span><h1>More value from every order</h1><p>Choose free access or unlock premium savings, delivery and early access.</p></div><div className="membership-status"><Crown /><span><small>Current plan</small><strong>{currentPlan.name}</strong><em>{membership.status}</em></span></div></header>
    {message && <p className="wallet-message"><Check /> {message}</p>}

    {currentPlan.id !== "free" && <section className="active-membership">
      <div><Crown /><span><small>Premium benefits active</small><h2>{currentPlan.name}</h2><p>{membership.status === "Cancellation scheduled" ? "Your plan will end" : "Next renewal"} on {new Date(membership.renewsAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</p></span></div>
      <div><span>Auto-renewal<strong>{membership.autoRenew ? "On" : "Off"}</strong></span><span>Payment<strong>{membership.paymentMethod || "Saved method"}</strong></span></div>
      {membership.autoRenew ? <button onClick={() => setShowCancel(true)}>Cancel membership</button> : <button className="primary" onClick={resumeRenewal}>Resume renewal</button>}
    </section>}

    <section className="membership-plans"><header><span>Membership plans</span><h2>Choose what works for you</h2></header><div>{plans.map((plan) => <article className={`${plan.id === currentPlan.id ? "current" : ""} ${plan.id.includes("annual") ? "recommended" : ""}`} key={plan.id}>{plan.badge && <b>{plan.badge}</b>}<div className="plan-icon">{plan.id === "free" ? <Star /> : <Crown />}</div><small>{plan.id === currentPlan.id ? "Current membership" : "Membership plan"}</small><h3>{plan.name}</h3><p>{plan.description}</p><div className="plan-price"><strong>{plan.price ? money(plan.price) : "Free"}</strong><span>{plan.price ? `/${plan.period}` : "No payment required"}</span></div>{plan.benefits.map((benefit) => <p className="plan-benefit" key={benefit}><Check /> {benefit}</p>)}<button disabled={plan.id === currentPlan.id} className={plan.id === "premium-annual" ? "primary" : ""} onClick={() => plan.id === "free" ? setShowCancel(true) : setSelectedPlan(plan)}>{plan.id === currentPlan.id ? "Current plan" : plan.id === "free" ? "Switch to free" : "Choose plan"}</button></article>)}</div></section>

    <section className="membership-benefits"><header><span>Premium benefits</span><h2>Designed for frequent shoppers</h2></header><div><article><Truck /><strong>Free delivery</strong><p>Standard delivery on monthly, plus express delivery on annual membership.</p></article><article><Gift /><strong>Exclusive discounts</strong><p>Save an extra 5% automatically on eligible checkout totals.</p></article><article><Clock3 /><strong>Early sale access</strong><p>Shop major events 24 to 48 hours before general access begins.</p></article><article><ShieldCheck /><strong>Priority support</strong><p>Faster routing for order, payment, delivery and return assistance.</p></article></div></section>

    <section className="membership-history"><header><div><span>Membership activity</span><h2>Payment and renewal history</h2></div></header>{(membership.history || []).map((item) => <article key={item.id}><i>{item.amount ? <CreditCard /> : <CalendarClock />}</i><div><strong>{item.label}</strong><span>{item.id} · {new Date(item.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></div><div><strong>{item.amount ? money(item.amount) : "No charge"}</strong><span>{item.status}</span></div></article>)}</section>

    {selectedPlan && <div className="wallet-modal-backdrop" onMouseDown={() => setSelectedPlan(null)}><form className="membership-payment-modal" onSubmit={subscribe} onMouseDown={(event) => event.stopPropagation()}><header><div><span>Secure membership payment</span><h2>Activate {selectedPlan.name}</h2></div><button type="button" onClick={() => setSelectedPlan(null)}><X /></button></header><div className="membership-payment-summary"><Crown /><span><strong>{money(selectedPlan.price)}</strong><small>Renews every {selectedPlan.period}. Cancel renewal anytime.</small></span></div><div className="membership-payment-methods"><button type="button" className={payment.method === "card" ? "active" : ""} onClick={() => setPayment({ ...payment, method: "card" })}>Card</button><button type="button" className={payment.method === "upi" ? "active" : ""} onClick={() => setPayment({ ...payment, method: "upi" })}>UPI</button></div>{payment.method === "card" ? <><label>Card number<input required inputMode="numeric" maxLength="19" value={payment.card} onChange={(event) => setPayment({ ...payment, card: event.target.value })} placeholder="0000 0000 0000 0000" /></label><div><label>Expiry<input required value={payment.expiry} onChange={(event) => setPayment({ ...payment, expiry: event.target.value })} placeholder="MM/YY" /></label><label>CVV<input required maxLength="3" type="password" value={payment.cvv} onChange={(event) => setPayment({ ...payment, cvv: event.target.value.replace(/\D/g, "") })} /></label></div></> : <label>UPI ID<input required value={payment.upi} onChange={(event) => setPayment({ ...payment, upi: event.target.value })} placeholder="name@bank" /></label>}<aside><ShieldCheck /> Secure payment and recurring renewal authorization.</aside><button className="primary">Pay {money(selectedPlan.price)}</button></form></div>}

    {showCancel && <div className="wallet-modal-backdrop" onMouseDown={() => setShowCancel(false)}><section className="membership-cancel-modal" onMouseDown={(event) => event.stopPropagation()}><header><div><span>Membership cancellation</span><h2>Switch to free membership?</h2></div><button onClick={() => setShowCancel(false)}><X /></button></header><PackageCheck /><p>You will keep premium benefits until the current billing period ends. Future membership payments will stop.</p><div><button onClick={() => setShowCancel(false)}>Keep premium</button><button className="danger-button" onClick={cancelMembership}>Confirm cancellation</button></div></section></div>}
  </main>;
}
