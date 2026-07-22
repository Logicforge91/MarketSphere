import {
  Baby,
  BadgeCheck,
  Bike,
  BookOpen,
  Car,
  Gamepad2,
  Gem,
  Headphones,
  HeartPulse,
  Home,
  Laptop,
  PackageCheck,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sofa,
  Sparkles,
  Trophy,
  Watch,
} from "lucide-react";

export const categories = [
  { name: "Electronics", icon: Laptop, accent: "#d8e7ff" },
  { name: "Fashion", icon: Shirt, accent: "#fff1c7" },
  { name: "Home & Kitchen", icon: Sofa, accent: "#eee7de" },
  { name: "Beauty", icon: Gem, accent: "#ffe0e9" },
  { name: "Sports", icon: Trophy, accent: "#ffe2c6" },
  { name: "Books", icon: BookOpen, accent: "#f0d8c1" },
  { name: "Toys", icon: Baby, accent: "#ffe7d1" },
  { name: "Automotive", icon: Car, accent: "#e7ecf4" },
  { name: "Health", icon: HeartPulse, accent: "#dff7e9" },
];

export const heroProducts = [
  {
    title: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Smart Watch Series 9",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "iPhone Pro",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80",
  },
];

export const deals = [
  { name: "boAt Airdopes 141", price: 1299, oldPrice: 4490, rating: 4.3, discount: "-71%", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=80" },
  { name: "Noise ColorFit Pro 4", price: 2499, oldPrice: 5999, rating: 4.4, discount: "-58%", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
  { name: "Sony WH-1000XM5", price: 24990, oldPrice: 34990, rating: 4.8, discount: "-29%", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80" },
  { name: "Prestige Electric Cooker", price: 2899, oldPrice: 4299, rating: 4.2, discount: "-33%", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=500&q=80" },
  { name: "Puma Running Shoes", price: 3499, oldPrice: 6999, rating: 4.5, discount: "-50%", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" },
  { name: "Levi's 511 Jeans", price: 1799, oldPrice: 3499, rating: 4.4, discount: "-49%", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80" },
];

export const trending = [
  { name: "MacBook Air", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80" },
  { name: "Galaxy Phone", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80" },
  { name: "Leather Tote", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=500&q=80" },
  { name: "Signature Perfume", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
  { name: "Office Chair", image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=500&q=80" },
  { name: "Air Fryer", image: "https://images.unsplash.com/photo-1604908554027-783db75a4e9d?auto=format&fit=crop&w=500&q=80" },
];

export const productDetail = {
  name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
  price: 24990,
  oldPrice: 34990,
  rating: 4.8,
  reviews: 2534,
  sold: "10K+",
  image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
  swatches: ["#f4f1eb", "#d8d2c7", "#9a9081", "#344054"],
  details: ["Advanced Noise Cancellation", "Up to 30 Hours Battery Life", "Crystal Clear Call Quality", "Touch Sensor Controls"],
};

export const cartItems = [
  { name: "Sony WH-1000XM5", price: 24990, qty: 1, image: productDetail.image },
  { name: "Nike Air Max 270", price: 5999, qty: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80" },
  { name: "Levi's 511 Jeans", price: 1799, qty: 1, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80" },
];

export const benefits = [
  { label: "Free Delivery", detail: "2-4 Days", icon: PackageCheck },
  { label: "Easy Returns", detail: "7 Day Return", icon: BadgeCheck },
  { label: "Secure Payment", detail: "100% Protected", icon: ShoppingBag },
  { label: "24/7 Support", detail: "We're here to help", icon: Headphones },
];

export const brands = ["Apple", "Samsung", "Nike", "Adidas", "Bose", "Philips", "Sony", "Dyson"];

export const menuIcons = { Bike, Gamepad2, Smartphone, Sparkles, Watch };

export const mobileProducts = [
  { name: "iPhone 15", price: 64999, oldPrice: 74999, rating: 4.8, discount: "-10%", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80" },
  { name: "Samsung Galaxy S23", price: 49999, oldPrice: 58999, rating: 4.7, discount: "-16%", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80" },
  { name: "OnePlus 11R 5G", price: 39999, oldPrice: 49999, rating: 4.6, discount: "-20%", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80" },
  { name: "Redmi Note 13 Pro", price: 19999, oldPrice: 25999, rating: 4.5, discount: "-23%", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=300&q=80" },
];

export const shoeProducts = [
  { name: "Nike Air Max 270", price: 5999, oldPrice: 7999, rating: 4.5, discount: "-25%", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80" },
  { name: "Adidas Ultraboost 22", price: 7999, oldPrice: 9999, rating: 4.6, discount: "-20%", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=300&q=80" },
  { name: "Puma Future Rider", price: 3499, oldPrice: 4999, rating: 4.3, discount: "-30%", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=300&q=80" },
];

export const orderTimeline = ["Order Confirmed", "Packed", "Shipped", "Out For Delivery"];

export const orders = [
  { id: "OD1234567890", status: "Delivered", total: 6998, image: mobileProducts[0].image },
  { id: "OD1234567899", status: "Shipped", total: 2499, image: mobileProducts[1].image },
  { id: "OD1234567888", status: "Processing", total: 1299, image: shoeProducts[0].image },
];

export const accountMenu = ["Profile Information", "Manage Addresses", "Payment Methods", "Notification Preferences", "Privacy & Security", "Language", "Currency", "App Theme"];

export const indianOffers = [
  "10% Instant Discount on HDFC Bank Cards",
  "5% Unlimited Cashback on ShopHub Axis Card",
  "No Cost EMI from ₹1,999/month",
  "Extra ₹500 off on UPI payments",
];
