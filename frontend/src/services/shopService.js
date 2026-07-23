import { brands, cartItems, categories, deals, productDetail, trending } from "../data/shopData";

export async function getHomePageContent() {
  return { categories, deals, trending, brands };
}

export async function getProductPageContent() {
  return { product: productDetail, relatedProducts: deals, cartItems };
}

export async function fetchFromApi(path) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}
