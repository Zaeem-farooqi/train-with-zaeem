"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatPlanPrice,
  planCatalog,
  regionPricing,
  resolvePricingRegion,
  type PlanId,
  type PricingRegion,
} from "@/config/plans";

type Place = {
  countryCode: string | null;
  city: string | null;
};

export type LocationStatus = "idle" | "prompting" | "ready" | "denied" | "unavailable";

export type VisiblePlan = {
  id: PlanId;
  name: string;
  summary: string;
  features: readonly string[];
  featured: boolean;
  personalOnly: boolean;
  amount: number;
  priceLabel: string;
  currency: "PKR" | "USD";
};

function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 12000,
      maximumAge: 10 * 60 * 1000,
    });
  });
}

/** Rough metro boxes — used if reverse-geocode is slow or fails. */
function cityFromCoords(lat: number, lng: number): string | null {
  // Lahore
  if (lat >= 31.2 && lat <= 31.8 && lng >= 74.05 && lng <= 74.65) return "Lahore";
  // Islamabad / Rawalpindi
  if (lat >= 33.45 && lat <= 33.85 && lng >= 72.75 && lng <= 73.35) return "Islamabad";
  // Pakistan (country-level fallback)
  if (lat >= 23.5 && lat <= 37.2 && lng >= 60.8 && lng <= 77.9) return "Pakistan";
  return null;
}

async function reverseGeocode(lat: number, lng: number): Promise<Place> {
  const boxed = cityFromCoords(lat, lng);
  try {
    const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lng));
    url.searchParams.set("localityLanguage", "en");

    const res = await fetch(url.toString());
    if (!res.ok) {
      return {
        countryCode: boxed === null ? null : "PK",
        city: boxed === "Pakistan" ? null : boxed,
      };
    }

    const data = (await res.json()) as {
      countryCode?: string;
      city?: string;
      locality?: string;
      principalSubdivision?: string;
    };

    const city =
      data.city ||
      data.locality ||
      data.principalSubdivision ||
      (boxed && boxed !== "Pakistan" ? boxed : null);

    return {
      countryCode: data.countryCode ?? (boxed ? "PK" : null),
      city,
    };
  } catch {
    return {
      countryCode: boxed === null ? null : "PK",
      city: boxed === "Pakistan" ? null : boxed,
    };
  }
}

export function usePricingLocation() {
  const [place, setPlace] = useState<Place | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  const requestLocation = useCallback(async () => {
    setStatus("prompting");
    try {
      const position = await getPosition();
      const { latitude, longitude } = position.coords;
      const resolved = await reverseGeocode(latitude, longitude);
      setPlace(resolved);
      setStatus("ready");
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? (error as GeolocationPositionError).code
          : null;

      setPlace({ countryCode: null, city: null });
      if (code === 1) {
        setStatus("denied");
      } else {
        setStatus("unavailable");
      }
    }
  }, []);

  useEffect(() => {
    void requestLocation();
  }, [requestLocation]);

  const resolved = useMemo(
    () =>
      resolvePricingRegion({
        countryCode: place?.countryCode,
        city: place?.city,
      }),
    [place],
  );

  const pricing = regionPricing[resolved.region];

  const visiblePlans = useMemo(() => {
    const plans: VisiblePlan[] = [];

    for (const plan of planCatalog) {
      if (plan.personalOnly && !resolved.showPersonal) continue;
      const amount = (pricing.prices as Record<string, number | undefined>)[plan.id];
      if (amount == null) continue;

      plans.push({
        id: plan.id,
        name: plan.name,
        summary: plan.summary,
        features: plan.features,
        featured: plan.featured,
        personalOnly: plan.personalOnly,
        amount,
        currency: pricing.currency,
        priceLabel: formatPlanPrice(amount, pricing.currency, pricing.currencyLabel),
      });
    }

    return plans;
  }, [pricing, resolved.showPersonal]);

  const statusMessage =
    status === "prompting" || status === "idle"
      ? "Asking for your location…"
      : status === "denied"
        ? "Location blocked — allow access to see Lahore / Islamabad plans."
        : status === "unavailable"
          ? "Couldn’t read your location — showing base rates."
          : `Prices for ${resolved.label}`;

  return {
    ready: status === "ready" || status === "denied" || status === "unavailable",
    status,
    statusMessage,
    requestLocation,
    region: resolved.region as PricingRegion,
    locationLabel: resolved.label,
    showPersonal: resolved.showPersonal,
    visiblePlans,
  };
}
