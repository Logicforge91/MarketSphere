import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronLeft,
  Globe2,
  Languages,
  LoaderCircle,
  LocateFixed,
  MapPin,
  RefreshCw,
  ShoppingBag,
  UserRound,
  Wrench,
} from "lucide-react";
import { appConfig, checkApplicationStatus } from "../../config/appConfig";

const ENTRY_KEY = "marketsphere:entry-preferences";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
];

const regions = [
  { code: "IN", country: "India", currency: "INR", locale: "en-IN" },
  { code: "AE", country: "United Arab Emirates", currency: "AED", locale: "en-AE" },
  { code: "SG", country: "Singapore", currency: "SGD", locale: "en-SG" },
  { code: "GB", country: "United Kingdom", currency: "GBP", locale: "en-GB" },
];

function readPreferences() {
  try {
    return JSON.parse(window.localStorage.getItem(ENTRY_KEY)) || null;
  } catch {
    return null;
  }
}

export default function ApplicationEntry({ children }) {
  const [stage, setStage] = useState("splash");
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState(() => readPreferences() || {
    country: "IN",
    currency: "INR",
    language: "en",
    location: null,
    locationPermission: "prompt",
    notificationPermission: typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  });

  useEffect(() => {
    let active = true;
    const splash = window.setTimeout(async () => {
      if (!active) return;
      setStage("checking");
      try {
        const policy = await checkApplicationStatus();
        if (!active) return;
        if (policy.maintenance.enabled) setStage("maintenance");
        else if (policy.forceUpdate) setStage("update");
        else if (readPreferences()?.completed) setStage("ready");
        else setStage("onboarding");
      } catch {
        if (active) setStage(readPreferences()?.completed ? "ready" : "onboarding");
      }
    }, 850);

    return () => {
      active = false;
      window.clearTimeout(splash);
    };
  }, []);

  const selectedRegion = useMemo(() => regions.find((region) => region.code === preferences.country), [preferences.country]);

  function selectRegion(country) {
    const region = regions.find((item) => item.code === country);
    setPreferences((current) => ({ ...current, country, currency: region.currency }));
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setPreferences((current) => ({ ...current, locationPermission: "unsupported" }));
      return;
    }

    setPreferences((current) => ({ ...current, locationPermission: "requesting" }));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setPreferences((current) => ({
        ...current,
        location: { latitude: coords.latitude, longitude: coords.longitude },
        locationPermission: "granted",
      })),
      () => setPreferences((current) => ({ ...current, locationPermission: "denied" })),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 8000 },
    );
  }

  async function requestNotifications() {
    if (typeof Notification === "undefined") {
      setPreferences((current) => ({ ...current, notificationPermission: "unsupported" }));
      return;
    }
    const permission = await Notification.requestPermission();
    setPreferences((current) => ({ ...current, notificationPermission: permission }));
  }

  function enterAsGuest() {
    const completed = {
      ...preferences,
      completed: true,
      locale: selectedRegion.locale,
      mode: "guest",
      version: appConfig.currentVersion,
    };
    window.localStorage.setItem(ENTRY_KEY, JSON.stringify(completed));
    document.documentElement.lang = completed.language;
    setPreferences(completed);
    setStage("ready");
  }

  if (stage === "ready") return children;
  if (stage === "splash") return <SplashScreen />;
  if (stage === "checking") return <CheckingScreen />;
  if (stage === "maintenance") return <MaintenanceScreen />;
  if (stage === "update") return <ForceUpdateScreen />;

  return (
    <main className="entry-shell">
      <section className="entry-panel">
        <header className="entry-header">
          <div className="entry-brand"><span>M</span><div><strong>MARKETSPHERE</strong><small>Elevate everyday</small></div></div>
          <div className="entry-progress" aria-label={`Setup step ${step + 1} of 3`}>{[0, 1, 2].map((item) => <i className={item <= step ? "active" : ""} key={item} />)}</div>
        </header>

        {step === 0 && <LanguageStep value={preferences.language} onChange={(language) => setPreferences((current) => ({ ...current, language }))} />}
        {step === 1 && <RegionStep value={preferences.country} onChange={selectRegion} locationPermission={preferences.locationPermission} onLocation={requestLocation} />}
        {step === 2 && <PermissionStep notificationPermission={preferences.notificationPermission} locationPermission={preferences.locationPermission} onNotifications={requestNotifications} onLocation={requestLocation} />}

        <footer className="entry-actions">
          <button className="entry-back" type="button" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ChevronLeft size={17} /> Back</button>
          {step < 2
            ? <button className="entry-primary" type="button" onClick={() => setStep((current) => current + 1)}>Continue <ArrowRight size={17} /></button>
            : <button className="entry-primary" type="button" onClick={enterAsGuest}><UserRound size={17} /> Continue as guest</button>}
        </footer>
      </section>
      <aside className="entry-aside"><div><span>Shop with confidence</span><h1>Everything you love, in one sphere.</h1><p>Discover fashion, beauty, and lifestyle products personalized to your language and location.</p></div><ShoppingBag aria-hidden="true" /></aside>
    </main>
  );
}

