import React from "react";
import {
  Award,
  Bell,
  Camera,
  Check,
  CreditCard,
  Gift,
  Heart,
  Headphones,
  Home,
  Lock,
  MapPin,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  User,
  Wallet,
  X,
} from "lucide-react";
import BoardScreen from "../components/board/BoardScreen";
import CompactProduct from "../components/board/CompactProduct";
import ListRow from "../components/board/ListRow";
import StatusPill from "../components/board/StatusPill";
import { accountMenu, cartItems, categories, mobileProducts, orderTimeline, orders, shoeProducts } from "../data/shopData";
import { money } from "../utils/format";

function AuthForms() {
  return (
    <BoardScreen number="01" title="Onboarding & Auth">
      <div className="auth-hero"><ShoppingCart size={34} /><h3>ShopKart</h3><p>Best Quality, Best Price</p><button className="primary">Get started</button></div>
      {["Login / Register", "Login with Password", "Forgot Password"].map((title) => (
        <div className="form-card" key={title}>
          <h4>{title}</h4>
          <input placeholder="Mobile number or email" />
          <input placeholder={title === "Forgot Password" ? "Create password" : "Password"} />
          <button className="primary">{title === "Forgot Password" ? "Reset Password" : "Login"}</button>
        </div>
      ))}
    </BoardScreen>
  );
}

function CategoryListing() {
  return (
    <BoardScreen number="03" title="Categories & Listing" wide>
      <div className="split-3">
        <div>{categories.slice(0, 6).map(({ name, icon }) => <ListRow key={name} icon={icon} title={name} />)}</div>
        <div><div className="toolbar"><button>Sort</button><button><SlidersHorizontal size={14} /> Filter</button></div>{mobileProducts.map((p) => <CompactProduct product={p} key={p.name} />)}</div>
        <div className="filter-card"><h4>Filters</h4>{["Price Range", "Brands", "Ratings", "Storage", "Color"].map((f) => <ListRow key={f} title={f} />)}<button className="primary">Apply Filters</button></div>
      </div>
    </BoardScreen>
  );
}

function SearchScreens() {
  return (
    <BoardScreen number="04" title="Search" wide>
      <div className="split-2">
        <div><label className="mini-search"><Search size={15} /><input placeholder="sneakers" /></label>{["sneakers for men", "sneakers for women", "sneakers under 2000", "sneakers nike"].map((s) => <ListRow key={s} icon={Search} title={s} />)}</div>
        <div><div className="toolbar"><button>Sort</button><button>Filter</button></div>{shoeProducts.map((p) => <CompactProduct product={p} key={p.name} />)}</div>
      </div>
    </BoardScreen>
  );
}

function OffersReviewsCart() {
  return (
    <>
      <BoardScreen number="06" title="Seller / Offer Comparison">
        {["SuperCom Net", "Best Price Retail", "MegaMart", "ShopKart Assured"].map((seller, i) => (
          <div className="seller-row" key={seller}><div><strong>{seller}</strong><small>{i === 3 ? "Recommended" : "Free delivery by Thu"}</small></div><b>{money(5999 + i * 120)}</b><button className="primary">Add</button></div>
        ))}
      </BoardScreen>
      <BoardScreen number="07" title="Reviews & Q&A">
        <div className="review-summary"><b>4.5</b><span>Based on 12,345 ratings</span></div>
        {[86, 64, 35, 18, 7].map((v, i) => <div className="bar" key={i}><span>{5 - i}</span><i style={{ width: `${v}%` }} /></div>)}
        <div className="photo-strip">{shoeProducts.map((p) => <img src={p.image} alt="" key={p.name} />)}</div>
        <p>Great product. Very comfortable and stylish.</p>
      </BoardScreen>
      <BoardScreen number="08" title="Cart">
        {cartItems.map((item) => <CompactProduct product={{ ...item, rating: 4.6 }} action="add" key={item.name} />)}
        <div className="total-row"><span>Total</span><strong>{money(6998)}</strong></div>
      </BoardScreen>
    </>
  );
}

