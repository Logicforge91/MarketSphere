import React from "react";
import { CloudOff, Gauge, Wifi } from "lucide-react";
import { usePerformance } from "../../context/PerformanceContext";

export default function NetworkStatus() {
  const { effectiveType, lowNetworkMode, online, setLowNetworkMode } = usePerformance();
  return <div className={`network-status ${!online ? "offline" : ""}`} role="status">
    {!online ? <CloudOff /> : lowNetworkMode ? <Gauge /> : <Wifi />}
    <span>{!online ? "Offline · Bag and wishlist remain available" : lowNetworkMode ? `Data saver · ${effectiveType}` : "Online"}</span>
    {online && <button type="button" aria-pressed={lowNetworkMode} onClick={() => setLowNetworkMode(!lowNetworkMode)}>{lowNetworkMode ? "Full quality" : "Data saver"}</button>}
  </div>;
}
