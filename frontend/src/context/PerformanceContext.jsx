import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getStored, setStored } from "../utils/storage";

const PerformanceContext = createContext(null);
const MODE_KEY = "marketsphere:low-network";

export function PerformanceProvider({ children }) {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const [online, setOnline] = useState(navigator.onLine);
  const [lowNetworkMode, setLowNetworkMode] = useState(() => getStored(MODE_KEY, Boolean(connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || ""))));
  const [effectiveType, setEffectiveType] = useState(connection?.effectiveType || "unknown");

  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    const updateConnection = () => {
      setEffectiveType(connection?.effectiveType || "unknown");
      if (connection?.saveData) setLowNetworkMode(true);
    };
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    connection?.addEventListener?.("change", updateConnection);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      connection?.removeEventListener?.("change", updateConnection);
    };
  }, [connection]);

  useEffect(() => {
    setStored(MODE_KEY, lowNetworkMode);
    document.documentElement.dataset.network = lowNetworkMode ? "low" : "full";
  }, [lowNetworkMode]);

  const value = useMemo(() => ({
    effectiveType,
    lowNetworkMode,
    online,
    setLowNetworkMode,
  }), [effectiveType, lowNetworkMode, online]);

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) throw new Error("usePerformance must be used inside PerformanceProvider");
  return context;
}