function CheckoutFlow() {
  return (
    <>
      <BoardScreen number="09" title="Checkout">
        <div className="steps"><StatusPill>Address</StatusPill><StatusPill tone="muted">Payment</StatusPill><StatusPill tone="muted">Review</StatusPill></div>
        <ListRow icon={MapPin} title="Rahul Kumar" meta="BTM, Bengaluru - 560102" />
        <div className="price-lines"><p><span>Price</span><b>{money(8127)}</b></p><p><span>Discount</span><b>-{money(1129)}</b></p><p><span>Total Payable</span><b>{money(6998)}</b></p></div>
        <button className="primary full">Continue</button>
      </BoardScreen>
      <BoardScreen number="10" title="Payment">
        {["UPI", "Credit / Debit Card", "Net Banking", "Wallets", "Cash on Delivery", "EMI"].map((m) => <ListRow key={m} icon={CreditCard} title={m} />)}
        <button className="primary full">Pay {money(6998)}</button>
      </BoardScreen>
      <BoardScreen number="11" title="Order Confirmation">
        <div className="success-mark"><Check size={54} /></div><h3>Thank You!</h3><p>Your order has been placed.</p><strong>OD1234567890</strong><ListRow icon={Truck} title="Delivered by" meta="Wed, 24 May" />
      </BoardScreen>
      <BoardScreen number="12" title="Orders">
        {orders.map((o) => <div className="order-card" key={o.id}><img src={o.image} alt="" /><div><strong>{o.id}</strong><small>Total {money(o.total)}</small></div><StatusPill tone={o.status === "Delivered" ? "green" : "orange"}>{o.status}</StatusPill></div>)}
      </BoardScreen>
    </>
  );
}

function OrderLifecycle() {
  return (
    <>
      <BoardScreen number="13" title="Order Details">
        <h4>Order ID - OD1234567890</h4>{cartItems.map((i) => <CompactProduct product={{ ...i, rating: 4.6 }} key={i.name} />)}<button className="secondary full">Download Invoice</button>
      </BoardScreen>
      <BoardScreen number="14" title="Order Tracking">
        <div className="map-card"><MapPin size={28} /></div>{orderTimeline.map((step) => <ListRow key={step} icon={PackageCheck} title={step} meta="24 May, 09:45 AM" />)}
      </BoardScreen>
      <BoardScreen number="15" title="Cancel Order">
        <CompactProduct product={{ ...cartItems[1], rating: 4.4 }} /><select><option>Changed my mind</option></select><textarea placeholder="Please avoid long delay" /><button className="danger-btn">Confirm Cancellation</button>
      </BoardScreen>
      <BoardScreen number="16" title="Returns & Replacement">
        <CompactProduct product={{ ...cartItems[0], rating: 4.8 }} /><select><option>Size issue</option></select><div className="photo-strip">{shoeProducts.map((p) => <img src={p.image} alt="" key={p.name} />)}</div><button className="danger-btn">Submit Request</button>
      </BoardScreen>
      <BoardScreen number="17" title="Refund Status">
        <h3>Refund ID - RF123456</h3><strong>{money(5799)}</strong>{["Refund Initiated", "Processing", "Refunded", "Completed"].map((s) => <ListRow key={s} icon={Check} title={s} meta="24 May" />)}
      </BoardScreen>
    </>
  );
}

