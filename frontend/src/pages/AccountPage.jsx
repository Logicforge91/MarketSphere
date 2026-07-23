import React from "react";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  Gift,
  Heart,
  LogOut,
  MapPin,
  Package,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Star,
  TicketPercent,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const accountLinks = [
  { icon: Package, label: "My orders", detail: "Track, return or buy again", to: "/orders" },
  { icon: Heart, label: "Wishlist", detail: "12 saved products", to: "/wishlist" },
  { icon: RotateCcw, label: "Returns & refunds", detail: "Manage active returns", to: "/returns" },
  { icon: MapPin, label: "Saved addresses", detail: "2 delivery addresses", to: "/addresses" },
];

const recentOrders = [
  { id: "MS-48291", name: "Noise ColorFit Smart Watch", date: "18 Jul 2026", price: "Rs. 3,499", status: "Delivered" },
  { id: "MS-47938", name: "Urban Trail Everyday Sneakers", date: "09 Jul 2026", price: "Rs. 2,199", status: "Delivered" },
];

export default function AccountPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const customer = user || { name: "Guest shopper", email: "Sign in to sync your account", phone: "" };
  const initials = customer.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  function signOut() {
    logout();
    navigate("/login");
  }

  return (
    <main className="account-page account-dashboard">
      <section className="account-welcome">
        <div className="account-avatar" aria-hidden="true">{initials}</div>
        <div className="account-identity">
          <span>Welcome back</span>
          <h1>{customer.name}</h1>
          <p>{customer.email}{customer.phone && <><i /> {customer.phone}</>}</p>
        </div>
        <button className="account-edit" type="button">Edit profile</button>
      </section>

      <div className="account-layout">
        <aside className="account-sidebar" aria-label="Account navigation">
          <p className="account-nav-title">My account</p>
          <Link className="active" to="/account"><UserRound size={18} /> Overview</Link>
          <Link to="/orders"><Package size={18} /> Orders</Link>
          <Link to="/wishlist"><Heart size={18} /> Wishlist</Link>
          <Link to="/payment-methods"><WalletCards size={18} /> Payments</Link>
          <Link to="/notifications"><Bell size={18} /> Notifications <b>3</b></Link>
          <Link to="/sessions"><Smartphone size={18} /> Devices</Link>
          <Link to="/two-factor"><ShieldCheck size={18} /> Sign-in security</Link>
          <Link to="/support"><CircleHelp size={18} /> Help centre</Link>
          <button type="button" onClick={signOut}><LogOut size={18} /> Sign out</button>
        </aside>

        <div className="account-content">
          <section className="account-stats" aria-label="Account summary">
            <Link to="/orders"><span><Package size={20} /></span><div><strong>8</strong><small>Total orders</small></div><ChevronRight size={18} /></Link>
            <Link to="/wishlist"><span><Heart size={20} /></span><div><strong>12</strong><small>Wishlist items</small></div><ChevronRight size={18} /></Link>
            <Link to="/wallet"><span><WalletCards size={20} /></span><div><strong>Rs. 640</strong><small>Wallet balance</small></div><ChevronRight size={18} /></Link>
          </section>

          <section className="account-panel account-shortcuts">
            <div className="account-section-heading">
              <div><span>Quick access</span><h2>Manage your shopping</h2></div>
            </div>
            <div className="shortcut-grid">
              {accountLinks.map(({ icon: Icon, label, detail, to }) => (
                <Link to={to} key={label}>
                  <span><Icon size={21} /></span>
                  <div><strong>{label}</strong><small>{detail}</small></div>
                  <ChevronRight size={18} />
                </Link>
              ))}
            </div>
          </section>

          <section className="account-panel">
            <div className="account-section-heading">
              <div><span>Latest purchases</span><h2>Recent orders</h2></div>
              <Link to="/orders">View all <ChevronRight size={16} /></Link>
            </div>
            <div className="recent-orders">
              {recentOrders.map((order) => (
                <article key={order.id}>
                  <div className="order-placeholder"><Package size={25} /></div>
                  <div className="order-copy">
                    <small>{order.id} <i /> {order.date}</small>
                    <strong>{order.name}</strong>
                    <span><ShieldCheck size={15} /> {order.status}</span>
                  </div>
                  <strong className="order-price">{order.price}</strong>
                  <button type="button" aria-label={`Rate ${order.name}`}><Star size={17} /> Rate item</button>
                </article>
              ))}
            </div>
          </section>

          <section className="account-benefit">
            <div className="benefit-icon"><Gift size={28} /></div>
            <div><span>MarketSphere Rewards</span><h2>You have 1,240 reward points</h2><p>Use your points on your next order and save more.</p></div>
            <Link to="/rewards">Explore rewards <TicketPercent size={18} /></Link>
          </section>
        </div>
      </div>
    </main>
  );
}
