import React, { useState } from "react";
import { Check, CreditCard, Globe2, Languages, MapPin, PackageCheck, RefreshCw, Save, Truck } from "lucide-react";
import { useLocalization } from "../context/LocalizationContext";

const paymentNames = { "saved-card": "Saved cards", card: "Credit and debit cards", upi: "UPI", netbanking: "Net banking", wallet: "MarketSphere Wallet", emi: "EMI", bnpl: "Buy now, pay later", cod: "Cash on delivery" };
const shippingNames = { standard: "Standard delivery", express: "Express delivery", "same-day": "Same-day delivery", scheduled: "Scheduled delivery", pickup: "Store pickup" };

export default function LocalizationPage() {
  const { languages, preferences, regions, updatePreferences } = useLocalization();
  const [draft, setDraft] = useState({ language: preferences.language, country: preferences.country });
  const [message, setMessage] = useState("");
  const selectedRegion = regions[draft.country];

  function save(event) {
    event.preventDefault();
    updatePreferences({ language: draft.language, country: draft.country, currency: selectedRegion.currency });
    setMessage("Regional settings applied across MarketSphere.");
  }

  return <main className="real-page localization-page"><header className="localization-heading"><div><span>Localization</span><h1>Language and region</h1><p>Control translations, currency, product availability, taxes, payment and delivery options.</p></div><Globe2 /></header>{message && <p className="wallet-message"><Check /> {message}</p>}<form onSubmit={save}><section className="locale-setting"><header><Languages /><div><span>Translation support</span><h2>Display language</h2><p>Arabic automatically enables the right-to-left interface.</p></div></header><div className="locale-choice-grid">{languages.map((item) => <label className={draft.language === item.code ? "selected" : ""} key={item.code}><input type="radio" name="language" checked={draft.language === item.code} onChange={() => setDraft({ ...draft, language: item.code })} /><strong>{item.native}</strong><small>{item.label} · {item.direction.toUpperCase()}</small></label>)}</div></section><section className="locale-setting"><header><MapPin /><div><span>Country selection</span><h2>Shopping region</h2><p>Changing country updates the catalog and checkout rules.</p></div></header><div className="locale-choice-grid region">{Object.entries(regions).map(([code, item]) => <label className={draft.country === code ? "selected" : ""} key={code}><input type="radio" name="country" checked={draft.country === code} onChange={() => setDraft({ ...draft, country: code })} /><strong>{item.country}</strong><small>{item.currency} · {item.locale}</small></label>)}</div></section><section className="regional-summary"><article><PackageCheck /><span><small>Regional availability</small><strong>{selectedRegion.availability}% of catalog</strong></span></article><article><RefreshCw /><span><small>Regional pricing</small><strong>{selectedRegion.currency}</strong></span></article><article><Globe2 /><span><small>Regional taxes</small><strong>{Math.round(selectedRegion.taxRate * 100)}% {selectedRegion.taxLabel}</strong></span></article></section><div className="regional-method-grid"><section><header><CreditCard /><h2>Local payment methods</h2></header>{selectedRegion.payments.map((id) => <p key={id}><Check /> {paymentNames[id]}</p>)}</section><section><header><Truck /><h2>Local shipping methods</h2></header>{selectedRegion.shipping.map((id) => <p key={id}><Check /> {shippingNames[id]}</p>)}</section></div><button className="primary locale-save"><Save /> Apply language and region</button></form><aside className="rtl-preview" dir={languages.find((item) => item.code === draft.language)?.direction}><Languages /><span><strong>{languages.find((item) => item.code === draft.language)?.direction === "rtl" ? "RTL interface active" : "Translation-ready interface"}</strong><small>Layout direction and document language are applied globally.</small></span></aside></main>;
}
