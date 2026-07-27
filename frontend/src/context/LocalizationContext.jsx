import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { languages, regions, translations } from "../data/localization";
import { getStored, setStored } from "../utils/storage";

const KEY = "marketsphere:entry-preferences";
const fallback = { completed: true, country: "IN", currency: "INR", language: "en", locale: "en-IN" };
const LocalizationContext = createContext(null);

export function LocalizationProvider({ children }) {
  const [preferences, setPreferences] = useState(() => getStored(KEY, fallback));
  const region = regions[preferences.country] || regions.IN;
  const language = languages.find((item) => item.code === preferences.language) || languages[0];

  const updatePreferences = useCallback((updates) => {
    setPreferences((current) => {
      const country = updates.country || current.country || "IN";
      const nextRegion = regions[country] || regions.IN;
      const next = { ...current, ...updates, country, currency: updates.currency || nextRegion.currency, locale: nextRegion.locale };
      setStored(KEY, next);
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.direction;
    document.documentElement.dataset.country = preferences.country;
  }, [language, preferences.country]);

  const t = useCallback((key) => translations[language.code]?.[key] || translations.en[key] || key, [language.code]);
  const value = useMemo(() => ({ preferences, region, language, languages, regions, t, updatePreferences }), [language, preferences, region, t, updatePreferences]);
  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error("useLocalization must be used inside LocalizationProvider");
  return context;
}
