import React, { useEffect, useMemo, useState } from "react";
import { Bell, Camera, Check, ChevronRight, CreditCard, Download, Eye, Globe2, KeyRound, LockKeyhole, LogOut, MapPin, Save, ShieldCheck, Smartphone, Trash2, UserRound, WalletCards, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

function readAddresses() {
  try {
    return JSON.parse(window.localStorage.getItem("marketsphere:addresses")) || [];
  } catch {
    return [];
  }
}

export default function AccountPage() {
  const { changePassword, devices, logout, setTwoFactor, updateProfile, user } = useAuth();
  const { orders, wishlist } = useShop();
  const navigate = useNavigate();
  const customer = user || { name: "Guest shopper", email: "", mobile: "" };
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [profile, setProfile] = useState({
    name: customer.name || "",
    email: customer.email || "",
    mobile: customer.mobile || "",
    dateOfBirth: customer.dateOfBirth || "",
    gender: customer.gender || "Prefer not to say",
    language: customer.language || "English",
    currency: customer.currency || "INR - Indian Rupee",
    avatar: customer.avatar || "",
    communications: customer.communications || { email: true, sms: true, push: true, offers: false },
    privacy: customer.privacy || { personalizedAds: true, activityHistory: true, profileDiscovery: false },
  });
  const addresses = useMemo(readAddresses, []);

  useEffect(() => {
    if (!saved) return undefined;
    const timer = window.setTimeout(() => setSaved(""), 2600);
    return () => window.clearTimeout(timer);
  }, [saved]);

  function saveProfile(event) {
    event.preventDefault();
    if (!updateProfile(profile)) return setSaved("Sign in to save profile changes.");
    setSaved("Profile changes saved.");
  }

  function uploadAvatar(event) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((value) => ({ ...value, avatar: reader.result }));
    reader.readAsDataURL(file);
  }

  function submitPassword(event) {
    event.preventDefault();
    if (password.newPassword !== password.confirm) return setSaved("New passwords do not match.");
    if (!changePassword(password)) return setSaved("Use your current password and at least 8 characters.");
    setShowPassword(false);
    setPassword({ currentPassword: "", newPassword: "", confirm: "" });
    setSaved("Password changed successfully.");
  }

  function exportData() {
    const personalData = { exportedAt: new Date().toISOString(), profile: customer, addresses, devices, orders, wishlist };
    const url = URL.createObjectURL(new Blob([JSON.stringify(personalData, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "MarketSphere-personal-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setSaved("Personal data download created.");
  }

  function signOut() {
    logout();
    navigate("/login");
  }

  const initials = profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <main className="real-page customer-profile-page">
    <header className="profile-heading"><div className="profile-avatar">{profile.avatar ? <img src={profile.avatar} alt="" /> : initials}<label title="Change profile image"><Camera /><input type="file" accept="image/*" onChange={uploadAvatar} /></label></div><div><span>Customer profile</span><h1>{profile.name || "Your account"}</h1><p>{profile.email || "Add your contact information"}{profile.mobile && ` · ${profile.mobile}`}</p></div><button onClick={saveProfile}><Save /> Save changes</button></header>
    {saved && <p className="profile-notice"><Check /> {saved}</p>}

    <div className="profile-layout">
      <aside className="profile-nav">
        <button className={section === "profile" ? "active" : ""} onClick={() => setSection("profile")}><UserRound /> Profile information</button>
        <button className={section === "preferences" ? "active" : ""} onClick={() => setSection("preferences")}><Globe2 /> Preferences</button>
        <button className={section === "privacy" ? "active" : ""} onClick={() => setSection("privacy")}><Eye /> Privacy</button>
        <button className={section === "security" ? "active" : ""} onClick={() => setSection("security")}><ShieldCheck /> Security</button>
        <Link to="/addresses"><MapPin /> Saved addresses <b>{addresses.length}</b></Link>
        <Link to="/payment-methods"><WalletCards /> Payment methods</Link>
        <button onClick={signOut}><LogOut /> Sign out</button>
      </aside>

      <form className="profile-content" onSubmit={saveProfile}>
        {section === "profile" && <section className="profile-settings-section"><header><div><span>Personal details</span><h2>Profile information</h2><p>Keep your contact and identity details current.</p></div></header><div className="profile-field-grid"><label>Full name<input required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label><label>Email address<input required type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label><label>Mobile number<input required type="tel" value={profile.mobile} onChange={(event) => setProfile({ ...profile, mobile: event.target.value })} /></label><label>Date of birth<input type="date" value={profile.dateOfBirth} onChange={(event) => setProfile({ ...profile, dateOfBirth: event.target.value })} /></label><label>Gender<select value={profile.gender} onChange={(event) => setProfile({ ...profile, gender: event.target.value })}><option>Woman</option><option>Man</option><option>Non-binary</option><option>Prefer not to say</option></select></label></div><button className="primary"><Save /> Save profile</button></section>}

        {section === "preferences" && <><section className="profile-settings-section"><header><div><span>Regional settings</span><h2>Language and currency</h2><p>Choose how MarketSphere displays content and prices.</p></div></header><div className="profile-field-grid"><label>Language<select value={profile.language} onChange={(event) => setProfile({ ...profile, language: event.target.value })}><option>English</option><option>Hindi</option><option>Kannada</option><option>Tamil</option><option>Telugu</option><option>Marathi</option></select></label><label>Currency<select value={profile.currency} onChange={(event) => setProfile({ ...profile, currency: event.target.value })}><option>INR - Indian Rupee</option><option>USD - US Dollar</option><option>EUR - Euro</option><option>GBP - British Pound</option></select></label></div></section><section className="profile-settings-section"><header><div><span>Stay informed</span><h2>Communication preferences</h2><p>Control the messages you receive from us.</p></div></header><div className="preference-list">{[["email", "Email updates", "Order confirmations, invoices and account alerts"], ["sms", "SMS updates", "Delivery and payment notifications"], ["push", "Push notifications", "Real-time app and browser updates"], ["offers", "Offers and recommendations", "Personalized promotions and product suggestions"]].map(([key, title, copy]) => <label key={key}><span><strong>{title}</strong><small>{copy}</small></span><input type="checkbox" checked={profile.communications[key]} onChange={(event) => setProfile({ ...profile, communications: { ...profile.communications, [key]: event.target.checked } })} /></label>)}</div></section><button className="primary"><Save /> Save preferences</button></>}

        {section === "privacy" && <section className="profile-settings-section"><header><div><span>Your data</span><h2>Privacy settings</h2><p>Decide how your activity is used across MarketSphere.</p></div></header><div className="preference-list">{[["personalizedAds", "Personalized shopping", "Use browsing and purchase activity for recommendations"], ["activityHistory", "Activity history", "Save searches and recently viewed products"], ["profileDiscovery", "Profile discovery", "Allow shared wishlists to display your profile name"]].map(([key, title, copy]) => <label key={key}><span><strong>{title}</strong><small>{copy}</small></span><input type="checkbox" checked={profile.privacy[key]} onChange={(event) => setProfile({ ...profile, privacy: { ...profile.privacy, [key]: event.target.checked } })} /></label>)}</div><div className="data-actions"><button type="button" onClick={exportData}><Download /> Download personal data</button><Link to="/delete-account"><Trash2 /> Delete account <ChevronRight /></Link></div><button className="primary"><Save /> Save privacy settings</button></section>}

        {section === "security" && <section className="profile-settings-section"><header><div><span>Account protection</span><h2>Security</h2><p>Review your password, two-factor authentication and signed-in devices.</p></div></header><div className="profile-security-list"><article><KeyRound /><div><strong>Password</strong><span>{customer.passwordChangedAt ? `Changed ${new Date(customer.passwordChangedAt).toLocaleDateString("en-IN")}` : "Set a strong, unique password"}</span></div><button type="button" onClick={() => setShowPassword(true)}>Change</button></article><article><LockKeyhole /><div><strong>Two-factor authentication</strong><span>Add an extra verification step when signing in</span></div><label className="switch"><input type="checkbox" checked={Boolean(customer.twoFactorEnabled)} onChange={(event) => { setTwoFactor(event.target.checked); setSaved(`Two-factor authentication ${event.target.checked ? "enabled" : "disabled"}.`); }} /><i /></label></article><Link to="/sessions"><Smartphone /><div><strong>Manage devices</strong><span>{devices.length} signed-in {devices.length === 1 ? "device" : "devices"}</span></div><ChevronRight /></Link><Link to="/payment-methods"><CreditCard /><div><strong>Saved payment methods</strong><span>Review protected cards and UPI IDs</span></div><ChevronRight /></Link></div></section>}
      </form>
    </div>

    {showPassword && <div className="profile-modal-backdrop" onMouseDown={() => setShowPassword(false)}><form className="password-modal" onSubmit={submitPassword} onMouseDown={(event) => event.stopPropagation()}><header><div><span>Account security</span><h2>Change password</h2></div><button type="button" onClick={() => setShowPassword(false)}><X /></button></header><label>Current password<input required type="password" value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} /></label><label>New password<input required minLength="8" type="password" value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} /></label><label>Confirm new password<input required minLength="8" type="password" value={password.confirm} onChange={(event) => setPassword({ ...password, confirm: event.target.value })} /></label><button className="primary">Update password</button></form></div>}
  </main>;
}
