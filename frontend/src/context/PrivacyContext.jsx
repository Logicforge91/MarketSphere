import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getStored, setStored } from "../utils/storage";

const KEY = "marketsphere:privacy-consent";
const defaults = {
  decided: false,
  necessary: true,
  analytics: false,
  personalization: false,
  marketing: false,
  fraudProtection: true,
};
const PrivacyContext = createContext(null);

export function PrivacyProvider({ children }) {
  const [preferences, setPreferences] = useState(() => getStored(KEY, defaults));
  useEffect(() => setStored(KEY, preferences), [preferences]);
  const value = useMemo(() => ({
    preferences,
    save: (updates) => setPreferences((current) => ({ ...current, ...updates, necessary: true, decided: true })),
    acceptAll: () => setPreferences({ ...defaults, decided: true, analytics: true, personalization: true, marketing: true }),
    rejectOptional: () => setPreferences({ ...defaults, decided: true }),
  }), [preferences]);
  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>;
}

export function usePrivacy() {
  const value = useContext(PrivacyContext);
  if (!value) throw new Error("usePrivacy must be used within PrivacyProvider");
  return value;
}
