import React, { useMemo, useState } from "react";
import { ArrowLeft, Building2, Check, CreditCard, Gift, LockKeyhole, MapPin, PackageCheck, Plus, RefreshCw, ShieldCheck, ShoppingBag, Smartphone, Tag, Truck, UserRound, WalletCards } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { money } from "../utils/format";

function readAddresses() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:addresses")) || [];
  } catch {
    return [];
  }
}

function readWallet() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:wallet")) || { cashBalance: 1250, promotionalBalance: 300, transactions: [] };
  } catch {
    return { cashBalance: 1250, promotionalBalance: 300, transactions: [] };
  }
}

function readGiftCards() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:gift-cards")) || [{ code: "GIFT500", pin: "2408", amount: 500, balance: 500, expiry: "2027-07-18", status: "Delivered", transactions: [] }];
  } catch {
    return [{ code: "GIFT500", pin: "2408", amount: 500, balance: 500, expiry: "2027-07-18", status: "Delivered", transactions: [] }];
  }
}

function readMembership() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:membership")) || { planId: "free", status: "Active" };
  } catch {
    return { planId: "free", status: "Active" };
  }
}

const deliveryMethods = [
  { id: "standard", name: "Standard delivery", detail: "3-5 business days", price: 99 },
  { id: "express", name: "Express delivery", detail: "1-2 business days", price: 149 },
  { id: "same-day", name: "Same-day delivery", detail: "Order before 2 PM", price: 299 },
  { id: "scheduled", name: "Scheduled delivery", detail: "Choose a preferred slot", price: 79 },
  { id: "pickup", name: "Store pickup", detail: "Collect from a nearby MarketSphere point", price: 0 },
];

const paymentMethods = [
  { id: "saved-card", name: "Saved card", detail: "Visa ending in 4242", icon: CreditCard },
  { id: "card", name: "Credit or debit card", detail: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "upi", name: "UPI", detail: "Apps or verified UPI ID", icon: Smartphone },
  { id: "netbanking", name: "Net banking", detail: "All major Indian banks", icon: Building2 },
  { id: "wallet", name: "Wallet", detail: "MarketSphere balance: Rs. 1,250", icon: WalletCards },
  { id: "emi", name: "EMI", detail: "Credit-card plans from 3 months", icon: CreditCard },
  { id: "bnpl", name: "Buy now, pay later", detail: "Pay next month with no extra cost", icon: WalletCards },
  { id: "cod", name: "Cash on delivery", detail: "Pay when your order arrives", icon: PackageCheck },
];

const promotionCatalog = [
  { code: "SAVE10", title: "10% off your order", type: "Order", description: "Save up to Rs. 1,200 on orders above Rs. 999.", min: 999, expires: "31 Aug 2026" },
  { code: "FIRST20", title: "First order offer", type: "Welcome", description: "20% off up to Rs. 1,500 for your first purchase.", min: 799, firstOrder: true, expires: "30 Sep 2026" },
  { code: "REFER500", title: "Referral reward", type: "Referral", description: "Rs. 500 off when shopping through a referral.", min: 1999, expires: "31 Dec 2026" },
  { code: "STYLE15", title: "Fashion category offer", type: "Category", description: "15% off eligible fashion products.", min: 1499, category: ["Women", "Men", "Fashion"], expires: "15 Aug 2026" },
  { code: "SELECT300", title: "MarketSphere Select", type: "Seller", description: "Rs. 300 off products from MarketSphere Select.", min: 1299, seller: "MarketSphere Select", expires: "20 Aug 2026" },
  { code: "PRODUCT200", title: "Featured product offer", type: "Product", description: "Rs. 200 off selected products.", min: 999, productSpecific: true, expires: "10 Aug 2026" },
  { code: "FREESHIP", title: "Free delivery", type: "Shipping", description: "Standard shipping fee waived above Rs. 499.", min: 499, freeShipping: true, expires: "31 Dec 2026" },
  { code: "HDFC10", title: "HDFC Bank offer", type: "Bank", description: "10% instant discount with eligible HDFC payments.", min: 2499, payment: "netbanking", expires: "31 Aug 2026" },
  { code: "UPI100", title: "UPI special", type: "UPI", description: "Rs. 100 off when paying by UPI.", min: 999, payment: "upi", expires: "31 Aug 2026" },
];

