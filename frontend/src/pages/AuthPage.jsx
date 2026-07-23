import React, { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useShop();
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    login({ email, name: email.split("@")[0] });
    navigate("/account");
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={submit}>
        <Link to="/" className="velora-logo">MARKETSPHERE</Link>
        <div className="auth-heading"><span>Welcome back</span><h1>Sign in to your account</h1><p>Access orders, saved products and member rewards.</p></div>
        <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="you@example.com" /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" minLength="4" required placeholder="Enter your password" /></label>
        <button className="primary" type="submit">Continue <ArrowRight size={17} /></button>
        <button className="secondary" type="button">Continue with OTP</button>
        <p className="auth-trust"><LockKeyhole size={14} /> Secure login <i /> <ShieldCheck size={14} /> Privacy protected</p>
      </form>
    </main>
  );
}
