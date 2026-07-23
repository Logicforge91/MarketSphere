import { catalog } from "./catalog";

export const sellers = [
  {
    slug: "marketsphere-select",
    name: "MarketSphere Select",
    category: "Curated fashion and lifestyle",
    rating: 4.8,
    reviewCount: 18420,
    followers: "128K",
    verified: true,
    location: "Mumbai, Maharashtra",
    responseTime: "Usually replies within 2 hours",
    description: "MarketSphere Select brings together verified products from established labels and high-quality independent makers.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85",
    priceFactor: 1,
    deliveryDays: "2-3 days",
    shipping: 0,
    policies: ["7-day easy returns", "Authenticity checked", "GST invoice provided", "Secure MarketSphere fulfilment"],
    offers: ["Extra 10% off above Rs. 4,999", "No-cost EMI on eligible cards"],
  },
  {
    slug: "modern-wardrobe",
    name: "The Modern Wardrobe",
    category: "Contemporary clothing",
    rating: 4.6,
    reviewCount: 9360,
    followers: "74K",
    verified: true,
    location: "Bengaluru, Karnataka",
    responseTime: "Usually replies within 4 hours",
    description: "A modern edit of easy tailoring, occasion pieces and elevated wardrobe foundations.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85",
    priceFactor: .96,
    deliveryDays: "3-5 days",
    shipping: 99,
    policies: ["7-day returns", "Original tags required", "GST invoice available", "Seller fulfilled"],
    offers: ["15% off first store order", "Free shipping above Rs. 5,999"],
  },
  {
    slug: "sole-society",
    name: "Sole Society",
    category: "Sneakers and footwear",
    rating: 4.7,
    reviewCount: 7125,
    followers: "61K",
    verified: true,
    location: "New Delhi, Delhi",
    responseTime: "Usually replies within 3 hours",
    description: "Performance and lifestyle footwear from trusted global labels, with fit guidance from footwear specialists.",
    image: "https://images.unsplash.com/photo-1555529771-35a38bb54c3f?auto=format&fit=crop&w=1400&q=85",
    priceFactor: .98,
    deliveryDays: "2-4 days",
    shipping: 49,
    policies: ["10-day size exchange", "Unused footwear only", "Brand warranty supported", "Tamper-proof packaging"],
    offers: ["Up to 20% off selected sneakers", "Extra Rs. 300 off prepaid orders"],
  },
  {
    slug: "beauty-room",
    name: "The Beauty Room",
    category: "Beauty and fragrance",
    rating: 4.5,
    reviewCount: 5840,
    followers: "48K",
    verified: true,
    location: "Pune, Maharashtra",
    responseTime: "Usually replies within 6 hours",
    description: "A verified collection of fragrance, skincare and colour selected for everyday rituals and gifting.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9f?auto=format&fit=crop&w=1400&q=85",
    priceFactor: 1.03,
    deliveryDays: "4-6 days",
    shipping: 79,
    policies: ["Returns for damaged items", "Sealed products only", "Batch and expiry verified", "Authenticity guaranteed"],
    offers: ["Complimentary sample above Rs. 2,999", "Buy two beauty products, save 10%"],
  },
];

export function getSeller(slug) {
  return sellers.find((seller) => seller.slug === slug) || sellers[0];
}

export function sellerProducts(slug) {
  const offset = Math.max(0, sellers.findIndex((seller) => seller.slug === slug));
  return [...catalog.slice(offset), ...catalog.slice(0, offset)].slice(0, 12);
}
