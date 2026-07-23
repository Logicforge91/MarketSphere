import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ShopProvider } from "./context/ShopContext.jsx";
import AppErrorBoundary from "./components/common/AppErrorBoundary.jsx";
import "./styles.css";
import "./theme/market-sphere-theme.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <ShopProvider>
          <App />
        </ShopProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
);
