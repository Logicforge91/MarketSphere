import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import { useShop } from "../../context/ShopContext";

export default function AppShell() {
  const { clearNotification, notification } = useShop();

  useEffect(() => {
    if (!notification) return undefined;
    const timeout = window.setTimeout(clearNotification, 2400);
    return () => window.clearTimeout(timeout);
  }, [clearNotification, notification]);

  return (
    <div className="app-shell">
      <Header />
      <Outlet />
      <div className={`shop-toast ${notification ? "visible" : ""}`} role="status" aria-live="polite">{notification}</div>
      <MobileBottomNav />
    </div>
  );
}
