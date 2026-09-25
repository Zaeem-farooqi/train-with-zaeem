import { NextResponse } from "next/server";

export const runtime = "nodejs";

type GeoPayload = {
  countryCode: string | null;
  city: string | null;
  regionName: string | null;
};

async function lookupGeo(ip: string | null): Promise<GeoPayload> {
  const empty: GeoPayload = { countryCode: null, city: null, regionName: null };
  if (!ip || ip === "127.0.0.1" || ip === "::1") return empty;

  try {
    const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return empty;
    const data = (await res.json()) as {
      country_code?: string;
      city?: string;
      region?: string;
      error?: boolean;
    };
    if (data.error) return empty;
    return {
      countryCode: data.country_code ?? null,
      city: data.city ?? null,
      regionName: data.region ?? null,
    };
  } catch {
    return empty;
  }
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    null
  );
}

export async function GET(request: Request) {
  const ip = clientIp(request);
  const geo = await lookupGeo(ip);

  // Netlify / some hosts also pass country hints.
  const headerCountry =
    request.headers.get("x-country") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry");

  return NextResponse.json({
    countryCode: geo.countryCode ?? headerCountry ?? null,
    city: geo.city,
    regionName: geo.regionName,
  });
}
