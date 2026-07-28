import { deals, mobileProducts, productDetail, shoeProducts, trending } from "./shopData";

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferCategory(name) {
  const value = name.toLowerCase();
  if (/(bag|tote)/.test(value)) return "Bags";
  if (/(shoe|sneaker|air max|ultraboost|rider)/.test(value)) return "Shoes";
  if (/(watch|earring|jewel)/.test(value)) return "Accessories";
  if (/(perfume|beauty)/.test(value)) return "Beauty";
  if (/(blazer|jacket)/.test(value)) return "Men";
  return "Women";
}

function normalizeProduct(product, index) {
  const name = product.name;
  return {
    id: product.id || `product-${index + 1}`,
    slug: slugify(name),
    category: product.category || inferCategory(name),
    price: product.price || 3999,
    oldPrice: product.oldPrice || Math.round((product.price || 3999) * 1.25),
    rating: product.rating || 4.5,
    discount: product.discount,
    image: product.image,
    name,
  };
}

const source = [productDetail, ...deals, ...mobileProducts, ...shoeProducts, ...trending];

export const catalog = Array.from(
  new Map(source.map((product, index) => {
    const normalized = normalizeProduct(product, index);
    return [normalized.slug, normalized];
  })).values(),
);

export function getProductBySlug(slug) {
  return catalog.find((product) => product.slug === slug);
}
