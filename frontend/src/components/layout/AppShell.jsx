import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import { useShop } from "../../context/ShopContext";
import AccessibilityMenu from "../common/AccessibilityMenu";
import CookieConsent from "../common/CookieConsent";
import NetworkStatus from "../common/NetworkStatus";
import SiteFooter from "./SiteFooter";

export default function AppShell() {
  const { clearNotification, notification } = useShop();
  const location = useLocation();
  const routeTitle = location.pathname === "/" ? "Home" : location.pathname.split("/").filter(Boolean).join(" ");

  useEffect(() => {
    if (!notification) return undefined;
    const timeout = window.setTimeout(clearNotification, 2400);
    return () => window.clearTimeout(timeout);
  }, [clearNotification, notification]);

  useEffect(() => {
    const page = document.getElementById("main-content");
    page?.focus({ preventScroll: true });
  }, [location.pathname, location.search]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header />
      <NetworkStatus />
      <div id="main-content" className="route-content" tabIndex="-1"><Outlet /></div>
      <SiteFooter />
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">MarketSphere {routeTitle} page loaded</div>
      <div className={`shop-toast ${notification ? "visible" : ""}`} role="status" aria-live="polite">{notification}</div>
      <AccessibilityMenu />
      <CookieConsent />
      <MobileBottomNav />
    </div>
  );
}
