
import { useEffect, useState } from "react";

type Currency = "INR" | "USD";

function getDefaultCurrency(): Currency {
  // Try to detect currency by country (using browser language as fallback)
  if (typeof window !== "undefined") {
    const lang = window.navigator.language;
    if (lang.startsWith("en-IN") || lang === "hi-IN") return "INR";
    try {
      // Use Intl API to get country code from timezone (crude, but better than nothing)
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && tz.includes("Asia/Kolkata")) return "INR";
    } catch {}
  }
  return "USD";
}

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>("USD");
  useEffect(() => {
    setCurrency(getDefaultCurrency());
  }, []);
  // Currency symbol
  const symbol = currency === "INR" ? "₹" : "$";
  // Format monetary value
  const format = (amount: number) =>
    currency === "INR"
      ? `₹${amount.toLocaleString("en-IN")}`
      : `$${(amount * 0.012).toLocaleString("en-US", { minimumFractionDigits: 2 })}`; // Assume 1 INR ≈ 0.012 USD

  return { currency, format, symbol };
}
