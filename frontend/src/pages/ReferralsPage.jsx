import React, { useMemo, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Clock3, Copy, Gift, Link2, Mail, MessageCircle, Send, Share2, ShieldCheck, Smartphone, Users, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const initialReferrals = [
  { id: "REF-1041", contact: "priya@example.com", name: "Priya", date: "2026-07-18T10:15:00.000Z", status: "Reward earned", reward: 300 },
  { id: "REF-1038", contact: "+91 98765 12345", name: "Arjun", date: "2026-07-15T08:30:00.000Z", status: "First order pending", reward: 300 },
  { id: "REF-1024", contact: "same-device@example.com", name: "Review required", date: "2026-07-08T13:40:00.000Z", status: "Under validation", reward: 0 },
];

function readStored() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:referrals")) || initialReferrals;
  } catch {
    return initialReferrals;
  }
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const code = `MS${(user?.name || "MARKET").replace(/\W/g, "").slice(0, 6).toUpperCase()}26`;
  const link = `${window.location.origin}/register?ref=${code}`;
  const [referrals, setReferrals] = useState(readStored);
  const [form, setForm] = useState({ name: "", contact: "" });
  const [message, setMessage] = useState("");
  const [showRules, setShowRules] = useState(false);
  const earned = referrals.filter((item) => item.status === "Reward earned").reduce((sum, item) => sum + item.reward, 0);
  const pending = referrals.filter((item) => item.status.includes("pending") || item.status === "Under validation").length;
  const fraudSignals = useMemo(() => referrals.filter((item) => item.status === "Under validation").length, [referrals]);

  function persist(next) {
    setReferrals(next);
    window.localStorage.setItem("marketsphere:referrals", JSON.stringify(next));
  }

  async function shareReferral(channel) {
    const text = `Join MarketSphere with my referral code ${code} and unlock a welcome reward: ${link}`;
    if (channel === "native" && navigator.share) {
      await navigator.share({ title: "Join MarketSphere", text, url: link });
      return;
    }
    if (channel === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    else if (channel === "email") window.location.href = `mailto:?subject=${encodeURIComponent("Your MarketSphere invite")}&body=${encodeURIComponent(text)}`;
    else {
      await navigator.clipboard?.writeText(channel === "code" ? code : link);
      setMessage(`${channel === "code" ? "Referral code" : "Referral link"} copied.`);
    }
  }

  function invite(event) {
    event.preventDefault();
    const contact = form.contact.trim().toLowerCase();
    const ownEmail = user?.email?.toLowerCase();
    const normalizedPhone = contact.replace(/\D/g, "");
    if (!contact.includes("@") && normalizedPhone.length < 10) return setMessage("Enter a valid email address or mobile number.");
    if (contact === ownEmail || (user?.mobile && normalizedPhone === user.mobile.replace(/\D/g, ""))) return setMessage("You cannot refer your own account.");
    if (referrals.some((item) => item.contact.toLowerCase() === contact)) return setMessage("This contact has already been invited.");
    const suspicious = /test|fake|same-device/i.test(contact) || referrals.filter((item) => new Date(item.date).toDateString() === new Date().toDateString()).length >= 5;
    const referral = { id: `REF-${Date.now().toString().slice(-5)}`, contact: form.contact.trim(), name: form.name.trim() || "Invited contact", date: new Date().toISOString(), status: suspicious ? "Under validation" : "Invite sent", reward: suspicious ? 0 : 300 };
    persist([referral, ...referrals]);
    setForm({ name: "", contact: "" });
    setMessage(suspicious ? "Invite recorded and queued for fraud validation." : "Referral invitation sent successfully.");
  }

  return <main className="real-page referral-page">
    <header className="referral-heading"><div><span>Refer and earn</span><h1>Good finds are better shared</h1><p>Invite friends to MarketSphere. You both earn rewards after their eligible first order.</p></div><Gift /></header>
    {message && <p className="referral-message"><Check /> {message}</p>}
    <section className="referral-hero-panel"><div><span>Your referral code</span><strong>{code}</strong><button onClick={() => shareReferral("code")}><Copy /> Copy code</button></div><div><span>Personal referral link</span><p>{link}</p><button onClick={() => shareReferral("link")}><Link2 /> Copy link</button></div><aside><strong>Earn 300 points</strong><span>For every eligible friend who completes their first order.</span></aside></section>
    <section className="referral-share"><header><div><span>Share referral</span><h2>Invite your way</h2></div><button onClick={() => setShowRules((value) => !value)}>View referral rules</button></header><div><button onClick={() => shareReferral("native")}><Share2 /><span><strong>Share</strong><small>Use device sharing</small></span></button><button onClick={() => shareReferral("whatsapp")}><MessageCircle /><span><strong>WhatsApp</strong><small>Send to a chat</small></span></button><button onClick={() => shareReferral("email")}><Mail /><span><strong>Email</strong><small>Open your mail app</small></span></button></div>{showRules && <aside className="referral-rules"><ShieldCheck /><div><strong>Referral program rules</strong><ul><li>The invited customer must be new to MarketSphere.</li><li>Rewards unlock after the first eligible order is delivered and its return period ends.</li><li>Cancelled, returned, duplicate and self-referred orders do not qualify.</li><li>One person, household, payment instrument or device may not create multiple referral rewards.</li><li>Suspicious activity may be held for validation or rejected.</li></ul></div></aside>}</section>
    <div className="referral-main-grid"><form className="invite-contacts" onSubmit={invite}><header><Users /><div><span>Invite contacts</span><h2>Send a personal invitation</h2><p>Invite by email or mobile number.</p></div></header><label>Contact name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Friend's name" /></label><label>Email or mobile<input required value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} placeholder="name@example.com or +91..." /></label><button className="primary"><Send /> Send invitation</button><small><ShieldCheck /> Automated checks prevent duplicate, self and abusive referrals.</small></form><section className="referral-summary"><article><Gift /><span><strong>{earned}</strong><small>Points earned</small></span></article><article><Clock3 /><span><strong>{pending}</strong><small>Rewards pending</small></span></article><article><ShieldCheck /><span><strong>{fraudSignals}</strong><small>Under validation</small></span></article></section></div>
    <section className="referral-history"><header><div><span>Referral history</span><h2>Invites and reward status</h2></div><b>{referrals.length} referrals</b></header>{referrals.map((referral) => <article key={referral.id}><i className={referral.status === "Reward earned" ? "earned" : referral.status === "Under validation" ? "review" : ""}>{referral.status === "Reward earned" ? <CheckCircle2 /> : referral.status === "Under validation" ? <AlertTriangle /> : <Clock3 />}</i><div><strong>{referral.name}</strong><span>{referral.contact} · {new Date(referral.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span></div><b>{referral.status}</b><span className="reward-value">{referral.reward ? `${referral.reward} points` : "Pending review"}</span></article>)}</section>
  </main>;
}