function promotionEligibility(promotion, { cart, cartTotal, orders, paymentMethod }) {
  if (cartTotal < promotion.min) return `Add ${money(promotion.min - cartTotal)} more`;
  if (promotion.firstOrder && orders.length) return "Valid on your first order only";
  if (promotion.payment && paymentMethod !== promotion.payment) return `Select ${promotion.payment === "upi" ? "UPI" : "net banking"}`;
  if (promotion.seller && !cart.some((item) => (item.seller || "MarketSphere Select") === promotion.seller)) return "Eligible seller item required";
  if (promotion.category && !cart.some((item) => promotion.category.includes(item.category))) return "Eligible category item required";
  if (promotion.productSpecific && !cart.some((item) => item.featured || item.rating >= 4.5)) return "Selected product required";
  return "";
}

export default function CheckoutPage() {
  const { cart, cartTotal, orders, placeOrder } = useShop();
  const { isAuthenticated, loginWithPassword, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [checkoutMode, setCheckoutMode] = useState(isAuthenticated ? "member" : "guest");
  const [contact, setContact] = useState({ email: user?.email || "", phone: user?.mobile || "" });
  const [login, setLogin] = useState({ identifier: "", password: "" });
  const [addresses, setAddresses] = useState(readAddresses);
  const [shippingId, setShippingId] = useState(() => readAddresses().find((item) => item.primary)?.id || readAddresses()[0]?.id || "");
  const [billingId, setBillingId] = useState("same");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: "", line1: "", city: "", state: "", pincode: "", type: "Home" });
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [deliverySlot, setDeliverySlot] = useState("10 AM - 1 PM");
  const [deliveryDate, setDeliveryDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [contactless, setContactless] = useState(false);
  const [pickupStore, setPickupStore] = useState("MarketSphere Koramangala");
  const [couponInput, setCouponInput] = useState("");
  const [giftInput, setGiftInput] = useState("");
  const [coupon, setCoupon] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);
  const [giftCard, setGiftCard] = useState("");
  const [giftCards] = useState(readGiftCards);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [giftWrap, setGiftWrap] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("saved-card");
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: "", name: "", expiry: "", cvv: "", upi: "", bank: "HDFC Bank", emi: "3 months", authCode: "" });
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentError, setPaymentError] = useState("");
  const [wallet] = useState(readWallet);
  const [membership] = useState(readMembership);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");

  const shippingAddress = addresses.find((item) => item.id === shippingId);
  const billingAddress = billingId === "same" ? shippingAddress : addresses.find((item) => item.id === billingId);
  const method = deliveryMethods.find((item) => item.id === deliveryMethod);
  const sellerShipments = useMemo(() => {
    const grouped = cart.reduce((groups, item, index) => {
      const seller = item.seller || ["MarketSphere Select", "The Modern Wardrobe", "Sole Society"][index % 3];
      groups[seller] = [...(groups[seller] || []), item];
      return groups;
    }, {});
    return Object.entries(grouped).map(([seller, items], index) => ({
      id: `SHP-${index + 1}`,
      seller,
      items,
      estimate: index ? "3-5 days" : "2-3 days",
    }));
  }, [cart]);
  const couponOptions = useMemo(() => promotionCatalog.map((promotion) => ({
    ...promotion,
    reason: promotionEligibility(promotion, { cart, cartTotal, orders, paymentMethod }),
  })), [cart, cartTotal, orders, paymentMethod]);
  const calculations = useMemo(() => {
    const selectedCoupon = promotionCatalog.find((item) => item.code === coupon);
    const activeCoupon = selectedCoupon && !promotionEligibility(selectedCoupon, { cart, cartTotal, orders, paymentMethod }) ? selectedCoupon : null;
    let couponDiscount = 0;
    if (activeCoupon?.code === "SAVE10") couponDiscount = Math.min(cartTotal * .1, 1200);
    if (activeCoupon?.code === "FIRST20") couponDiscount = Math.min(cartTotal * .2, 1500);
    if (activeCoupon?.code === "REFER500") couponDiscount = 500;
    if (activeCoupon?.code === "STYLE15") couponDiscount = Math.min(cart.filter((item) => activeCoupon.category.includes(item.category)).reduce((sum, item) => sum + item.price * (item.qty || 1), 0) * .15, 1200);
    if (activeCoupon?.code === "SELECT300") couponDiscount = 300;
    if (activeCoupon?.code === "PRODUCT200") couponDiscount = 200;
    if (activeCoupon?.code === "HDFC10") couponDiscount = Math.min(cartTotal * .1, 1000);
    if (activeCoupon?.code === "UPI100") couponDiscount = 100;
    const bogoDiscount = cart.some((item) => (item.qty || 1) >= 2) ? Math.min(...cart.filter((item) => (item.qty || 1) >= 2).map((item) => item.price)) : 0;
    const bundleDiscount = cart.length >= 3 ? 300 : 0;
    const premiumActive = membership.planId?.startsWith("premium") && ["Active", "Cancellation scheduled"].includes(membership.status);
    const memberDiscount = premiumActive ? Math.min(cartTotal * .05, 1500) : 0;
    const automaticDiscount = Math.max(bogoDiscount, bundleDiscount, cartTotal >= 3000 ? 200 : 0);
    const selectedGiftCard = giftCards.find((item) => item.code === giftCard && item.balance > 0 && new Date(`${item.expiry}T23:59:59`) >= new Date());
    const giftDiscount = selectedGiftCard ? Math.min(selectedGiftCard.balance, Math.max(0, cartTotal - couponDiscount - automaticDiscount - memberDiscount)) : 0;
    const rewardDiscount = Math.min(rewardPoints, Math.max(0, cartTotal - couponDiscount - automaticDiscount - memberDiscount - giftDiscount));
    const taxable = Math.max(0, cartTotal - couponDiscount - automaticDiscount - memberDiscount - giftDiscount - rewardDiscount);
    const tax = Math.round(taxable * .05);
    const memberFreeDelivery = premiumActive && (method.id === "standard" || (membership.planId === "premium-annual" && method.id === "express"));
    const shipping = activeCoupon?.freeShipping || memberFreeDelivery || (method.id === "standard" && taxable >= 1999) ? 0 : method.price;
    const wrapping = giftWrap ? 99 : 0;
    const automaticLabel = bogoDiscount >= Math.max(bundleDiscount, 200) ? "Buy one, get one" : bundleDiscount >= 200 ? "Bundle offer" : "Automatic promotion";
    return { couponDiscount, automaticDiscount, automaticLabel, memberDiscount, giftDiscount, rewardDiscount, shipping, tax, wrapping, total: taxable + tax + shipping + wrapping };
  }, [cart, cartTotal, coupon, giftCard, giftCards, giftWrap, membership, method.id, method.price, orders, paymentMethod, rewardPoints]);

  if (!cart.length) return <main className="checkout-empty"><ShoppingBag /><h1>Your bag is empty</h1><p>Add products before starting checkout.</p><Link className="primary" to="/products">Explore products</Link></main>;

  function signIn(event) {
    event.preventDefault();
    loginWithPassword(login);
    setCheckoutMode("member");
    setContact({ email: login.identifier.includes("@") ? login.identifier : "customer@marketsphere.in", phone: login.identifier.includes("@") ? contact.phone : login.identifier });
    setMessage("Signed in. Your checkout details are saved.");
  }

  function addAddress(event) {
    event.preventDefault();
    if (!/^\d{6}$/.test(newAddress.pincode)) return;
    const address = { ...newAddress, id: `checkout-${Date.now()}`, area: "", phone: contact.phone, primary: !addresses.length };
    const next = [...addresses, address];
    setAddresses(next);
    setShippingId(address.id);
    window.localStorage.setItem("marketsphere:addresses", JSON.stringify(next));
    setShowAddressForm(false);
  }

  function applyCode(type) {
    const value = (type === "coupon" ? couponInput : giftInput).trim().toUpperCase();
    const promotion = promotionCatalog.find((item) => item.code === value);
    const reason = promotion && promotionEligibility(promotion, { cart, cartTotal, orders, paymentMethod });
    const storedCard = giftCards.find((item) => item.code === value);
    const giftValid = storedCard && storedCard.balance > 0 && new Date(`${storedCard.expiry}T23:59:59`) >= new Date();
    const valid = type === "coupon" ? promotion && !reason : giftValid;
    if (!valid) return setMessage(reason || `Enter a valid ${type === "coupon" ? "coupon" : "gift card"} code.`);
    if (type === "coupon") {
      setCoupon(value);
      setShowCoupons(false);
    }
    else setGiftCard(value);
    setMessage(`${type === "coupon" ? "Coupon" : "Gift card"} applied`);
  }

  const identityValid = /\S+@\S+\.\S+/.test(contact.email) && contact.phone.replace(/\D/g, "").length >= 10;
  const addressValid = Boolean(shippingAddress && billingAddress && /^\d{6}$/.test(shippingAddress.pincode));
  const paymentValid = Boolean(paymentMethod)
    && (paymentMethod !== "saved-card" || /^\d{3}$/.test(paymentDetails.cvv))
    && (paymentMethod !== "card" || (paymentDetails.cardNumber.replace(/\D/g, "").length === 16 && paymentDetails.name && /^\d{2}\/\d{2}$/.test(paymentDetails.expiry) && /^\d{3}$/.test(paymentDetails.cvv)))
    && (paymentMethod !== "upi" || /^[\w.-]+@[\w.-]+$/.test(paymentDetails.upi));
  const reviewValid = identityValid && addressValid && paymentValid && termsAccepted;

  function continueStep() {
    if (step === 1 && !identityValid) return setMessage("Enter a valid email and mobile number.");
    if (step === 2 && !addressValid) return setMessage("Select valid shipping and billing addresses.");
    if (step === 3 && !paymentValid) return setMessage("Select a payment method.");
    setMessage("");
    setStep((value) => Math.min(4, value + 1));
  }

  async function confirmOrder() {
    if (!reviewValid) return setMessage("Review the checkout details and accept the terms.");
    if (paymentStatus === "processing" || paymentStatus === "verified") return;
    const paymentKey = `marketsphere:payment:${cart.map((item) => `${item.id || item.name}:${item.qty || 1}`).join("|")}:${calculations.total}`;
    if (window.sessionStorage.getItem(paymentKey) === "processing") {
      setPaymentError("This payment is already being processed. Please wait before trying again.");
      return;
    }
    window.sessionStorage.setItem(paymentKey, "processing");
    setPaymentStatus("processing");
    setPaymentError("");
    setMessage("Connecting securely to the payment gateway...");
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    if (paymentMethod === "card" && paymentDetails.cardNumber.endsWith("0000")) {
      window.sessionStorage.removeItem(paymentKey);
      setPaymentStatus("failed");
      setPaymentError("Your bank declined this payment. Check the details or retry with another method.");
      setMessage("");
      return;
    }
    const transactionId = paymentMethod === "cod" ? null : `PAY${Date.now().toString().slice(-10)}`;
    if (paymentMethod === "wallet") {
      const promotionalUsed = Math.min(wallet.promotionalBalance, calculations.total);
      const cashUsed = Math.min(wallet.cashBalance, calculations.total - promotionalUsed);
      window.localStorage.setItem("marketsphere:wallet", JSON.stringify({
        ...wallet,
        promotionalBalance: wallet.promotionalBalance - promotionalUsed,
        cashBalance: wallet.cashBalance - cashUsed,
        transactions: [{ id: transactionId, type: "debit", category: "Payment", label: "Wallet payment at checkout", amount: promotionalUsed + cashUsed, date: new Date().toISOString(), status: promotionalUsed + cashUsed >= calculations.total ? "Completed" : "Part payment" }, ...(wallet.transactions || [])],
      }));
    }
    if (giftCard && calculations.giftDiscount > 0) {
      const nextCards = giftCards.map((card) => card.code === giftCard ? {
        ...card,
        balance: card.balance - calculations.giftDiscount,
        status: card.balance - calculations.giftDiscount > 0 ? "Partially redeemed" : "Redeemed",
        transactions: [{ id: `GC-${Date.now().toString().slice(-5)}`, type: "debit", label: "Used at checkout", amount: calculations.giftDiscount, date: new Date().toISOString() }, ...(card.transactions || [])],
      } : card);
      window.localStorage.setItem("marketsphere:gift-cards", JSON.stringify(nextCards));
    }
    setPaymentStatus("verified");
    window.sessionStorage.setItem(paymentKey, "completed");
    const order = placeOrder({
      address: shippingAddress,
      billingAddress,
      contact,
      deliveryMethod: method,
      deliveryDate: ["scheduled", "same-day"].includes(deliveryMethod) ? deliveryDate : null,
      deliverySlot: ["scheduled", "same-day"].includes(deliveryMethod) ? deliverySlot : null,
      deliveryInstructions,
      contactless,
      pickupStore: deliveryMethod === "pickup" ? pickupStore : null,
      shipments: sellerShipments,
      discounts: calculations,
      giftWrap,
      notes: orderNotes,
      paymentMethod,
      payment: {
        status: paymentMethod === "cod" ? "Pay on delivery" : "Verified",
        transactionId,
        gateway: "MarketSphere SecurePay",
        instrument: paymentMethod === "card" ? `Card ending ${paymentDetails.cardNumber.slice(-4)}` : paymentMethods.find((item) => item.id === paymentMethod)?.name,
        verifiedAt: new Date().toISOString(),
      },
      total: calculations.total,
    });
    if (order) navigate("/order-success");
  }

  return (
    <main className="advanced-checkout real-page">
      <header className="checkout-header"><Link to="/cart"><ArrowLeft size={15} /> Back to cart</Link><div><LockKeyhole size={15} /> Secure checkout</div></header>
      <nav className="advanced-checkout-steps">{["Contact", "Delivery", "Payment", "Review"].map((label, index) => <button className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""} onClick={() => step > index + 1 && setStep(index + 1)} key={label}><i>{step > index + 1 ? <Check size={12} /> : index + 1}</i><span>{label}</span></button>)}</nav>
      {message && <p className="checkout-message" role="status">{message}</p>}

      <div className="advanced-checkout-layout">
        <section className="checkout-stage">
          {step === 1 && <div className="checkout-section"><div className="checkout-section-title"><UserRound /><div><span>Step 1</span><h1>Contact information</h1><p>Use guest checkout or sign in without leaving this page.</p></div></div>
            {!isAuthenticated && <div className="checkout-mode-tabs"><button className={checkoutMode === "guest" ? "active" : ""} onClick={() => setCheckoutMode("guest")}>Continue as guest</button><button className={checkoutMode === "login" ? "active" : ""} onClick={() => setCheckoutMode("login")}>Sign in</button></div>}
            {checkoutMode === "login" && !isAuthenticated ? <form className="checkout-login-form" onSubmit={signIn}><label>Email or mobile<input required value={login.identifier} onChange={(event) => setLogin({ ...login, identifier: event.target.value })} /></label><label>Password<input required type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label><button className="secondary">Sign in and continue</button></form> : <div className="checkout-form-grid"><label>Email address<input type="email" required value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} /></label><label>Mobile number<input type="tel" required value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} /></label></div>}
          </div>}

          {step === 2 && <div className="checkout-section"><div className="checkout-section-title"><MapPin /><div><span>Step 2</span><h1>Delivery details</h1><p>Select shipping, billing, delivery method and preferred slot.</p></div></div>
            <div className="checkout-address-heading"><h2>Shipping address</h2><button onClick={() => setShowAddressForm((value) => !value)}><Plus size={14} /> Add new</button></div>
            {showAddressForm && <form className="checkout-address-form" onSubmit={addAddress}><input required placeholder="Full name" value={newAddress.name} onChange={(event) => setNewAddress({ ...newAddress, name: event.target.value })} /><input required placeholder="Street or building" value={newAddress.line1} onChange={(event) => setNewAddress({ ...newAddress, line1: event.target.value })} /><input required placeholder="City" value={newAddress.city} onChange={(event) => setNewAddress({ ...newAddress, city: event.target.value })} /><input required placeholder="State" value={newAddress.state} onChange={(event) => setNewAddress({ ...newAddress, state: event.target.value })} /><input required inputMode="numeric" maxLength="6" placeholder="Pincode" value={newAddress.pincode} onChange={(event) => setNewAddress({ ...newAddress, pincode: event.target.value.replace(/\D/g, "") })} /><button className="secondary">Save address</button></form>}
            <div className="checkout-address-list">{addresses.map((address) => <label className={shippingId === address.id ? "selected" : ""} key={address.id}><input type="radio" name="shipping" checked={shippingId === address.id} onChange={() => setShippingId(address.id)} /><div><strong>{address.type} · {address.name}</strong><p>{address.line1}, {address.area && `${address.area}, `}{address.city}, {address.state} - {address.pincode}</p></div>{address.primary && <span>Default</span>}</label>)}</div>
            {!addresses.length && !showAddressForm && <p className="checkout-inline-warning">Add a delivery address to continue.</p>}
            <div className="billing-address"><h2>Billing address</h2><label><input type="radio" checked={billingId === "same"} onChange={() => setBillingId("same")} /> Same as shipping</label>{addresses.filter((item) => item.id !== shippingId).map((address) => <label key={address.id}><input type="radio" checked={billingId === address.id} onChange={() => setBillingId(address.id)} /> {address.type} · {address.line1}</label>)}</div>
            <h2 className="delivery-heading">Delivery method</h2><div className="delivery-methods">{deliveryMethods.map((item) => <label className={deliveryMethod === item.id ? "selected" : ""} key={item.id}><input type="radio" checked={deliveryMethod === item.id} onChange={() => setDeliveryMethod(item.id)} /><Truck /><div><strong>{item.name}</strong><span>{item.detail}</span></div><b>{item.price ? money(item.price) : "Free"}</b></label>)}</div>
            {["scheduled", "same-day"].includes(deliveryMethod) && <div className="delivery-schedule"><label>Delivery date<input type="date" min={new Date().toISOString().slice(0, 10)} value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} /></label><label>Delivery slot<select value={deliverySlot} onChange={(event) => setDeliverySlot(event.target.value)}><option>10 AM - 1 PM</option><option>1 PM - 4 PM</option><option>4 PM - 7 PM</option><option>7 PM - 9 PM</option></select></label></div>}
            {deliveryMethod === "pickup" && <label className="pickup-location">Pickup location<select value={pickupStore} onChange={(event) => setPickupStore(event.target.value)}><option>MarketSphere Koramangala</option><option>MarketSphere Indiranagar</option><option>MarketSphere HSR Layout</option></select><small>We will notify you when every item is ready to collect.</small></label>}
            <div className="delivery-preferences"><label className="contactless-option"><input type="checkbox" checked={contactless} onChange={(event) => setContactless(event.target.checked)} /><span><strong>Contactless delivery</strong><small>Leave the package at the door and notify me.</small></span></label><label>Delivery instructions<textarea maxLength="180" value={deliveryInstructions} onChange={(event) => setDeliveryInstructions(event.target.value)} placeholder="Gate code, landmark or drop-off preference" /></label></div>
            <section className="seller-shipment-preview"><header><div><h2>Seller-wise shipments</h2><p>Items may arrive separately based on seller availability.</p></div><span>{sellerShipments.length} {sellerShipments.length === 1 ? "package" : "packages"}</span></header>{sellerShipments.map((shipment) => <article key={shipment.id}><PackageCheck size={18} /><div><strong>{shipment.seller}</strong><span>{shipment.items.length} {shipment.items.length === 1 ? "item" : "items"} · Est. {shipment.estimate}</span></div></article>)}</section>
          </div>}

          {step === 3 && <div className="checkout-section"><div className="checkout-section-title"><CreditCard /><div><span>Step 3</span><h1>Payment and savings</h1><p>Apply benefits and choose how you want to pay.</p></div></div>
            <div className="checkout-promotions"><label><span><Tag size={13} /> Coupon</span><div><input value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Enter coupon code" /><button onClick={() => applyCode("coupon")}>Apply</button></div>{coupon ? <small className="applied-coupon"><Check size={12} /> {coupon} applied <button onClick={() => { setCoupon(""); setCouponInput(""); setMessage("Coupon removed."); }}>Remove</button></small> : <button className="browse-coupons" onClick={() => setShowCoupons((value) => !value)}>Browse available coupons</button>}</label><label><span><Gift size={13} /> Gift card</span><div><input value={giftInput} onChange={(event) => setGiftInput(event.target.value)} placeholder="GIFT500" /><button onClick={() => applyCode("gift")}>Apply</button></div></label></div>
            {showCoupons && <section className="coupon-browser"><header><div><span>Available promotions</span><h2>Choose your best offer</h2></div><button onClick={() => setShowCoupons(false)}>Close</button></header><div className="coupon-list">{couponOptions.map((promotion) => <article className={promotion.reason ? "ineligible" : ""} key={promotion.code}><div className="coupon-code"><Tag size={14} /><strong>{promotion.code}</strong><span>{promotion.type}</span></div><div className="coupon-copy"><strong>{promotion.title}</strong><p>{promotion.description}</p><small className={promotion.reason ? "eligibility-failed" : ""}>{promotion.reason || "Eligible for this order"} · Expires {promotion.expires}</small></div><button disabled={Boolean(promotion.reason)} onClick={() => { setCouponInput(promotion.code); setCoupon(promotion.code); setShowCoupons(false); setMessage(`${promotion.code} applied successfully.`); }}>{coupon === promotion.code ? "Applied" : "Apply"}</button></article>)}</div></section>}
            {calculations.automaticDiscount > 0 && <aside className="automatic-promotion"><Check size={15} /><div><strong>{calculations.automaticLabel} applied automatically</strong><span>You saved {money(calculations.automaticDiscount)}. No coupon code needed.</span></div></aside>}
            <label className="checkout-rewards"><span>Redeem reward points <strong>{rewardPoints} points</strong></span><input type="range" min="0" max={Math.min(640, cartTotal)} step="10" value={rewardPoints} onChange={(event) => setRewardPoints(Number(event.target.value))} /><small>640 points available</small></label>
            <h2>Payment method</h2><div className="checkout-payment-methods">{paymentMethods.map((item) => { const MethodIcon = item.icon; return <label className={paymentMethod === item.id ? "selected" : ""} key={item.id}><input type="radio" checked={paymentMethod === item.id} onChange={() => { setPaymentMethod(item.id); setPaymentError(""); setPaymentStatus("idle"); }} /><MethodIcon /><div><strong>{item.name}</strong><span>{item.detail}</span></div>{item.id === "saved-card" && <b>Default</b>}</label>; })}</div>
            <section className="payment-method-detail">
              {paymentMethod === "saved-card" && <div className="saved-payment-choice"><CreditCard /><div><strong>Visa ···· 4242</strong><span>Expires 12/28 · Secured with 3D Secure</span></div><label>CVV<input inputMode="numeric" maxLength="3" value={paymentDetails.cvv} onChange={(event) => setPaymentDetails({ ...paymentDetails, cvv: event.target.value.replace(/\D/g, "") })} placeholder="123" /></label></div>}
              {paymentMethod === "card" && <div className="payment-field-grid"><label className="wide">Card number<input inputMode="numeric" maxLength="19" value={paymentDetails.cardNumber} onChange={(event) => setPaymentDetails({ ...paymentDetails, cardNumber: event.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() })} placeholder="1234 5678 9012 3456" /></label><label className="wide">Name on card<input value={paymentDetails.name} onChange={(event) => setPaymentDetails({ ...paymentDetails, name: event.target.value })} placeholder="As printed on card" /></label><label>Expiry<input maxLength="5" value={paymentDetails.expiry} onChange={(event) => setPaymentDetails({ ...paymentDetails, expiry: event.target.value })} placeholder="MM/YY" /></label><label>CVV<input type="password" inputMode="numeric" maxLength="3" value={paymentDetails.cvv} onChange={(event) => setPaymentDetails({ ...paymentDetails, cvv: event.target.value.replace(/\D/g, "") })} placeholder="•••" /></label></div>}
              {paymentMethod === "upi" && <div className="upi-payment"><label>UPI ID<input value={paymentDetails.upi} onChange={(event) => setPaymentDetails({ ...paymentDetails, upi: event.target.value })} placeholder="name@bank" /></label><button className="secondary" onClick={() => setMessage(/^[\w.-]+@[\w.-]+$/.test(paymentDetails.upi) ? "UPI ID verified successfully." : "Enter a valid UPI ID.")}>Verify UPI</button><div className="upi-apps"><button>G Pay</button><button>PhonePe</button><button>Paytm</button></div></div>}
              {paymentMethod === "netbanking" && <label className="payment-select">Select bank<select value={paymentDetails.bank} onChange={(event) => setPaymentDetails({ ...paymentDetails, bank: event.target.value })}><option>HDFC Bank</option><option>ICICI Bank</option><option>State Bank of India</option><option>Axis Bank</option><option>Kotak Mahindra Bank</option></select></label>}
              {paymentMethod === "wallet" && <div className="wallet-balance"><WalletCards /><div><strong>{money(wallet.cashBalance + wallet.promotionalBalance)} available</strong><span>{calculations.total > wallet.cashBalance + wallet.promotionalBalance ? `${money(calculations.total - wallet.cashBalance - wallet.promotionalBalance)} will be charged using a backup method.` : "Your wallet covers this order. Promotional balance is used first."}</span></div></div>}
              {paymentMethod === "emi" && <label className="payment-select">Choose EMI plan<select value={paymentDetails.emi} onChange={(event) => setPaymentDetails({ ...paymentDetails, emi: event.target.value })}><option>3 months · {money(Math.ceil(calculations.total / 3))}/month</option><option>6 months · {money(Math.ceil(calculations.total / 6))}/month</option><option>12 months · {money(Math.ceil(calculations.total / 12))}/month</option></select></label>}
              {paymentMethod === "bnpl" && <div className="wallet-balance"><ShieldCheck /><div><strong>Pay in 30 days</strong><span>Identity verification and provider approval are required.</span></div><button className="secondary" onClick={() => setMessage("Buy now, pay later eligibility verified.")}>Check eligibility</button></div>}
              {paymentMethod === "cod" && <div className="wallet-balance"><PackageCheck /><div><strong>Pay at delivery</strong><span>Keep the exact amount ready. A verification OTP may be required.</span></div></div>}
              {!["cod", "wallet"].includes(paymentMethod) && <div className="secure-auth-note"><ShieldCheck size={16} /><span><strong>Secure payment authentication</strong>Your bank or payment provider may request an OTP before approval.</span></div>}
            </section>
            {paymentError && <div className="payment-failure" role="alert"><div><strong>Payment failed</strong><span>{paymentError}</span></div><button onClick={() => { setPaymentStatus("idle"); setPaymentError(""); }}><RefreshCw size={14} /> Retry payment</button></div>}
          </div>}

          {step === 4 && <div className="checkout-section"><div className="checkout-section-title"><PackageCheck /><div><span>Final step</span><h1>Review and confirm</h1><p>Check every detail before placing your order.</p></div></div>
            <section className="checkout-review-block"><header><h2>Items ({cart.length})</h2><button onClick={() => navigate("/cart")}>Edit cart</button></header>{cart.map((item) => <article key={item.name}><img src={item.image} alt={item.name} /><div><strong>{item.name}</strong><span>{item.variant ? Object.values(item.variant).join(" · ") : "Standard"} · Qty {item.qty || 1}</span></div><b>{money(item.price * (item.qty || 1))}</b></article>)}</section>
            <div className="checkout-review-grid"><section><h2>Deliver to</h2><strong>{shippingAddress?.name}</strong><p>{shippingAddress && `${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`}</p></section><section><h2>Delivery</h2><strong>{method.name}</strong><p>{method.detail}{deliveryMethod === "scheduled" && ` · ${deliverySlot}`}</p></section><section><h2>Payment</h2><strong>{paymentMethods.find((item) => item.id === paymentMethod)?.name}</strong><p>{contact.email}</p></section></div>
            <label className="gift-wrap-option"><input type="checkbox" checked={giftWrap} onChange={(event) => setGiftWrap(event.target.checked)} /><Gift /><span><strong>Add gift wrapping</strong><small>Premium wrap and message card · Rs. 99</small></span></label>
            <label className="order-notes">Order notes<textarea value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} placeholder="Special instructions for this order" maxLength="300" /></label>
            <label className="checkout-terms"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /> I confirm the order details and agree to the <Link to="/terms">terms and conditions</Link>.</label>
          </div>}

          <footer className="checkout-stage-actions">{step > 1 && <button className="secondary" onClick={() => setStep((value) => value - 1)}>Back</button>}{step < 4 ? <button className="primary" onClick={continueStep}>Continue</button> : <button className="primary" disabled={!reviewValid || paymentStatus === "processing"} onClick={confirmOrder}>{paymentStatus === "processing" ? "Verifying payment..." : paymentStatus === "failed" ? "Retry secure payment" : "Place order securely"}</button>}</footer>
        </section>

        <aside className="checkout-summary"><h2>Price summary</h2><div className="checkout-summary-items">{cart.map((item) => <p key={item.name}><span>{item.name} × {item.qty || 1}</span><strong>{money(item.price * (item.qty || 1))}</strong></p>)}</div><div className="checkout-summary-lines"><p><span>Subtotal</span><strong>{money(cartTotal)}</strong></p>{calculations.couponDiscount > 0 && <p><span>Coupon · {coupon}</span><strong className="saving">-{money(calculations.couponDiscount)}</strong></p>}{calculations.automaticDiscount > 0 && <p><span>{calculations.automaticLabel}</span><strong className="saving">-{money(calculations.automaticDiscount)}</strong></p>}{calculations.memberDiscount > 0 && <p><span>Premium member discount</span><strong className="saving">-{money(calculations.memberDiscount)}</strong></p>}{calculations.giftDiscount > 0 && <p><span>Gift card</span><strong className="saving">-{money(calculations.giftDiscount)}</strong></p>}{calculations.rewardDiscount > 0 && <p><span>Rewards</span><strong className="saving">-{money(calculations.rewardDiscount)}</strong></p>}<p><span>Tax summary (5%)</span><strong>{money(calculations.tax)}</strong></p><p><span>Shipping</span><strong>{calculations.shipping ? money(calculations.shipping) : "Free"}</strong></p>{giftWrap && <p><span>Gift wrapping</span><strong>{money(calculations.wrapping)}</strong></p>}</div><div className="checkout-total"><span>Total payable</span><strong>{money(calculations.total)}</strong></div><p className="checkout-secure-note"><LockKeyhole size={13} /> Payments are encrypted and securely processed.</p></aside>
      </div>
    </main>
  );
}
