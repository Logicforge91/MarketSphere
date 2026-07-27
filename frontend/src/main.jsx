import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ShopProvider } from "./context/ShopContext.jsx";
import AppErrorBoundary from "./components/common/AppErrorBoundary.jsx";
import ApplicationEntry from "./components/entry/ApplicationEntry.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LocalizationProvider } from "./context/LocalizationContext.jsx";
import { AccessibilityProvider } from "./context/AccessibilityContext.jsx";
import { PrivacyProvider } from "./context/PrivacyContext.jsx";
import { PerformanceProvider } from "./context/PerformanceContext.jsx";
import { registerServiceWorker } from "./utils/registerServiceWorker.js";
import "./styles.css";
import "./theme/market-sphere-theme.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <LocalizationProvider><AccessibilityProvider><PerformanceProvider><PrivacyProvider><AuthProvider><ShopProvider><ApplicationEntry><App /></ApplicationEntry></ShopProvider></AuthProvider></PrivacyProvider></PerformanceProvider></AccessibilityProvider></LocalizationProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
);

registerServiceWorker();
