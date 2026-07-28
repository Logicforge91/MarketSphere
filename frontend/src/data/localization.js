export const languages = [
  { code: "en", label: "English", native: "English", direction: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", direction: "ltr" },
  { code: "ta", label: "Tamil", native: "தமிழ்", direction: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", direction: "rtl" },
];

export const regions = {
  IN: { country: "India", currency: "INR", locale: "en-IN", rate: 1, taxRate: .05, taxLabel: "GST", availability: 100, payments: ["saved-card", "card", "upi", "netbanking", "wallet", "emi", "bnpl", "cod"], shipping: ["standard", "express", "same-day", "scheduled", "pickup"] },
  AE: { country: "United Arab Emirates", currency: "AED", locale: "en-AE", rate: .044, taxRate: .05, taxLabel: "VAT", availability: 82, payments: ["saved-card", "card", "wallet", "bnpl", "cod"], shipping: ["standard", "express", "scheduled", "pickup"] },
  SG: { country: "Singapore", currency: "SGD", locale: "en-SG", rate: .016, taxRate: .09, taxLabel: "GST", availability: 76, payments: ["saved-card", "card", "wallet", "bnpl"], shipping: ["standard", "express", "scheduled"] },
  GB: { country: "United Kingdom", currency: "GBP", locale: "en-GB", rate: .0088, taxRate: .20, taxLabel: "VAT", availability: 71, payments: ["saved-card", "card", "wallet", "bnpl"], shipping: ["standard", "express", "scheduled"] },
  SA: { country: "Saudi Arabia", currency: "SAR", locale: "ar-SA", rate: .045, taxRate: .15, taxLabel: "VAT", availability: 68, payments: ["saved-card", "card", "wallet", "bnpl", "cod"], shipping: ["standard", "express", "scheduled"] },
};

export const translations = {
  en: { account: "Account", bag: "Bag", search: "Search", wishlist: "Wishlist", shipping: "Complimentary shipping", returns: "Easy returns" },
  hi: { account: "खाता", bag: "बैग", search: "खोज", wishlist: "पसंद सूची", shipping: "मुफ्त शिपिंग", returns: "आसान वापसी" },
  ta: { account: "கணக்கு", bag: "பை", search: "தேடல்", wishlist: "விருப்பப் பட்டியல்", shipping: "இலவச விநியோகம்", returns: "எளிய திரும்பப்பெறல்" },
  ar: { account: "الحساب", bag: "الحقيبة", search: "بحث", wishlist: "المفضلة", shipping: "شحن مجاني", returns: "إرجاع سهل" },
};
