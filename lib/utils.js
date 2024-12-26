import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertToNumber(value) {
  const units = {
    K: 1000,
    L: 100000,
    Cr: 10000000,
  };

  const unit = value.slice(-1);
  const number = parseFloat(value.slice(0, -1));

  return units[unit] ? number * units[unit] : parseFloat(value.replace(/[^0-9.-]+/g, ""));
}
