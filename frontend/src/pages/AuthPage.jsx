import React from "react";
import { ShoppingCart } from "lucide-react";

export default function AuthPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand big"><ShoppingCart size={35} /> Shop<span>Hub</span></div>
        <h1>Login to India&apos;s best shopping experience</h1>
        <input placeholder="Enter mobile number" />
        <input placeholder="Password or OTP" />
        <button className="primary">Login</button>
        <button className="secondary">Continue with OTP</button>
      </section>
    </main>
  );
}
