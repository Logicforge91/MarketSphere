import { brands, cartItems, categories, deals, productDetail, trending } from "../data/shopData";

const CACHE_PREFIX = "marketsphere:data-cache:";
const DEFAULT_TTL = 1000 * 60 * 15;

function readCache(key, allowStale = false) {
  try {
    const cached = JSON.parse(window.localStorage.getItem(`${CACHE_PREFIX}${key}`));
    if (!cached || (!allowStale && Date.now() > cached.expiresAt)) return null;
    return cached.value;
  } catch {
    return null;
  }
}

function writeCache(key, value, ttl = DEFAULT_TTL) {
  try {
    window.localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ value, expiresAt: Date.now() + ttl }));
  } catch {
    // Cached data is an optimization; quota failures should not block shopping.
  }
  return value;
}

export async function getHomePageContent() {
  return readCache("home") || writeCache("home", { categories, deals, trending, brands });
}

export async function getProductPageContent() {
  return readCache("product-detail") || writeCache("product-detail", { product: productDetail, relatedProducts: deals, cartItems });
}

export async function fetchFromApi(path, { retries = 2, timeout = 8000, ttl = DEFAULT_TTL } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const cacheKey = `api:${path}`;
  const fresh = readCache(cacheKey);
  if (fresh) return fresh;

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(`${baseUrl}${path}`, { signal: controller.signal });
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      const data = await response.json();
      window.clearTimeout(timer);
      return writeCache(cacheKey, data, ttl);
    } catch (error) {
      window.clearTimeout(timer);
      lastError = error;
      if (attempt < retries) await new Promise((resolve) => window.setTimeout(resolve, 400 * (2 ** attempt)));
    }
  }

  const stale = readCache(cacheKey, true);
  if (stale) return stale;
  throw lastError;
}
