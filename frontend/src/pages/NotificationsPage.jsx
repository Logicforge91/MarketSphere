import React, { useEffect, useMemo, useState } from "react";
import { Bell, Check, CheckCheck, CreditCard, Gift, Heart, Mail, MessageCircle, PackageCheck, RefreshCw, RotateCcw, Settings2, ShoppingBag, Smartphone, Tag, Trash2, Truck } from "lucide-react";
import { useShop } from "../context/ShopContext";

const initialHistory = [
  { id: "NOT-1", category: "order", title: "Order confirmed", body: "Order #MS205186 has been confirmed and is being processed.", date: "2026-07-23T09:35:00.000Z", read: false },
  { id: "NOT-2", category: "delivery", title: "Package out for delivery", body: "Delhivery Express will arrive today. Keep your delivery OTP ready.", date: "2026-07-23T08:10:00.000Z", read: false },
  { id: "NOT-3", category: "payment", title: "Payment verified", body: "Your secure payment of Rs. 4,999 was successfully verified.", date: "2026-07-22T16:22:00.000Z", read: true },
  { id: "NOT-4", category: "refund", title: "Refund initiated", body: "Refund RF20456781 is being processed to your original payment method.", date: "2026-07-21T11:45:00.000Z", read: true },
  { id: "NOT-5", category: "return", title: "Return pickup scheduled", body: "Your pickup is scheduled tomorrow between 10 AM and 1 PM.", date: "2026-07-20T14:05:00.000Z", read: true },
  { id: "NOT-6", category: "price", title: "Price dropped on a saved item", body: "Classic Watch is now Rs. 1,000 less than when you saved it.", date: "2026-07-19T07:30:00.000Z", read: false },
  { id: "NOT-7", category: "stock", title: "Back in stock", body: "Your saved size is available again for Urban Trail Sneakers.", date: "2026-07-18T12:00:00.000Z", read: true },
  { id: "NOT-8", category: "cart", title: "Your bag is waiting", body: "Complete checkout before availability or pricing changes.", date: "2026-07-17T18:40:00.000Z", read: true },
];

const categoryMeta = {
  all: ["All", Bell],
  order: ["Orders", PackageCheck],
  payment: ["Payments", CreditCard],
  delivery: ["Delivery", Truck],
  refund: ["Refunds", RefreshCw],
  return: ["Returns", RotateCcw],
  offer: ["Offers", Gift],
  price: ["Price drops", Tag],
  stock: ["Back in stock", ShoppingBag],
  wishlist: ["Wishlist", Heart],
  cart: ["Cart", ShoppingBag],
};

