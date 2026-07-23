import React from "react";
import { PackageCheck } from "lucide-react";
import { orders, orderTimeline } from "../data/shopData";
import { money } from "../utils/format";

export default function OrdersPage() {
  return (
    <main className="real-page orders-page">
      <div className="page-heading"><div><p>Account</p><h1>My Orders</h1></div></div>
      <div className="orders-grid">
        {orders.map((order) => (
          <article className="order-detail-card" key={order.id}>
            <img src={order.image} alt="" />
            <div><h3>{order.id}</h3><p>Total {money(order.total)}</p><b>{order.status}</b></div>
            <div>{orderTimeline.map((step) => <span key={step}><PackageCheck size={14} /> {step}</span>)}</div>
          </article>
        ))}
      </div>
    </main>
  );
}
