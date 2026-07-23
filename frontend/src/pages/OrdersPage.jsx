import React from "react";
import { PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { orderTimeline } from "../data/shopData";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";

export default function OrdersPage() {
  const { orders } = useShop();

  return (
    <main className="real-page orders-page">
      <div className="page-heading"><div><p>Account</p><h1>My orders</h1></div></div>
      {orders.length ? <div className="orders-grid">
        {orders.map((order) => (
          <article className="order-detail-card" key={order.id}>
            <img src={order.image} alt="" />
            <div><h3>#{order.id}</h3><p>{order.date ? new Date(order.date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Recent order"} · {money(order.total)}</p><b>{order.status}</b></div>
            <div>{orderTimeline.map((step) => <span key={step}><PackageCheck size={14} /> {step}</span>)}<Link to="/track-order">Track order</Link></div>
          </article>
        ))}
      </div> : <div className="empty-state">No orders yet</div>}
    </main>
  );
}
