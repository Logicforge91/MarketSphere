import React, { useState } from "react";
import { AlertTriangle, Check, Cookie, CreditCard, Download, Eye, Fingerprint, History, LockKeyhole, MonitorSmartphone, ShieldCheck, Trash2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePrivacy } from "../context/PrivacyContext";

export default function SecurityPrivacyPage() {
  const { devices, isAuthenticated, loginHistory, securityAlert, clearSecurityAlert, user } = useAuth();
  const { preferences, save } = usePrivacy();
  const [notice, setNotice] = useState("");

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  function downloadSecurityData() {
    const data = { exportedAt: new Date().toISOString(), account: user, devices, loginHistory, consent: preferences };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "MarketSphere-security-and-privacy-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Your security and privacy data export is ready.");
  }

  return <main className="real-page security-privacy-page">
    <section className="security-privacy-hero"><ShieldCheck /><div><span>Trust centre</span><h1>Security & privacy</h1><p>Review sign-ins, protected payments, consent, cookies and personal-data controls.</p></div><b><Check /> Protection active</b></section>
    {securityAlert && <div className="security-alert" role="alert"><AlertTriangle /><span><strong>Security alert</strong>{securityAlert}</span><button onClick={clearSecurityAlert}>Dismiss</button></div>}
    <div className="security-overview">
      <article><LockKeyhole /><span><strong>30 minutes</strong>Inactivity timeout</span></article>
      <article><MonitorSmartphone /><span><strong>{devices.length}</strong>Active devices</span></article>
      <article><Fingerprint /><span><strong>{user?.twoFactorEnabled ? "Enabled" : "Optional"}</strong>Two-factor security</span></article>
      <article><CreditCard /><span><strong>Tokenized</strong>Payment credentials</span></article>
    </div>
    <div className="security-privacy-grid">
      <section><header><History /><div><h2>Login history</h2><p>Successful and potentially suspicious account access.</p></div><Link to="/sessions">Manage devices</Link></header><div className="login-history">{loginHistory.length ? loginHistory.map((event) => <article className={event.suspicious ? "suspicious" : ""} key={event.id}><i>{event.suspicious ? <AlertTriangle /> : <Check />}</i><span><strong>{event.browser} on {event.platform}</strong><small>{event.location} · {new Date(event.at).toLocaleString()}</small></span><b>{event.status}</b></article>) : <p>No sign-in events recorded yet.</p>}</div></section>
      <section><header><Cookie /><div><h2>Consent & cookies</h2><p>Necessary cookies always protect sign-in and checkout.</p></div></header><div className="privacy-switches">{[["analytics", "Analytics", "Help improve product performance"], ["personalization", "Personalization", "Tailor products and recommendations"], ["marketing", "Marketing", "Receive relevant campaign measurement"], ["fraudProtection", "Fraud protection", "Check risky sign-ins and transactions"]].map(([key, title, copy]) => <label key={key}><span><strong>{title}</strong><small>{copy}</small></span><input type="checkbox" checked={preferences[key]} disabled={key === "fraudProtection"} onChange={(event) => save({ [key]: event.target.checked })} /></label>)}</div></section>
      <section><header><CreditCard /><div><h2>Payment-token security</h2><p>MarketSphere stores provider tokens, not full card numbers or CVV.</p></div></header><div className="token-card"><span>VISA</span><div><strong>Token ·••• 8F42</strong><small>Card ending 4242 · 3D Secure enabled</small></div><b>Protected</b></div><p className="fraud-note"><ShieldCheck /> Transactions are checked for duplicate payments, unusual value, device mismatch and rapid retry patterns.</p><Link className="security-inline-link" to="/payment-methods">Review saved payment methods</Link></section>
      <section><header><Eye /><div><h2>Personal-data controls</h2><p>Export your information or permanently remove your account.</p></div></header><div className="security-data-actions"><button onClick={downloadSecurityData}><Download /> Download personal data</button><Link to="/delete-account"><Trash2 /> Delete account</Link></div><p>Exports include profile, consent, devices and login history. Payment tokens remain masked.</p></section>
    </div>
    {notice && <p className="security-page-notice" role="status">{notice}</p>}
  </main>;
}
