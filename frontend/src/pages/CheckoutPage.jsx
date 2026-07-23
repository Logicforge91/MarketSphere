import React, { useState } from "react";
import { CreditCard, MapPin, ShoppingBag, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";
import PincodeDelivery from "../components/commerce/PincodeDelivery";
import { useAuth } from "../context/AuthContext";

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder } = useShop();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    line: "BTM 2nd Stage, Bengaluru, Karnataka",
    name: user?.name || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const navigate = useNavigate();

  if (!cart.length) {
    return <main className="checkout-empty"><ShoppingBag /><h1>Your bag is empty</h1><p>Add a few products before starting checkout.</p><Link className="primary" to="/products">Explore products</Link></main>;
  }

  function confirmOrder() {
    const order = placeOrder({ address, paymentMethod });
    if (order) navigate("/order-success");
  }

  const paymentOptions = ["UPI", "Credit / Debit Card", "Net Banking", "Cash on Delivery", "EMI"];

  return (
    <main className="real-page checkout-page">
      <div className="checkout-steps">{["Address", "Payment", "Review"].map((label, index) => <button className={step === index + 1 ? "selected" : ""} onClick={() => setStep(index + 1)} key={label}>{index + 1}. {label}</button>)}</div>
      {step === 1 && <section className="flow-card"><MapPin /><h1>Shipping address</h1><label>Full name<input value={address.name} onChange={(event) => setAddress({ ...address, name: event.target.value })} required /></label><label>Address<input value={address.line} onChange={(event) => setAddress({ ...address, line: event.target.value })} required /></label><PincodeDelivery /><button className="primary" disabled={!address.name || !address.line} onClick={() => setStep(2)}>Continue to payment</button></section>}
      {step === 2 && <section className="flow-card"><CreditCard /><h1>Payment method</h1>{paymentOptions.map((method) => <label className="radio-row" key={method}><input checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} name="payment" type="radio" /> {method}</label>)}<button className="primary" onClick={() => setStep(3)}>Review order</button></section>}
      {step === 3 && <section className="flow-card review-order"><Truck /><h1>Review your order</h1><div className="review-lines">{cart.map((item) => <div key={item.name}><span>{item.name} × {item.qty || 1}</span><strong>{money(item.price * (item.qty || 1))}</strong></div>)}</div><div className="review-delivery"><span>Deliver to</span><strong>{address.name}</strong><p>{address.line}</p></div><div className="review-total"><span>Total</span><strong>{money(cartTotal)}</strong></div><button className="primary" onClick={confirmOrder}>Place order securely</button></section>}
    </main>
  );
}
