/**
 * Plan copy and region pricing.
 * Amounts are whole currency units (PKR or USD).
 *
 * International rates are premium USD one-time fees for custom
 * plan delivery ($99 / $99 / $179). Personal training stays
 * Pakistan-only (Lahore / Islamabad).
 */

export type PlanId = "diet" | "workout" | "combo" | "personal";

export type PricingRegion = "pakistan" | "islamabad" | "international";

export const plansContent = {
  id: "plans",
  eyebrow: "Plans",
  title: "Pick the work you need.",
  lede: "Prices follow where you are. Personal training only shows for Lahore and Islamabad.",
} as const;

export const planCatalog = [
  {
    id: "diet" as const,
    name: "Diet plan",
    summary: "A custom eating plan built around your life, with clear adjustments.",
    features: ["Custom macros and meals", "Grocery-friendly structure", "Revision guidance"],
    personalOnly: false,
    featured: false,
  },
  {
    id: "workout" as const,
    name: "Workout plan",
    summary: "Programming for your schedule, equipment, and recovery — rewritten when needed.",
    features: ["Custom weekly routine", "Progression rules", "Form cues and swaps"],
    personalOnly: false,
    featured: false,
  },
  {
    id: "combo" as const,
    name: "Diet + workout",
    summary: "Both plans together, aligned so food and training pull in the same direction.",
    features: ["Full diet plan", "Full workout plan", "Shared check-in logic"],
    personalOnly: false,
    featured: true,
  },
  {
    id: "personal" as const,
    name: "Diet + workout + personal",
    summary: "Everything above, plus hands-on sessions in the room.",
    features: ["Diet + workout plans", "In-person sessions", "Lahore or Islamabad only"],
    personalOnly: true,
    featured: false,
  },
] as const;

/** Base Pakistan rates (PKR). */
const pakistanPrices: Record<PlanId, number> = {
  diet: 5000,
  workout: 5000,
  combo: 9000,
  personal: 18000,
};

/** Islamabad uplift (~20%). */
const islamabadPrices: Record<PlanId, number> = {
  diet: 6000,
  workout: 6000,
  combo: 11000,
  personal: 22000,
};

/**
 * International rates (USD), one-time plan fees.
 * Premium vs Pakistan PKR rates — custom online plan delivery.
 */
const internationalPrices: Record<Exclude<PlanId, "personal">, number> = {
  diet: 99,
  workout: 99,
  combo: 179,
};

export const regionPricing = {
  pakistan: {
    currency: "PKR" as const,
    currencyLabel: "Rs",
    prices: pakistanPrices,
  },
  islamabad: {
    currency: "PKR" as const,
    currencyLabel: "Rs",
    prices: islamabadPrices,
  },
  international: {
    currency: "USD" as const,
    currencyLabel: "$",
    prices: internationalPrices,
  },
} as const;

export function resolvePricingRegion(input: {
  countryCode?: string | null;
  city?: string | null;
}): {
  region: PricingRegion;
  showPersonal: boolean;
  label: string;
} {
  const country = (input.countryCode ?? "").toUpperCase();
  const city = (input.city ?? "").toLowerCase();

  if (country && country !== "PK") {
    return { region: "international", showPersonal: false, label: "International" };
  }

  if (city.includes("islamabad") || city.includes("rawalpindi")) {
    return { region: "islamabad", showPersonal: true, label: "Islamabad" };
  }

  if (city.includes("lahore")) {
    return { region: "pakistan", showPersonal: true, label: "Lahore" };
  }

  // In Pakistan (or unknown): base rates until city confirms personal training.
  if (country === "PK" || !country) {
    return { region: "pakistan", showPersonal: false, label: country === "PK" ? "Pakistan" : "Your area" };
  }

  return { region: "international", showPersonal: false, label: "International" };
}

export function formatPlanPrice(
  amount: number,
  currency: "PKR" | "USD",
  currencyLabel: string,
) {
  if (currency === "USD") {
    return `${currencyLabel}${amount}`;
  }
  return `${currencyLabel} ${amount.toLocaleString("en-PK")}`;
}
