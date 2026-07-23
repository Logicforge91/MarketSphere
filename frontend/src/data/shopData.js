import {
  BadgeCheck,
  Bike,
  Gamepad2,
  Gem,
  Headphones,
  PackageCheck,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Trophy,
  Watch,
} from "lucide-react";

export const categories = [
  { name: "Women", icon: Shirt, accent: "#f2efff", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80" },
  { name: "Men", icon: Shirt, accent: "#eef3ff", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=400&q=80" },
  { name: "Bags", icon: ShoppingBag, accent: "#fff0f3", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=400&q=80" },
  { name: "Shoes", icon: Trophy, accent: "#f4f2ef", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80" },
  { name: "Accessories", icon: Watch, accent: "#f5f0ff", image: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=400&q=80" },
  { name: "Beauty", icon: Sparkles, accent: "#fff0f4", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80" },
  { name: "Jewellery", icon: Gem, accent: "#fff7df" },
  { name: "New In", icon: BadgeCheck, accent: "#eff8f4" },
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
  { name: "Floral Midi Dress", price: 4999, oldPrice: 6999, rating: 4.8, discount: "-28%", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=85" },
  { name: "Chain Shoulder Bag", price: 6999, oldPrice: 8499, rating: 4.7, discount: "-18%", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=85" },
  { name: "White Sneakers", price: 4699, oldPrice: 5999, rating: 4.6, discount: "-22%", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=85" },
  { name: "Classic Watch", price: 8999, oldPrice: 10999, rating: 4.9, discount: "-18%", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=85" },
  { name: "Linen Day Dress", price: 4499, oldPrice: 5999, rating: 4.5, discount: "-25%", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=85" },
  { name: "Denim Jacket", price: 4099, oldPrice: 5499, rating: 4.7, discount: "-25%", image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=600&q=85" },
];

export const trending = [
  { name: "Pleated Dress", price: 4899, oldPrice: 6299, rating: 4.7, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=85" },
  { name: "Denim Jacket", price: 4099, oldPrice: 5499, rating: 4.6, image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=600&q=85" },
  { name: "Leather Tote Bag", price: 7599, oldPrice: 8999, rating: 4.8, image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=85" },
  { name: "Running Shoes", price: 4499, oldPrice: 5999, rating: 4.5, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=85" },
  { name: "Signature Perfume", price: 3299, oldPrice: 3999, rating: 4.6, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=85" },
  { name: "Gold Earrings", price: 2199, oldPrice: 2999, rating: 4.8, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=85" },
];

export const productDetail = {
  name: "Floral Maxi Dress",
  price: 4999,
  oldPrice: 6999,
  rating: 4.8,
  reviews: 2534,
  sold: "2K+",
  image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
  swatches: ["#5635d9", "#20212a", "#e98798", "#d9d8d4"],
  details: ["Soft floral georgette", "Relaxed maxi silhouette", "Concealed side zip", "Hand wash recommended"],
};

export const cartItems = [
  { name: "Floral Maxi Dress", price: 4999, qty: 1, image: productDetail.image },
  { name: "Chain Shoulder Bag", price: 6999, qty: 1, image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=500&q=85" },
  { name: "White Sneakers", price: 4699, qty: 1, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=85" },
];

export const benefits = [
  { label: "Free Delivery", detail: "2-4 Days", icon: PackageCheck },
  { label: "Easy Returns", detail: "7 Day Return", icon: BadgeCheck },
  { label: "Secure Payment", detail: "100% Protected", icon: ShoppingBag },
  { label: "24/7 Support", detail: "We're here to help", icon: Headphones },
];

export const brands = ["ZARA", "MANGO", "NIKE", "ALDO", "COACH", "H&M", "GUESS", "PUMA"];

export const menuIcons = { Bike, Gamepad2, Smartphone, Sparkles, Watch };

export const mobileProducts = [
  { name: "Printed Midi Dress", price: 4699, oldPrice: 5999, rating: 4.8, discount: "-21%", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=85" },
  { name: "Blazer Co-ord", price: 6099, oldPrice: 7999, rating: 4.7, discount: "-24%", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=85" },
  { name: "Ruffled Top", price: 3499, oldPrice: 4499, rating: 4.6, discount: "-22%", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=85" },
  { name: "Wide Leg Pants", price: 4299, oldPrice: 5499, rating: 4.5, discount: "-22%", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=85" },
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
  "5% unlimited cashback on MarketSphere Axis Card",
  "No Cost EMI from Rs. 1,999/month",
  "Extra Rs. 500 off on UPI payments",
];