function SplashScreen() {
  return <main className="splash-screen"><div className="splash-mark">M</div><h1>MARKETSPHERE</h1><p>Elevate everyday</p><i /></main>;
}

function CheckingScreen() {
  return <main className="entry-status"><LoaderCircle className="spin" /><span>Preparing your experience</span><small>Version {appConfig.currentVersion}</small></main>;
}

function MaintenanceScreen() {
  return <main className="entry-status"><div className="status-icon"><Wrench /></div><h1>We’ll be right back</h1><p>{appConfig.maintenance.message}</p><small>Estimated return in {appConfig.maintenance.retryAfterMinutes} minutes</small><button onClick={() => window.location.reload()}><RefreshCw size={16} /> Check again</button></main>;
}

function ForceUpdateScreen() {
  return <main className="entry-status"><div className="status-icon"><RefreshCw /></div><h1>Update MarketSphere</h1><p>A newer version is required for improved security and shopping features.</p><small>Required version {appConfig.minimumVersion}</small><a href={appConfig.updateUrl}>Update now <ArrowRight size={16} /></a></main>;
}

function LanguageStep({ value, onChange }) {
  return <div className="entry-step"><div className="entry-step-icon"><Languages /></div><span>Personalize your experience</span><h1>Choose your language</h1><p>You can change this anytime from account settings.</p><div className="language-grid">{languages.map((language) => <button className={value === language.code ? "selected" : ""} onClick={() => onChange(language.code)} key={language.code}><div><strong>{language.native}</strong><small>{language.label}</small></div>{value === language.code && <Check size={17} />}</button>)}</div></div>;
}

function RegionStep({ value, onChange, locationPermission, onLocation }) {
  return <div className="entry-step"><div className="entry-step-icon"><Globe2 /></div><span>Local shopping</span><h1>Select country and region</h1><p>We’ll show local currency, availability, delivery, and offers.</p><div className="region-list">{regions.map((region) => <button className={value === region.code ? "selected" : ""} onClick={() => onChange(region.code)} key={region.code}><MapPin size={17} /><div><strong>{region.country}</strong><small>{region.currency}</small></div>{value === region.code && <Check size={17} />}</button>)}</div><button className="permission-inline" onClick={onLocation}><LocateFixed size={17} /> {locationPermission === "granted" ? "Location detected" : locationPermission === "requesting" ? "Detecting location..." : "Use my current location"}</button></div>;
}

function PermissionStep({ notificationPermission, locationPermission, onNotifications, onLocation }) {
  return <div className="entry-step"><div className="entry-step-icon"><Bell /></div><span>Stay informed</span><h1>Choose your permissions</h1><p>Permissions are optional and can be changed in your browser settings.</p><div className="permission-list"><article><div className="permission-icon"><LocateFixed /></div><div><strong>Location</strong><span>Improve delivery estimates and nearby availability.</span></div><button onClick={onLocation} disabled={locationPermission === "granted" || locationPermission === "requesting"}>{permissionLabel(locationPermission)}</button></article><article><div className="permission-icon"><Bell /></div><div><strong>Notifications</strong><span>Receive order updates, price drops, and offers.</span></div><button onClick={onNotifications} disabled={notificationPermission === "granted"}>{permissionLabel(notificationPermission)}</button></article></div><div className="guest-note"><UserRound /><div><strong>Guest access included</strong><span>Browse and shop now. Create an account later to sync across devices.</span></div></div></div>;
}

function permissionLabel(status) {
  if (status === "granted") return "Enabled";
  if (status === "denied") return "Blocked";
  if (status === "requesting") return "Waiting";
  if (status === "unsupported") return "Unavailable";
  return "Allow";
}