function readStored(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

export default function NotificationsPage() {
  const { notification } = useShop();
  const [view, setView] = useState("inbox");
  const [filter, setFilter] = useState("all");
  const [history, setHistory] = useState(() => readStored("marketsphere:notification-history", initialHistory));
  const [preferences, setPreferences] = useState(() => readStored("marketsphere:notification-preferences", {
    channels: { push: false, email: true, sms: true, whatsapp: false, inApp: true },
    topics: { order: true, payment: true, delivery: true, refund: true, return: true, offer: false, price: true, stock: true, wishlist: true, cart: false },
  }));
  const [message, setMessage] = useState("");
  const visible = useMemo(() => history.filter((item) => filter === "all" || item.category === filter), [filter, history]);
  const unread = history.filter((item) => !item.read).length;

  useEffect(() => window.localStorage.setItem("marketsphere:notification-history", JSON.stringify(history)), [history]);
  useEffect(() => window.localStorage.setItem("marketsphere:notification-preferences", JSON.stringify(preferences)), [preferences]);
  useEffect(() => {
    if (!notification || history.some((item) => item.body === notification)) return;
    setHistory((items) => [{ id: `NOT-${Date.now()}`, category: "order", title: "MarketSphere update", body: notification, date: new Date().toISOString(), read: false }, ...items]);
  }, [history, notification]);

  async function toggleChannel(channel, enabled) {
    if (channel === "push" && enabled) {
      if (!("Notification" in window)) return setMessage("Push notifications are not supported by this browser.");
      const permission = await window.Notification.requestPermission();
      if (permission !== "granted") return setMessage("Push permission was not granted. You can enable it from browser settings.");
    }
    setPreferences((value) => ({ ...value, channels: { ...value.channels, [channel]: enabled } }));
    setMessage(`${channel === "inApp" ? "In-app" : channel} notifications ${enabled ? "enabled" : "disabled"}.`);
  }

  return <main className="real-page notification-center">
    <header className="notification-heading"><div><span>Communication centre</span><h1>Notifications</h1><p>Follow orders, payments, deliveries, returns and shopping alerts.</p></div><div><strong>{unread}</strong><span>Unread</span></div></header>
    <nav className="notification-view-tabs"><button className={view === "inbox" ? "active" : ""} onClick={() => setView("inbox")}><Bell /> Notification history</button><button className={view === "preferences" ? "active" : ""} onClick={() => setView("preferences")}><Settings2 /> Preferences</button></nav>
    {message && <p className="notification-message"><Check /> {message}</p>}

    {view === "inbox" && <div className="notification-layout"><aside className="notification-filters">{Object.entries(categoryMeta).map(([key, [label, Icon]]) => <button className={filter === key ? "active" : ""} onClick={() => setFilter(key)} key={key}><Icon /><span>{label}</span><b>{key === "all" ? history.length : history.filter((item) => item.category === key).length}</b></button>)}</aside><section className="notification-history"><header><div><h2>{categoryMeta[filter][0]}</h2><span>{visible.length} updates</span></div><button onClick={() => setHistory((items) => items.map((item) => ({ ...item, read: true })))}><CheckCheck /> Mark all read</button></header>{visible.length ? <div>{visible.map((item) => { const Icon = categoryMeta[item.category]?.[1] || Bell; return <article className={item.read ? "" : "unread"} key={item.id}><i><Icon /></i><div><header><strong>{item.title}</strong><span>{new Date(item.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></header><p>{item.body}</p><footer>{!item.read && <button onClick={() => setHistory((items) => items.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry))}><Check /> Mark read</button>}<button onClick={() => setHistory((items) => items.filter((entry) => entry.id !== item.id))}><Trash2 /> Delete</button></footer></div></article>; })}</div> : <div className="notification-empty"><Bell /><h3>No notifications here</h3><p>Updates for this category will appear when available.</p></div>}</section></div>}

    {view === "preferences" && <section className="notification-preferences"><div className="preference-heading"><span>Delivery channels</span><h2>How we contact you</h2><p>Transactional alerts may still be sent when required for account security or an active order.</p></div><div className="notification-channel-grid">{[["push", "Push notifications", "Browser and device alerts", Bell], ["email", "Email notifications", "Receipts, summaries and account updates", Mail], ["sms", "SMS notifications", "Payment and delivery updates", Smartphone], ["whatsapp", "WhatsApp notifications", "Order and support conversations", MessageCircle], ["inApp", "In-app notifications", "Updates inside MarketSphere", PackageCheck]].map(([key, title, copy, Icon]) => <label key={key}><Icon /><span><strong>{title}</strong><small>{copy}</small></span><input type="checkbox" checked={preferences.channels[key]} onChange={(event) => toggleChannel(key, event.target.checked)} /></label>)}</div><div className="preference-heading topics"><span>Notification topics</span><h2>What you want to hear about</h2></div><div className="notification-topic-list">{Object.entries(categoryMeta).filter(([key]) => !["all"].includes(key)).map(([key, [label, Icon]]) => <label key={key}><Icon /><span><strong>{label} updates</strong><small>{key === "offer" ? "Promotions, coupons and personalized deals" : key === "price" ? "Price changes for viewed and saved items" : key === "stock" ? "Availability for watched product variants" : key === "wishlist" ? "Saved-item price and availability alerts" : key === "cart" ? "Reminders for products left in your bag" : `Important ${label.toLowerCase()} activity`}</small></span><input type="checkbox" checked={preferences.topics[key]} onChange={(event) => setPreferences((value) => ({ ...value, topics: { ...value.topics, [key]: event.target.checked } }))} /></label>)}</div></section>}
  </main>;
}