function AccountSupport() {
  return (
    <>
      <BoardScreen number="18" title="Wishlist">
        {shoeProducts.map((p) => <CompactProduct product={p} key={p.name} />)}<button className="primary full">Move All to Cart</button>
      </BoardScreen>
      <BoardScreen number="19" title="Compare">
        <div className="compare-grid">{shoeProducts.map((p) => <div key={p.name}><img src={p.image} alt="" /><strong>{p.name}</strong><span>{p.rating}</span></div>)}</div>{["Brand", "Type", "Colors", "Warranty"].map((r) => <div className="compare-row" key={r}><b>{r}</b><span>Nike</span><span>Adidas</span><span>Puma</span></div>)}
      </BoardScreen>
      <BoardScreen number="20" title="Recently Viewed">
        {[...shoeProducts, ...mobileProducts.slice(0, 2)].map((p) => <CompactProduct product={p} key={p.name} />)}<button className="primary full">Clear All to Cart</button>
      </BoardScreen>
      <BoardScreen number="21" title="Notifications">
        {["Order Delivered", "Price Drop Alert", "Big Saving Days", "Refund Processed"].map((n) => <ListRow key={n} icon={Bell} title={n} meta="Just now" />)}
      </BoardScreen>
      <BoardScreen number="22" title="Wallet">
        <div className="wallet-card"><Wallet /><span>Balance</span><strong>{money(1250)}</strong></div>{["Added Money", "Order Refund", "Order Payment"].map((n) => <ListRow key={n} icon={CreditCard} title={n} meta="+100" />)}
      </BoardScreen>
      <BoardScreen number="23" title="Rewards">
        <div className="wallet-card"><Award /><span>Available Points</span><strong>1,280</strong></div>{["Order Reward", "Referral Bonus"].map((n) => <ListRow key={n} icon={Gift} title={n} meta="+120" />)}
      </BoardScreen>
      <BoardScreen number="24" title="Referrals">
        <div className="referral">SHOPKART123</div><div className="photo-strip">{["Rahul", "Jenny", "Emma"].map((n) => <span key={n}>{n[0]}</span>)}</div><button className="primary full">Invite Friends</button>
      </BoardScreen>
      <BoardScreen number="25" title="Live Center">
        {accountMenu.map((m) => <ListRow key={m} icon={User} title={m} />)}<button className="danger-link">Logout</button>
      </BoardScreen>
      <BoardScreen number="26" title="Shopping Assistant">
        <div className="chat"><p>Hi, how can I help you?</p><p>Suggest shoes under 6000</p><p>Best Puma shoes near your budget.</p></div><label className="mini-search"><input placeholder="Type a message..." /><MessageCircle size={15} /></label>
      </BoardScreen>
    </>
  );
}

function VisualSystem() {
  return (
    <>
      <BoardScreen number="28" title="Image Search" wide>
        <div className="image-search"><Camera size={44} /><h3>Search products with an image</h3><button className="primary">Upload Image</button></div>
        <div className="swatch-row">{["#1d4ed8", "#1447ff", "#12b76a", "#f59e0b", "#ef4444", "#64748b"].map((c) => <span style={{ background: c }} key={c} />)}</div>
      </BoardScreen>
      <BoardScreen number="30" title="Empty States" wide>
        <div className="empty-grid">{["No Results Found", "Cart is Empty", "Wishlist is Empty", "No Notifications", "No Orders Yet", "Address is Empty", "Page Not Found"].map((e) => <div key={e}><ShoppingBag size={24} /><strong>{e}</strong><button className="secondary">Explore</button></div>)}</div>
      </BoardScreen>
      <BoardScreen number="31" title="Design System" wide>
        <div className="design-mini"><div className="swatch-row">{["#4f46e5", "#1447ff", "#10b981", "#f59e0b", "#ef4444", "#64748b"].map((c) => <span style={{ background: c }} key={c} />)}</div><div><h1>Heading</h1><h2>Heading</h2><p>Body text sample</p></div><div className="icon-row">{[Home, Search, Heart, ShoppingCart, User, ShieldCheck, RotateCcw, Lock, X].map((Icon, i) => <Icon key={i} size={20} />)}</div></div>
      </BoardScreen>
    </>
  );
}

export default function FigmaMissingSectionsPage() {
  return (
    <div className="figma-board-page">
      <AuthForms />
      <CategoryListing />
      <SearchScreens />
      <OffersReviewsCart />
      <CheckoutFlow />
      <OrderLifecycle />
      <AccountSupport />
      <VisualSystem />
    </div>
  );
}
