import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getStored, setStored } from "../utils/storage";

const STORAGE_KEY = "marketsphere:accessibility";
const defaults = { textScale: 1, highContrast: false, reduceMotion: false };
const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(() => getStored(STORAGE_KEY, defaults));

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--a11y-text-scale", preferences.textScale);
    root.dataset.contrast = preferences.highContrast ? "high" : "standard";
    root.dataset.motion = preferences.reduceMotion ? "reduced" : "standard";
    setStored(STORAGE_KEY, preferences);
  }, [preferences]);

  const value = useMemo(() => ({
    ...preferences,
    setTextScale: (textScale) => setPreferences((current) => ({ ...current, textScale })),
    toggleHighContrast: () => setPreferences((current) => ({ ...current, highContrast: !current.highContrast })),
    toggleReduceMotion: () => setPreferences((current) => ({ ...current, reduceMotion: !current.reduceMotion })),
    reset: () => setPreferences(defaults),
  }), [preferences]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return context;
}
