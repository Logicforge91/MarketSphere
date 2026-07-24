import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";

const lazyPage = (loader, name = "default") => lazy(() => loader().then((module) => ({ default: module[name] })));

const HomePage = lazyPage(() => import("./pages/HomePage.jsx"));
const ListingPage = lazyPage(() => import("./pages/ListingPage.jsx"));
const CategoryPage = lazyPage(() => import("./pages/CategoryPage.jsx"));
const SearchPage = lazyPage(() => import("./pages/SearchPage.jsx"));
const ProductPage = lazyPage(() => import("./pages/ProductPage.jsx"));
const CartPage = lazyPage(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazyPage(() => import("./pages/CheckoutPage.jsx"));
const OrdersPage = lazyPage(() => import("./pages/OrdersPage.jsx"));
const TrackOrderPage = lazyPage(() => import("./pages/OrderTrackingPage.jsx"));
const ReturnsPage = lazyPage(() => import("./pages/ReturnsPage.jsx"));
const NotificationsPage = lazyPage(() => import("./pages/NotificationsPage.jsx"));
const SupportPage = lazyPage(() => import("./pages/SupportPage.jsx"));
const ChatPage = lazyPage(() => import("./pages/ChatPage.jsx"));
const RewardsPage = lazyPage(() => import("./pages/RewardsPage.jsx"));
const ReferralsPage = lazyPage(() => import("./pages/ReferralsPage.jsx"));
const WalletPage = lazyPage(() => import("./pages/WalletPage.jsx"));
const GiftCardsPage = lazyPage(() => import("./pages/GiftCardsPage.jsx"));
const MembershipPage = lazyPage(() => import("./pages/MembershipPage.jsx"));
const RecentlyViewedPage = lazyPage(() => import("./pages/RecentlyViewedPage.jsx"));
const RecommendationsPage = lazyPage(() => import("./pages/RecommendationsPage.jsx"));
const contentPages = () => import("./pages/ContentPages.jsx");
const ContentHubPage = lazyPage(contentPages, "ContentHubPage");
const GuidesPage = lazyPage(contentPages, "GuidesPage");
const VideoContentPage = lazyPage(contentPages, "VideoContentPage");
const BrandStoriesPage = lazyPage(contentPages, "BrandStoriesPage");
const OfferPages = lazyPage(contentPages, "OfferPages");
const CampaignLandingPage = lazyPage(contentPages, "CampaignLandingPage");
const WishlistPage = lazyPage(() => import("./pages/WishlistPage.jsx"));
const AuthPage = lazyPage(() => import("./pages/AuthPage.jsx"));
const AccountPage = lazyPage(() => import("./pages/AccountPage.jsx"));
const sellerPages = () => import("./pages/SellerPages.jsx");
const StoreProfilePage = lazyPage(sellerPages, "StoreProfilePage");
const SellerComparisonPage = lazyPage(sellerPages, "SellerComparisonPage");
const authenticationPages = () => import("./pages/AuthenticationPages.jsx");
const RegisterPage = lazyPage(authenticationPages, "RegisterPage");
const OtpLoginPage = lazyPage(authenticationPages, "OtpLoginPage");
const ForgotPasswordPage = lazyPage(authenticationPages, "ForgotPasswordPage");
const ResetPasswordPage = lazyPage(authenticationPages, "ResetPasswordPage");
const VerificationPage = lazyPage(authenticationPages, "VerificationPage");
const TwoFactorPage = lazyPage(authenticationPages, "TwoFactorPage");
const SessionManagementPage = lazyPage(authenticationPages, "SessionManagementPage");
const DeleteAccountPage = lazyPage(authenticationPages, "DeleteAccountPage");

const ComparePage = lazyPage(() => import("./pages/ComparePage.jsx"));

const customerPages = () => import("./pages/CustomerPages.jsx");
const AddressBookPage = lazyPage(customerPages, "AddressBookPage");
const PaymentMethodsPage = lazyPage(customerPages, "PaymentMethodsPage");
const OrderSuccessPage = lazyPage(customerPages, "OrderSuccessPage");
const FaqPage = lazyPage(customerPages, "FaqPage");
const ContactPage = lazyPage(customerPages, "ContactPage");
const BlogPage = lazyPage(customerPages, "BlogPage");
const BrandsPage = lazyPage(customerPages, "BrandsPage");
const AboutPage = lazyPage(customerPages, "AboutPage");
const ShippingPage = lazyPage(customerPages, "ShippingPage");
const PrivacyPage = lazyPage(customerPages, "PrivacyPage");
const TermsPage = lazyPage(customerPages, "TermsPage");
const RefundPolicyPage = lazyPage(customerPages, "RefundPolicyPage");
const ReturnPolicyPage = lazyPage(customerPages, "ReturnPolicyPage");
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
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<Navigate to="/checkout" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login/otp" element={<OtpLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerificationPage channel="email" />} />
          <Route path="/verify-mobile" element={<VerificationPage channel="mobile" />} />
          <Route path="/two-factor" element={<TwoFactorPage />} />
          <Route path="/sessions" element={<SessionManagementPage />} />
          <Route path="/delete-account" element={<DeleteAccountPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/store/:slug" element={<StoreProfilePage />} />
          <Route path="/sellers/compare" element={<SellerComparisonPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/gift-cards" element={<GiftCardsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/content" element={<ContentHubPage />} />
          <Route path="/guides/:type" element={<GuidesPage />} />
          <Route path="/videos" element={<VideoContentPage />} />
          <Route path="/brand-stories" element={<BrandStoriesPage />} />
          <Route path="/offers" element={<OfferPages />} />
          <Route path="/collections/:slug" element={<CampaignLandingPage />} />
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
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
