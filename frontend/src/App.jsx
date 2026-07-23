import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";

const lazyPage = (loader, name = "default") => lazy(() => loader().then((module) => ({ default: module[name] })));

const HomePage = lazyPage(() => import("./pages/HomePage.jsx"));
const ListingPage = lazyPage(() => import("./pages/ListingPage.jsx"));
const SearchPage = lazyPage(() => import("./pages/SearchPage.jsx"));
const ProductPage = lazyPage(() => import("./pages/ProductPage.jsx"));
const CartPage = lazyPage(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazyPage(() => import("./pages/CheckoutPage.jsx"));
const OrdersPage = lazyPage(() => import("./pages/OrdersPage.jsx"));
const WishlistPage = lazyPage(() => import("./pages/WishlistPage.jsx"));
const AuthPage = lazyPage(() => import("./pages/AuthPage.jsx"));
const AccountPage = lazyPage(() => import("./pages/AccountPage.jsx"));

const utilityPages = () => import("./pages/UtilityPages.jsx");
const NotificationsPage = lazyPage(utilityPages, "NotificationsPage");
const WalletPage = lazyPage(utilityPages, "WalletPage");
const RewardsPage = lazyPage(utilityPages, "RewardsPage");
const ReferralsPage = lazyPage(utilityPages, "ReferralsPage");
const SupportPage = lazyPage(utilityPages, "SupportPage");
const ReturnsPage = lazyPage(utilityPages, "ReturnsPage");
const ComparePage = lazyPage(utilityPages, "ComparePage");
const RecentlyViewedPage = lazyPage(utilityPages, "RecentlyViewedPage");

const customerPages = () => import("./pages/CustomerPages.jsx");
const AddressBookPage = lazyPage(customerPages, "AddressBookPage");
const PaymentMethodsPage = lazyPage(customerPages, "PaymentMethodsPage");
const TrackOrderPage = lazyPage(customerPages, "TrackOrderPage");
const OrderSuccessPage = lazyPage(customerPages, "OrderSuccessPage");
const FaqPage = lazyPage(customerPages, "FaqPage");
const ContactPage = lazyPage(customerPages, "ContactPage");
const BlogPage = lazyPage(customerPages, "BlogPage");
const BrandsPage = lazyPage(customerPages, "BrandsPage");
const AboutPage = lazyPage(customerPages, "AboutPage");
const ShippingPage = lazyPage(customerPages, "ShippingPage");
const PrivacyPage = lazyPage(customerPages, "PrivacyPage");
const TermsPage = lazyPage(customerPages, "TermsPage");
const CareersPage = lazyPage(customerPages, "CareersPage");
const NotFoundPage = lazyPage(customerPages, "NotFoundPage");

function RouteFallback() {
  return <div className="route-loading" role="status"><i /><span>Loading MarketSphere</span></div>;
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ListingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<Navigate to="/checkout" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
          <Route path="/addresses" element={<AddressBookPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
