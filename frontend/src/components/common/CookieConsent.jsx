import React, { useState } from "react";
import { Cookie, X } from "lucide-react";
import { usePrivacy } from "../../context/PrivacyContext";

export default function CookieConsent() {
  const { acceptAll, preferences, rejectOptional, save } = usePrivacy();
  const [details, setDetails] = useState(false);
  if (preferences.decided && !details) return null;
  return <aside className="cookie-consent" aria-labelledby="cookie-title">
    <header><Cookie /><div><strong id="cookie-title">Your privacy choices</strong><span>Necessary storage keeps your bag, security and sign-in working.</span></div>{preferences.decided && <button aria-label="Close cookie preferences" onClick={() => setDetails(false)}><X /></button>}</header>
    {details && <div className="cookie-options">{[["analytics", "Analytics"], ["personalization", "Personalization"], ["marketing", "Marketing"]].map(([key, label]) => <label key={key}><span>{label}</span><input type="checkbox" checked={preferences[key]} onChange={(event) => save({ [key]: event.target.checked })} /></label>)}</div>}
    <footer><button onClick={rejectOptional}>Necessary only</button><button onClick={() => setDetails((value) => !value)}>Customize</button><button className="primary" onClick={acceptAll}>Accept all</button></footer>
  </aside>;
}
