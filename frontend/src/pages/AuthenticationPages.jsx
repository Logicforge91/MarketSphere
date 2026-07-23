import React, { useState } from "react";
import { AlertTriangle, ArrowLeft, Check, Laptop, LockKeyhole, MailCheck, MonitorSmartphone, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthShell({ eyebrow, title, description, children, back = "/login" }) {
  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel-wide">
        <Link className="auth-back" to={back}><ArrowLeft size={16} /> Back</Link>
        <Link to="/" className="velora-logo">MARKETSPHERE</Link>
        <div className="auth-heading"><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
        {children}
        <p className="auth-trust"><LockKeyhole size={14} /> Secure account service <i /> <ShieldCheck size={14} /> Data protected</p>
      </section>
    </main>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", consent: false });
  const { register } = useAuth();
  const navigate = useNavigate();
  function submit(event) {
    event.preventDefault();
    register(form);
    navigate("/verify-email");
  }
  return <AuthShell eyebrow="Join MarketSphere" title="Create your account" description="One account for faster checkout, protected payments and personal recommendations.">
    <form className="auth-form" onSubmit={submit}>
      <label>Full name<input autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <div className="auth-field-row"><label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Mobile number<input type="tel" autoComplete="tel" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></label></div>
      <label>Password<input type="password" autoComplete="new-password" minLength="8" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><small>Use at least 8 characters.</small></label>
      <label className="auth-check"><input type="checkbox" required checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} /><span>I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</span></label>
      <button className="primary" type="submit">Create account</button>
    </form>
    <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
  </AuthShell>;
}

export function OtpLoginPage() {
  const [destination, setDestination] = useState("");
  const { requestOtp } = useAuth();
  const navigate = useNavigate();
  function submit(event) {
    event.preventDefault();
    requestOtp(destination, "login");
    navigate("/verify-mobile");
  }
  return <AuthShell eyebrow="Password-free" title="Sign in with OTP" description="We will send a six-digit security code to your email or mobile."><form className="auth-form" onSubmit={submit}><label>Email or mobile number<input required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="you@example.com or +91..." /></label><button className="primary" type="submit">Send secure code</button></form></AuthShell>;
}

export function ForgotPasswordPage() {
  const [destination, setDestination] = useState("");
  const [sent, setSent] = useState(false);
  return <AuthShell eyebrow="Account recovery" title="Reset your password" description="Enter your registered email or mobile number."><form className="auth-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><label>Email or mobile number<input required value={destination} onChange={(e) => setDestination(e.target.value)} /></label>{sent && <div className="auth-notice success"><MailCheck size={18} /><span>Recovery instructions sent. <Link to="/reset-password">Continue to reset</Link></span></div>}<button className="primary" type="submit">Send reset link</button></form></AuthShell>;
}

export function ResetPasswordPage() {
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const navigate = useNavigate();
  const valid = passwords.password.length >= 8 && passwords.password === passwords.confirm;
  return <AuthShell eyebrow="New credentials" title="Choose a new password" description="Create a strong password you have not used before."><form className="auth-form" onSubmit={(e) => { e.preventDefault(); if (valid) navigate("/login"); }}><label>New password<input type="password" minLength="8" required value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} /></label><label>Confirm password<input type="password" minLength="8" required value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} /></label>{passwords.confirm && !valid && <small className="auth-error">Passwords must match and contain at least 8 characters.</small>}<button className="primary" disabled={!valid} type="submit">Update password</button></form></AuthShell>;
}

export function VerificationPage({ channel = "email" }) {
  const { challenge, requestOtp, verifyChallenge } = useAuth();
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const destination = challenge?.destination || (channel === "email" ? "your email" : "your mobile");
  function submit(event) {
    event.preventDefault();
    if (verifyChallenge(code)) navigate("/account");
  }
  return <AuthShell eyebrow="Identity check" title={`Verify your ${channel}`} description={`Enter the six-digit code sent to ${destination}.`}><form className="auth-form" onSubmit={submit}><label>Verification code<input className="otp-input" inputMode="numeric" maxLength="6" pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" /></label><p className="auth-demo">Demo mode: enter any six digits.</p><button className="primary" type="submit">Verify and continue</button><button className="text-button" type="button" onClick={() => requestOtp(destination, challenge?.purpose || "login")}>Resend code</button></form></AuthShell>;
}

function SecurePage({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export function TwoFactorPage() {
  const { setTwoFactor, user } = useAuth();
  const [enabled, setEnabled] = useState(Boolean(user?.twoFactorEnabled));
  function toggle() {
    setEnabled((value) => { setTwoFactor(!value); return !value; });
  }
  return <SecurePage><main className="security-page real-page"><section className="security-heading"><ShieldCheck /><div><span>Account security</span><h1>Two-factor authentication</h1><p>Add an extra check when a new device signs in.</p></div></section><section className="security-card"><div className="security-setting"><span className="security-icon"><Smartphone /></span><div><strong>Authenticator and OTP verification</strong><p>{enabled ? "Your account has additional sign-in protection." : "Protect your account even if your password is exposed."}</p></div><button className={`toggle-control ${enabled ? "on" : ""}`} onClick={toggle} role="switch" aria-checked={enabled}><i /></button></div>{enabled && <div className="auth-notice success"><Check size={18} /> Two-factor authentication is active.</div>}</section></main></SecurePage>;
}

export function SessionManagementPage() {
  const { devices, logoutOtherDevices, revokeDevice } = useAuth();
  return <SecurePage><main className="security-page real-page"><section className="security-heading"><MonitorSmartphone /><div><span>Security centre</span><h1>Sessions and devices</h1><p>Review where your MarketSphere account is currently signed in.</p></div><button className="secondary" onClick={logoutOtherDevices}>Sign out other devices</button></section><section className="device-list">{devices.length ? devices.map((device) => <article key={device.id}><span className="security-icon">{device.platform.toLowerCase().includes("win") ? <Laptop /> : <Smartphone />}</span><div><strong>{device.browser} on {device.platform}</strong><p>{device.location} · {new Date(device.lastActive).toLocaleString()}</p>{device.current && <small>Current session</small>}</div>{!device.current && <button className="text-button danger" onClick={() => revokeDevice(device.id)}>Revoke</button>}</article>) : <p>No active devices.</p>}</section></main></SecurePage>;
}

export function DeleteAccountPage() {
  const { deleteAccount } = useAuth();
  const [confirmation, setConfirmation] = useState("");
  const navigate = useNavigate();
  function remove(event) {
    event.preventDefault();
    if (confirmation === "DELETE") { deleteAccount(); navigate("/"); }
  }
  return <SecurePage><main className="security-page real-page"><section className="security-heading danger-heading"><AlertTriangle /><div><span>Permanent action</span><h1>Delete your account</h1><p>This removes your local profile, sessions, orders, bag and saved products.</p></div></section><section className="security-card delete-card"><Trash2 /><h2>Before you continue</h2><p>Account deletion cannot be undone. Download any invoices or details you need first.</p><form className="auth-form" onSubmit={remove}><label>Type DELETE to confirm<input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /></label><button className="danger-button" disabled={confirmation !== "DELETE"} type="submit">Permanently delete account</button></form></section></main></SecurePage>;
}
