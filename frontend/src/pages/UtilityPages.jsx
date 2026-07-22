import React from "react";
import { Award, Bell, Gift, Headphones, RotateCcw, Scale, Wallet } from "lucide-react";
import ListRow from "../components/board/ListRow";
import CompactProduct from "../components/board/CompactProduct";
import { mobileProducts, shoeProducts } from "../data/shopData";

export function NotificationsPage() {
  return <UtilityPage icon={Bell} title="Notifications" items={["Order delivered", "Price drop on Nike shoes", "Refund processed", "Big Saving Days starts tonight"]} />;
}

export function WalletPage() {
  return <UtilityPage icon={Wallet} title="ShopHub Wallet" highlight="₹1,250" items={["Added money +₹500", "Order refund +₹750", "Order payment -₹1,299"]} />;
}

export function RewardsPage() {
  return <UtilityPage icon={Award} title="Rewards" highlight="1,280 Points" items={["Order reward +120", "Referral bonus +300", "Coupon unlocked"]} />;
}

export function ReferralsPage() {
  return <UtilityPage icon={Gift} title="Refer & Earn" highlight="SHOPHUB123" items={["Rahul joined", "Jenny joined", "₹100 reward pending"]} />;
}

export function SupportPage() {
  return <UtilityPage icon={Headphones} title="Help Center" items={["Where is my order?", "Cancel or return item", "Payment refund status", "Chat with support"]} />;
}

export function ReturnsPage() {
  return <UtilityPage icon={RotateCcw} title="Returns & Refunds" items={["Nike shoes return requested", "Refund initiated", "Pickup scheduled tomorrow"]} />;
}

export function ComparePage() {
  return (
    <main className="real-page">
      <div className="page-heading"><div><p>Compare</p><h1>Product Comparison</h1></div><Scale /></div>
      <div className="real-grid">{shoeProducts.map((product) => <CompactProduct product={product} key={product.name} />)}</div>
    </main>
  );
}

export function RecentlyViewedPage() {
  return (
    <main className="real-page">
      <div className="page-heading"><div><p>History</p><h1>Recently Viewed</h1></div></div>
      <div className="real-grid">{[...shoeProducts, ...mobileProducts].map((product) => <CompactProduct product={product} key={product.name} />)}</div>
    </main>
  );
}

function UtilityPage({ icon: Icon, title, highlight, items }) {
  return (
    <main className="real-page utility-page">
      <section className="utility-card">
        <Icon size={42} />
        <h1>{title}</h1>
        {highlight && <strong>{highlight}</strong>}
        {items.map((item) => <ListRow title={item} key={item} />)}
      </section>
    </main>
  );
}
