import React, { useState } from "react";
import { CalendarClock, Check, KeyRound, MapPin, Navigation, PackageCheck, Phone, Radio, RefreshCw, Truck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const stages = [
  ["Order confirmed", "Your order was received"],
  ["Order processed", "Payment and inventory verified"],
  ["Order packed", "Ready for courier pickup"],
  ["Order shipped", "Moving through the courier network"],
  ["Out for delivery", "Courier is approaching your address"],
  ["Delivered", "Package delivered successfully"],
];

const statusIndex = { Confirmed: 0, Processed: 1, Packed: 2, Shipped: 3, "Out for delivery": 4, Delivered: 5 };

export default function OrderTrackingPage() {
  const { latestOrder, updateOrder } = useShop();
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const activeIndex = statusIndex[latestOrder?.status] ?? (latestOrder?.status === "Cancelled" ? -1 : 3);
  const packages = latestOrder?.shipments?.length ? latestOrder.shipments : [{ id: "SHP-1", seller: "MarketSphere Select", items: latestOrder?.items || [], estimate: "3-5 days" }];
  const otp = latestOrder ? String(latestOrder.id).replace(/\D/g, "").slice(-4).padStart(4, "7") : "7284";

  function reschedule(event) {
    event.preventDefault();
    if (!latestOrder || !newDate) return;
    updateOrder(latestOrder.id, {
      deliveryDate: newDate,
      deliveryRescheduled: { date: newDate, createdAt: new Date().toISOString() },
      status: latestOrder.status === "Failed delivery" ? "Shipped" : latestOrder.status,
    });
    setShowReschedule(false);
  }

  if (!latestOrder) return <main className="real-page tracking-empty"><PackageCheck /><h1>No active shipment</h1><p>Place an order or open your order history to begin tracking.</p><Link className="primary" to="/orders">View orders</Link></main>;

  return <main className="real-page tracking-experience">
    <header className="tracking-heading"><div><span>Order #{latestOrder.id}</span><h1>Track your order</h1><p>{latestOrder.deliveryMethod?.name || "Standard delivery"} · Estimated {latestOrder.deliveryDate || "in 3-5 business days"}</p></div><button className="secondary" onClick={() => setShowReschedule(true)}><CalendarClock /> Reschedule</button></header>

    {latestOrder.status === "Cancelled" && <aside className="tracking-alert cancelled"><X /><div><strong>Order cancelled</strong><span>This order will not be shipped. Any eligible refund is being processed.</span></div></aside>}
    {latestOrder.status === "Failed delivery" && <aside className="tracking-alert failed"><RefreshCw /><div><strong>Delivery attempt failed</strong><span>The courier could not complete delivery. Select another date.</span></div><button onClick={() => setShowReschedule(true)}>Reschedule</button></aside>}
    {latestOrder.deliveryRescheduled && <aside className="tracking-alert rescheduled"><CalendarClock /><div><strong>Delivery rescheduled</strong><span>New date: {new Date(latestOrder.deliveryRescheduled.date).toLocaleDateString("en-IN", { dateStyle: "full" })}</span></div></aside>}

    <section className="live-tracking">
      <div className="tracking-map"><div className="map-route" /><i className="map-origin"><PackageCheck /></i><i className="map-courier"><Truck /></i><i className="map-destination"><MapPin /></i><span><Radio /> Live shipment tracking</span></div>
      <div className="live-status"><span className="live-badge"><i /> Live update</span><h2>{latestOrder.status}</h2><p>{activeIndex >= 4 ? "Your courier is on the way. Keep the delivery OTP ready." : "Your package was scanned at the Bengaluru Central Hub."}</p><div><Navigation /><span>Last location<strong>Bengaluru Central Hub · 12 minutes ago</strong></span></div><div><CalendarClock /><span>Estimated delivery<strong>{latestOrder.deliveryDate || "Within 3-5 business days"}</strong></span></div></div>
    </section>

    <section className="full-tracking-timeline"><header><div><span>Tracking timeline</span><h2>Shipment progress</h2></div><b>{Math.max(0, activeIndex + 1)} of {stages.length} completed</b></header><div>{stages.map(([label, detail], index) => <article className={index <= activeIndex ? "done" : index === activeIndex + 1 ? "current" : ""} key={label}><i>{index <= activeIndex ? <Check /> : <PackageCheck />}</i><div><strong>{label}</strong><span>{index === 5 && latestOrder.deliveryDate ? latestOrder.deliveryDate : detail}</span></div></article>)}</div></section>

    <section className="tracking-packages"><header><div><span>Shipment-wise tracking</span><h2>{packages.length} {packages.length === 1 ? "package" : "packages"}</h2></div></header>{packages.map((shipment, index) => <article key={shipment.id}><div className="package-title"><span><small>Package {index + 1}</small><strong>{shipment.seller}</strong></span><b>{latestOrder.status}</b></div><div className="package-products">{shipment.items.map((item) => <div key={item.id || item.name}><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>Qty {item.qty || 1}</small></span></div>)}</div><footer><span>Tracking number<strong>DLV-{shipment.id}-{latestOrder.id}</strong></span><span>Estimated delivery<strong>{latestOrder.deliveryDate || shipment.estimate}</strong></span></footer></article>)}</section>

    <section className="courier-otp-grid"><article className="courier-card"><header><div><Truck /><span><small>Courier partner</small><strong>Delhivery Express</strong></span></div><a href="tel:+918047122880"><Phone /> Call courier</a></header><div><span>Delivery agent<strong>Arjun K.</strong></span><span>Vehicle<strong>KA 05 MX 1842</strong></span><span>Support<strong>+91 80471 22880</strong></span></div></article><article className="tracking-otp"><KeyRound /><div><small>Delivery OTP</small><strong>{otp}</strong><p>Share this code only after checking your package.</p></div></article></section>

    {showReschedule && <div className="tracking-modal-backdrop" onMouseDown={() => setShowReschedule(false)}><form className="tracking-reschedule-modal" onSubmit={reschedule} onMouseDown={(event) => event.stopPropagation()}><header><div><span>Delivery preferences</span><h2>Reschedule delivery</h2></div><button type="button" onClick={() => setShowReschedule(false)}><X /></button></header><label>New delivery date<input required type="date" min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} value={newDate} onChange={(event) => setNewDate(event.target.value)} /></label><button className="primary">Confirm new date</button></form></div>}
  </main>;
}
