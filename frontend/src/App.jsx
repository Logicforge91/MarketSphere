import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import MobileShowcasePage from "./pages/MobileShowcasePage.jsx";
import DesignSystemPanel from "./components/design/DesignSystemPanel.jsx";

export default function App() {
  return (
    <main>
      <DesignSystemPanel />
      <HomePage />
      <ProductPage />
      <MobileShowcasePage />
    </main>
  );
}
