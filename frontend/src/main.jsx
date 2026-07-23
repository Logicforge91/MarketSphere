import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ShopProvider } from "./context/ShopContext.jsx";
import AppErrorBoundary from "./components/common/AppErrorBoundary.jsx";
import ApplicationEntry from "./components/entry/ApplicationEntry.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles.css";
import "./theme/market-sphere-theme.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ShopProvider>
            <ApplicationEntry>
              <App />
            </ApplicationEntry>
          </ShopProvider>
        </AuthProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
);
