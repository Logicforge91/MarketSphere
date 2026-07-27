import { regions } from "../data/localization";
import { getStored } from "./storage";

export const money = (value) => {
  const preferences = getStored("marketsphere:entry-preferences", { country: "IN" });
  const region = regions[preferences.country] || regions.IN;
  return new Intl.NumberFormat(region.locale, {
    currency: region.currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(value || 0) * region.rate);
};
