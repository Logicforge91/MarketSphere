import React, { useMemo, useState } from "react";
import { ArrowLeft, Check, CreditCard, Gift, LockKeyhole, MapPin, PackageCheck, Plus, ShoppingBag, Tag, Truck, UserRound } from "lucide-react";
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

const deliveryMethods = [
  { id: "standard", name: "Standard delivery", detail: "3-5 business days", price: 0 },
  { id: "express", name: "Express delivery", detail: "1-2 business days", price: 149 },
  { id: "scheduled", name: "Scheduled delivery", detail: "Choose a preferred slot", price: 79 },
];

const paymentMethods = [
  { id: "upi", name: "UPI", detail: "Google Pay, PhonePe, Paytm" },
  { id: "card", name: "Credit or debit card", detail: "Visa, Mastercard, RuPay" },
  { id: "netbanking", name: "Net banking", detail: "All major Indian banks" },
  { id: "cod", name: "Cash on delivery", detail: "Pay when your order arrives" },
];

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder } = useShop();
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
  const [couponInput, setCouponInput] = useState("");
  const [giftInput, setGiftInput] = useState("");
  const [coupon, setCoupon] = useState("");
  const [giftCard, setGiftCard] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [giftWrap, setGiftWrap] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");

  const shippingAddress = addresses.find((item) => item.id === shippingId);
  const billingAddress = billingId === "same" ? shippingAddress : addresses.find((item) => item.id === billingId);
  const method = deliveryMethods.find((item) => item.id === deliveryMethod);
  const calculations = useMemo(() => {
    const couponDiscount = coupon === "SAVE10" ? Math.min(cartTotal * .1, 1200) : 0;
    const giftDiscount = giftCard === "GIFT500" ? Math.min(500, cartTotal - couponDiscount) : 0;
    const rewardDiscount = Math.min(rewardPoints, Math.max(0, cartTotal - couponDiscount - giftDiscount));
    const taxable = Math.max(0, cartTotal - couponDiscount - giftDiscount - rewardDiscount);
    const tax = Math.round(taxable * .05);
    const shipping = method.price;
    const wrapping = giftWrap ? 99 : 0;
    return { couponDiscount, giftDiscount, rewardDiscount, shipping, tax, wrapping, total: taxable + tax + shipping + wrapping };
  }, [cartTotal, coupon, giftCard, giftWrap, method.price, rewardPoints]);

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
    const valid = type === "coupon" ? value === "SAVE10" : value === "GIFT500";
    if (!valid) return setMessage(`Use ${type === "coupon" ? "SAVE10" : "GIFT500"} for this demo`);
    if (type === "coupon") setCoupon(value);
    else setGiftCard(value);
    setMessage(`${type === "coupon" ? "Coupon" : "Gift card"} applied`);
  }

  const identityValid = /\S+@\S+\.\S+/.test(contact.email) && contact.phone.replace(/\D/g, "").length >= 10;
  const addressValid = Boolean(shippingAddress && billingAddress && /^\d{6}$/.test(shippingAddress.pincode));
  const paymentValid = Boolean(paymentMethod);
  const reviewValid = identityValid && addressValid && paymentValid && termsAccepted;

  function continueStep() {
    if (step === 1 && !identityValid) return setMessage("Enter a valid email and mobile number.");
    if (step === 2 && !addressValid) return setMessage("Select valid shipping and billing addresses.");
    if (step === 3 && !paymentValid) return setMessage("Select a payment method.");
    setMessage("");
    setStep((value) => Math.min(4, value + 1));
  }

  function confirmOrder() {
    if (!reviewValid) return setMessage("Review the checkout details and accept the terms.");
    const order = placeOrder({
      address: shippingAddress,
      billingAddress,
      contact,
      deliveryMethod: method,
      deliverySlot: deliveryMethod === "scheduled" ? deliverySlot : null,
      discounts: calculations,
      giftWrap,
      notes: orderNotes,
      paymentMethod,
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
            {deliveryMethod === "scheduled" && <label className="delivery-slot">Delivery slot<select value={deliverySlot} onChange={(event) => setDeliverySlot(event.target.value)}><option>10 AM - 1 PM</option><option>1 PM - 4 PM</option><option>4 PM - 7 PM</option></select></label>}
          </div>}

          {step === 3 && <div className="checkout-section"><div className="checkout-section-title"><CreditCard /><div><span>Step 3</span><h1>Payment and savings</h1><p>Apply benefits and choose how you want to pay.</p></div></div>
            <div className="checkout-promotions"><label><span><Tag size={13} /> Coupon</span><div><input value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="SAVE10" /><button onClick={() => applyCode("coupon")}>Apply</button></div></label><label><span><Gift size={13} /> Gift card</span><div><input value={giftInput} onChange={(event) => setGiftInput(event.target.value)} placeholder="GIFT500" /><button onClick={() => applyCode("gift")}>Apply</button></div></label></div>
            <label className="checkout-rewards"><span>Redeem reward points <strong>{rewardPoints} points</strong></span><input type="range" min="0" max={Math.min(640, cartTotal)} step="10" value={rewardPoints} onChange={(event) => setRewardPoints(Number(event.target.value))} /><small>640 points available</small></label>
            <h2>Payment method</h2><div className="checkout-payment-methods">{paymentMethods.map((item) => <label className={paymentMethod === item.id ? "selected" : ""} key={item.id}><input type="radio" checked={paymentMethod === item.id} onChange={() => setPaymentMethod(item.id)} /><CreditCard /><div><strong>{item.name}</strong><span>{item.detail}</span></div></label>)}</div>
          </div>}

          {step === 4 && <div className="checkout-section"><div className="checkout-section-title"><PackageCheck /><div><span>Final step</span><h1>Review and confirm</h1><p>Check every detail before placing your order.</p></div></div>
            <section className="checkout-review-block"><header><h2>Items ({cart.length})</h2><button onClick={() => navigate("/cart")}>Edit cart</button></header>{cart.map((item) => <article key={item.name}><img src={item.image} alt={item.name} /><div><strong>{item.name}</strong><span>{item.variant ? Object.values(item.variant).join(" · ") : "Standard"} · Qty {item.qty || 1}</span></div><b>{money(item.price * (item.qty || 1))}</b></article>)}</section>
            <div className="checkout-review-grid"><section><h2>Deliver to</h2><strong>{shippingAddress?.name}</strong><p>{shippingAddress && `${shippingAddress.line1}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`}</p></section><section><h2>Delivery</h2><strong>{method.name}</strong><p>{method.detail}{deliveryMethod === "scheduled" && ` · ${deliverySlot}`}</p></section><section><h2>Payment</h2><strong>{paymentMethods.find((item) => item.id === paymentMethod)?.name}</strong><p>{contact.email}</p></section></div>
            <label className="gift-wrap-option"><input type="checkbox" checked={giftWrap} onChange={(event) => setGiftWrap(event.target.checked)} /><Gift /><span><strong>Add gift wrapping</strong><small>Premium wrap and message card · Rs. 99</small></span></label>
            <label className="order-notes">Order notes<textarea value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} placeholder="Special instructions for this order" maxLength="300" /></label>
            <label className="checkout-terms"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /> I confirm the order details and agree to the <Link to="/terms">terms and conditions</Link>.</label>
          </div>}

          <footer className="checkout-stage-actions">{step > 1 && <button className="secondary" onClick={() => setStep((value) => value - 1)}>Back</button>}{step < 4 ? <button className="primary" onClick={continueStep}>Continue</button> : <button className="primary" disabled={!reviewValid} onClick={confirmOrder}>Place order securely</button>}</footer>
        </section>

        <aside className="checkout-summary"><h2>Price summary</h2><div className="checkout-summary-items">{cart.map((item) => <p key={item.name}><span>{item.name} × {item.qty || 1}</span><strong>{money(item.price * (item.qty || 1))}</strong></p>)}</div><div className="checkout-summary-lines"><p><span>Subtotal</span><strong>{money(cartTotal)}</strong></p>{calculations.couponDiscount > 0 && <p><span>Coupon discount</span><strong className="saving">-{money(calculations.couponDiscount)}</strong></p>}{calculations.giftDiscount > 0 && <p><span>Gift card</span><strong className="saving">-{money(calculations.giftDiscount)}</strong></p>}{calculations.rewardDiscount > 0 && <p><span>Rewards</span><strong className="saving">-{money(calculations.rewardDiscount)}</strong></p>}<p><span>Tax summary (5%)</span><strong>{money(calculations.tax)}</strong></p><p><span>Shipping</span><strong>{calculations.shipping ? money(calculations.shipping) : "Free"}</strong></p>{giftWrap && <p><span>Gift wrapping</span><strong>{money(calculations.wrapping)}</strong></p>}</div><div className="checkout-total"><span>Total payable</span><strong>{money(calculations.total)}</strong></div><p className="checkout-secure-note"><LockKeyhole size={13} /> Payments are encrypted and securely processed.</p></aside>
      </div>
    </main>
  );
}
