import React, { useMemo, useState } from "react";
import { Award, CalendarHeart, Check, ChevronRight, Clock3, Crown, Gift, History, Sparkles, Star, TicketPercent, Users, WalletCards } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";

const tiers = [
  { name: "Explorer", min: 0, icon: Star, benefits: ["1 point per Rs. 100", "Member-only prices", "Early sale access"] },
  { name: "Insider", min: 2500, icon: Award, benefits: ["1.25x points", "Free standard delivery", "Priority support"] },
  { name: "Icon", min: 7500, icon: Crown, benefits: ["1.5x points", "Express delivery upgrades", "Exclusive launches"] },
];

const rewardOptions = [
  { id: "LOYAL250", title: "Rs. 250 loyalty coupon", points: 500, value: 250, min: 1499 },
  { id: "LOYAL500", title: "Rs. 500 loyalty coupon", points: 900, value: 500, min: 2499 },
  { id: "SHIPFREE", title: "Free express delivery", points: 350, value: 149, min: 999 },
];

function readStored(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

export default function RewardsPage() {
  const { user } = useAuth();
  const { orders } = useShop();
  const earnedFromOrders = useMemo(() => Math.floor(orders.filter((order) => order.status !== "Cancelled").reduce((sum, order) => sum + (order.total || 0), 0) / 100), [orders]);
  const [state, setState] = useState(() => readStored("marketsphere:loyalty", {
    balance: 1280 + earnedFromOrders,
    lifetime: 4180 + earnedFromOrders,
    coupons: [],
    history: [
      { id: "RW-1", type: "Earned", label: "Order reward", points: 120, date: "2026-07-20T10:30:00.000Z" },
      { id: "RW-2", type: "Earned", label: "Referral reward", points: 300, date: "2026-07-16T08:15:00.000Z" },
      { id: "RW-3", type: "Redeemed", label: "Loyalty coupon", points: -500, date: "2026-07-10T14:00:00.000Z" },
      { id: "RW-4", type: "Earned", label: "Birthday bonus", points: 250, date: "2026-07-02T09:00:00.000Z" },
    ],
  }));
  const [view, setView] = useState("overview");
  const [message, setMessage] = useState("");
  const tierIndex = tiers.findLastIndex((tier) => state.lifetime >= tier.min);
  const tier = tiers[Math.max(0, tierIndex)];
  const nextTier = tiers[tierIndex + 1];
  const progress = nextTier ? Math.min(100, (state.lifetime - tier.min) / (nextTier.min - tier.min) * 100) : 100;
  const expiring = Math.min(340, state.balance);

  function persist(next) {
    setState(next);
    window.localStorage.setItem("marketsphere:loyalty", JSON.stringify(next));
  }

  function redeem(reward) {
    if (state.balance < reward.points) return setMessage(`You need ${reward.points - state.balance} more points for this reward.`);
    const coupon = { ...reward, code: `${reward.id}-${Date.now().toString().slice(-4)}`, expires: "2026-10-31", redeemedAt: new Date().toISOString() };
    persist({
      ...state,
      balance: state.balance - reward.points,
      coupons: [coupon, ...state.coupons],
      history: [{ id: `RW-${Date.now()}`, type: "Redeemed", label: reward.title, points: -reward.points, date: new Date().toISOString() }, ...state.history],
    });
    setMessage(`${coupon.code} is ready to use at checkout.`);
  }

  function claim(label, points) {
    const claimKey = label.toLowerCase().replace(/\s/g, "-");
    if (state.history.some((item) => item.claimKey === claimKey)) return setMessage(`${label} has already been claimed.`);
    persist({ ...state, balance: state.balance + points, lifetime: state.lifetime + points, history: [{ id: `RW-${Date.now()}`, type: "Earned", label, points, date: new Date().toISOString(), claimKey }, ...state.history] });
    setMessage(`${points} points added for ${label.toLowerCase()}.`);
  }

  return <main className="real-page loyalty-page">
    <header className="loyalty-heading"><div><span>MarketSphere Rewards</span><h1>Your loyalty, rewarded</h1><p>Earn on eligible purchases and unlock better benefits as you move up.</p></div><div className="points-balance"><Sparkles /><span><strong>{state.balance.toLocaleString("en-IN")}</strong><small>Available points</small></span></div></header>
    <nav className="loyalty-tabs"><button className={view === "overview" ? "active" : ""} onClick={() => setView("overview")}><Award /> Overview</button><button className={view === "redeem" ? "active" : ""} onClick={() => setView("redeem")}><Gift /> Redeem rewards</button><button className={view === "history" ? "active" : ""} onClick={() => setView("history")}><History /> Point history</button></nav>
    {message && <p className="loyalty-message"><Check /> {message}</p>}

    {view === "overview" && <><section className="tier-status"><header><div><span><Award /></span><div><small>Current membership</small><h2>{tier.name}</h2><p>{nextTier ? `${(nextTier.min - state.lifetime).toLocaleString("en-IN")} points until ${nextTier.name}` : "You have reached our highest membership tier."}</p></div></div><b>{state.lifetime.toLocaleString("en-IN")} lifetime points</b></header><div className="tier-progress"><i><em style={{ width: `${progress}%` }} /></i><div><span>{tier.name}</span><span>{nextTier?.name || "Top tier"}</span></div></div><div className="tier-benefit-grid">{tier.benefits.map((benefit) => <span key={benefit}><Check /> {benefit}</span>)}</div></section>
      <aside className="expiring-points"><Clock3 /><div><strong>{expiring} points expire on 31 August</strong><span>Redeem them before they expire. Oldest points are always used first.</span></div><button onClick={() => setView("redeem")}>Use points <ChevronRight /></button></aside>
      <section className="loyalty-opportunities"><header><div><span>More ways to earn</span><h2>Rewards waiting for you</h2></div></header><div><article><CalendarHeart /><div><strong>Birthday reward</strong><span>Celebrate with 250 bonus points during your birthday month.</span></div><button onClick={() => claim("Birthday reward", 250)}>{user?.dateOfBirth ? "Claim 250" : "Add birthday"}</button></article><article><Users /><div><strong>Referral reward</strong><span>Earn 300 points when an invited friend places their first order.</span></div><button onClick={() => claim("Referral reward", 300)}>Claim demo reward</button></article><article><WalletCards /><div><strong>Earn on every order</strong><span>Eligible purchases automatically earn points after delivery.</span></div><b>{earnedFromOrders} earned</b></article></div></section>
      <section className="membership-tiers"><header><div><span>Membership tiers</span><h2>Benefits that grow with you</h2></div></header><div>{tiers.map(({ name, min, icon: Icon, benefits }) => <article className={name === tier.name ? "current" : ""} key={name}><header><Icon /><span><strong>{name}</strong><small>From {min.toLocaleString("en-IN")} points</small></span>{name === tier.name && <b>Current</b>}</header>{benefits.map((benefit) => <p key={benefit}><Check /> {benefit}</p>)}</article>)}</div></section></>}

    {view === "redeem" && <section className="rewards-catalog"><header><div><span>Loyalty coupons</span><h2>Turn points into savings</h2><p>Your balance: {state.balance.toLocaleString("en-IN")} points</p></div></header><div>{rewardOptions.map((reward) => <article key={reward.id}><TicketPercent /><div><small>{reward.id}</small><h3>{reward.title}</h3><p>Valid above {money(reward.min)} · Single use</p></div><div><strong>{reward.points} points</strong><button disabled={state.balance < reward.points} onClick={() => redeem(reward)}>Redeem</button></div></article>)}</div>{state.coupons.length > 0 && <section className="redeemed-coupons"><h2>Your loyalty coupons</h2>{state.coupons.map((coupon) => <article key={coupon.code}><span><strong>{coupon.code}</strong><small>{coupon.title} · Expires {coupon.expires}</small></span><button onClick={() => navigator.clipboard?.writeText(coupon.code)}>Copy code</button></article>)}</section>}</section>}

    {view === "history" && <section className="reward-history"><header><div><span>Reward history</span><h2>Point activity</h2></div><b>{state.history.length} transactions</b></header>{state.history.map((entry) => <article key={entry.id}><i className={entry.points > 0 ? "earned" : "redeemed"}>{entry.points > 0 ? <Sparkles /> : <Gift />}</i><div><strong>{entry.label}</strong><span>{new Date(entry.date).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {entry.type}</span></div><b className={entry.points > 0 ? "earned" : ""}>{entry.points > 0 ? "+" : ""}{entry.points} points</b></article>)}</section>}
  </main>;
}
