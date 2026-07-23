import React from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link to="/" className="velora-logo">MARKETSPHERE</Link>
        <div className="auth-heading"><span>Welcome back</span><h1>Sign in to your account</h1><p>Access orders, saved products and member rewards.</p></div>
        <label>Mobile number<input placeholder="+91 98765 43210" /></label>
        <label>Password or OTP<input type="password" placeholder="Enter your password" /></label>
        <button className="primary">Continue <ArrowRight size={17} /></button>
        <button className="secondary">Continue with OTP</button>
        <p className="auth-trust"><LockKeyhole size={14} /> Secure login <i /> <ShieldCheck size={14} /> Privacy protected</p>
      </section>
    </main>
  );
}
