import React, { useState } from "react";
import { usePerformance } from "../../context/PerformanceContext";

function optimizeUrl(src, lowNetworkMode) {
  if (!src?.includes("images.unsplash.com")) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", lowNetworkMode ? "420" : "720");
  url.searchParams.set("q", lowNetworkMode ? "45" : "76");
  return url.toString();
}

export default function OptimizedImage({ src, alt, className, eager = false, ...props }) {
  const { lowNetworkMode } = usePerformance();
  const [loaded, setLoaded] = useState(false);
  return <img
    {...props}
    className={`${className || ""} optimized-image ${loaded ? "loaded" : ""}`.trim()}
    src={optimizeUrl(src, lowNetworkMode)}
    alt={alt}
    loading={eager ? "eager" : "lazy"}
    decoding="async"
    fetchPriority={eager ? "high" : "auto"}
    onLoad={() => setLoaded(true)}
  />;
}
