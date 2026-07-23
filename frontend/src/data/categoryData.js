const categoryTemplates = {
  women: {
    name: "Women",
    eyebrow: "The 2026 edit",
    title: "Style for every part of your day",
    description: "Discover modern dresses, considered separates and accessories selected for work, weekends and everything between.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=85",
    accent: "#efe9fb",
    subcategories: [
      { name: "Dresses", children: ["Day dresses", "Occasion dresses", "Maxi dresses"], image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80" },
      { name: "Tops", children: ["Shirts", "Blouses", "Everyday tops"], image: "https://images.unsplash.com/photo-1564257577054-2e76f8d4e12f?auto=format&fit=crop&w=500&q=80" },
      { name: "Bottoms", children: ["Trousers", "Denim", "Skirts"], image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=500&q=80" },
    ],
    brands: ["ZARA", "MANGO", "H&M", "COACH"],
    filters: ["Fit", "Dress length", "Sleeve", "Occasion"],
    offer: "Extra 15% off selected occasion styles",
    seoTitle: "Women's fashion, thoughtfully curated",
    seoCopy: "Shop women's clothing and accessories across dresses, tops, tailoring, denim and occasion wear. MarketSphere brings established names and emerging labels together with clear delivery information, secure checkout and easy returns.",
  },
  men: {
    name: "Men",
    eyebrow: "New foundations",
    title: "Modern essentials, made effortless",
    description: "Build a sharper wardrobe with relaxed tailoring, versatile layers and everyday pieces that work harder.",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=85",
    accent: "#e8f0f4",
    subcategories: [
      { name: "Jackets", children: ["Blazers", "Denim jackets", "Lightweight layers"], image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=500&q=80" },
      { name: "Shirts", children: ["Casual shirts", "Formal shirts", "Linen shirts"], image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=500&q=80" },
      { name: "Essentials", children: ["T-shirts", "Trousers", "Denim"], image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=500&q=80" },
    ],
    brands: ["NIKE", "PUMA", "H&M", "MANGO"],
    filters: ["Fit", "Collar", "Sleeve", "Occasion"],
    offer: "Buy two wardrobe essentials and save 20%",
    seoTitle: "Men's clothing for work and weekends",
    seoCopy: "Explore men's clothing across shirts, jackets, trousers, denim and relaxed essentials. Compare trusted brands, practical fabrics and versatile fits with convenient delivery and easy returns from MarketSphere.",
  },
  bags: {
    name: "Bags",
    eyebrow: "Carry the season",
    title: "The finishing touch, considered",
    description: "From structured work bags to easy weekend shapes, find the one you will reach for every day.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=85",
    accent: "#f7e9ed",
    subcategories: [
      { name: "Shoulder Bags", children: ["Chain bags", "Hobo bags", "Mini bags"], image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=500&q=80" },
      { name: "Totes", children: ["Work totes", "Leather totes", "Canvas totes"], image: "https://images.unsplash.com/photo-1585488434455-1e7b6b53f9d9?auto=format&fit=crop&w=500&q=80" },
      { name: "Day Bags", children: ["Crossbody", "Backpacks", "Satchels"], image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80" },
    ],
    brands: ["COACH", "ALDO", "MANGO", "GUESS"],
    filters: ["Bag type", "Strap", "Closure", "Compartments"],
    offer: "Complimentary shipping on bags above Rs. 3,999",
    seoTitle: "Bags for work, weekends and occasions",
    seoCopy: "Discover shoulder bags, totes, crossbody bags and backpacks from popular and independent brands. Browse by material, shape, colour and function to find a bag suited to your routine.",
  },
  shoes: {
    name: "Shoes",
    eyebrow: "Step into new",
    title: "Everyday comfort, standout design",
    description: "Performance sneakers, refined classics and statement pairs selected for wherever you are going next.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85",
    accent: "#e9f1ec",
    subcategories: [
      { name: "Sneakers", children: ["Lifestyle", "Court", "Retro"], image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80" },
      { name: "Running", children: ["Road running", "Training", "Walking"], image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80" },
      { name: "Lifestyle", children: ["Loafers", "Sandals", "Everyday shoes"], image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=80" },
    ],
    brands: ["NIKE", "PUMA", "ALDO", "MANGO"],
    filters: ["Shoe size", "Activity", "Fastening", "Sole"],
    offer: "Up to 30% off selected sneakers",
    seoTitle: "Shoes for movement and everyday style",
    seoCopy: "Shop sneakers, running shoes and everyday footwear with size, activity and material filters. MarketSphere makes it simpler to compare comfort, performance and style across leading brands.",
  },
};

categoryTemplates.accessories = {
  ...categoryTemplates.bags,
  name: "Accessories",
  eyebrow: "Small details, big impact",
  title: "Finish every look your way",
  description: "Discover watches, jewellery and considered extras that make an everyday outfit feel entirely personal.",
  image: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=1600&q=85",
  subcategories: [
    { name: "Watches", children: ["Classic watches", "Smart watches", "Straps"], image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
    { name: "Jewellery", children: ["Earrings", "Necklaces", "Rings"], image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80" },
    { name: "Small Accessories", children: ["Belts", "Sunglasses", "Hair accessories"], image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80" },
  ],
  filters: ["Accessory type", "Finish", "Movement", "Style"],
  seoTitle: "Accessories that make the look",
  seoCopy: "Explore watches, jewellery and small accessories across modern and classic styles. Filter by finish, colour, material and brand to discover the right final detail.",
};

categoryTemplates.beauty = {
  ...categoryTemplates.women,
  name: "Beauty",
  eyebrow: "Beauty, personally selected",
  title: "Rituals for every version of you",
  description: "Explore fragrance, colour and skincare from trusted names and new favourites.",
  image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=85",
  subcategories: [
    { name: "Fragrance", children: ["For her", "For him", "Discovery sets"], image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80" },
    { name: "Makeup", children: ["Lips", "Face", "Eyes"], image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9f?auto=format&fit=crop&w=500&q=80" },
    { name: "Skincare", children: ["Cleansers", "Moisturisers", "Treatments"], image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=500&q=80" },
  ],
  brands: ["MANGO", "H&M", "GUESS", "COACH"],
  filters: ["Skin type", "Concern", "Finish", "Formulation"],
  offer: "Complimentary beauty gift above Rs. 2,999",
  seoTitle: "Beauty for everyday rituals",
  seoCopy: "Shop fragrance, makeup and skincare with useful filters for skin type, concern, finish and formulation. Discover trusted favourites and emerging beauty names in one curated destination.",
};

export function getCategoryContent(slug = "women") {
  return categoryTemplates[slug] || categoryTemplates.women;
}

export const categorySlugs = Object.keys(categoryTemplates);
