import React, { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { loginWithPassword, socialLogin } = useAuth();
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    loginWithPassword({ identifier, password });
    navigate("/account");
  }

  function useSocial(provider) {
    socialLogin(provider);
    navigate("/account");
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link to="/" className="velora-logo">MARKETSPHERE</Link>
        <div className="auth-heading"><span>Member access</span><h1>Welcome back</h1><p>Sign in to manage orders, rewards, saved products and security.</p></div>
        <form className="auth-form" onSubmit={submit}>
          <label>Email or mobile number<input value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" required placeholder="you@example.com or +91..." /></label>
          <label><span>Password <Link to="/forgot-password">Forgot password?</Link></span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" minLength="4" required placeholder="Enter your password" /></label>
          <button className="primary" type="submit">Sign in <ArrowRight size={17} /></button>
        </form>
        <div className="auth-divider"><span>or continue with</span></div>
        <div className="social-login">
          {["Google", "Facebook", "Apple"].map((provider) => <button type="button" onClick={() => useSocial(provider)} key={provider}>{provider[0]}<span>{provider}</span></button>)}
        </div>
        <Link className="secondary auth-otp-link" to="/login/otp">Use a one-time password</Link>
        <p className="auth-switch">New to MarketSphere? <Link to="/register">Create an account</Link></p>
        <p className="auth-trust"><LockKeyhole size={14} /> Encrypted sign-in <i /> <ShieldCheck size={14} /> Privacy protected</p>
      </section>
    </main>
  );
}
