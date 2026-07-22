import React, { useState } from "react";
import { Check, CreditCard, MapPin, Truck } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { money } from "../utils/format";

export default function CheckoutPage() {
  const { cartTotal } = useShop();
  const [step, setStep] = useState(1);

  return (
    <main className="real-page checkout-page">
      <div className="checkout-steps">{["Address", "Payment", "Review"].map((label, index) => <button className={step === index + 1 ? "selected" : ""} onClick={() => setStep(index + 1)} key={label}>{index + 1}. {label}</button>)}</div>
      {step === 1 && <section className="flow-card"><MapPin /><h1>Shipping Address</h1><input defaultValue="Rahul Kumar" /><input defaultValue="BTM, Bengaluru - 560102" /><button className="primary" onClick={() => setStep(2)}>Continue to Payment</button></section>}
      {step === 2 && <section className="flow-card"><CreditCard /><h1>Payment Method</h1>{["UPI", "Credit / Debit Card", "Net Banking", "Cash on Delivery"].map((m) => <label className="radio-row" key={m}><input name="payment" type="radio" /> {m}</label>)}<button className="primary" onClick={() => setStep(3)}>Review Order</button></section>}
      {step === 3 && <section className="flow-card success-flow"><Check /><h1>Order Confirmed</h1><p>Total paid {money(cartTotal)}</p><p><Truck size={16} /> Delivery by Wed, 24 May</p></section>}
    </main>
  );
}
