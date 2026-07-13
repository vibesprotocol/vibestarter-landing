import { NextResponse } from "next/server";

/**
 * Same-origin passthrough for the $VIBES market readout. The app's own
 * Dexscreener proxy does all the real work (best-pair selection, rate
 * limiting, 60s edge cache) — this route exists only because the app API
 * sends no CORS headers, so the landing can't call it from the client.
 *
 * $VIBES is a one-time singleton on Base mainnet, so the address is pinned
 * here rather than env-driven (same convention as the app's vibes-supply.ts).
 */
const VIBES_TOKEN = "0xefFC8815487084a97edfdfF968b56Ea123421Acb";

export const revalidate = 60;

export interface VibesMarket {
  priceUsd: number;
  change24h: number;
  fdv: number;
  liquidity: number;
  volume24h: number;
  dexUrl: string;
}

export async function GET() {
  try {
    const res = await fetch(
      `https://app.vibestarter.xyz/api/dexscreener/${VIBES_TOKEN}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      return NextResponse.json({ error: "market data unavailable" }, { status: 502 });
    }
    const d = await res.json();
    const market: VibesMarket = {
      priceUsd: Number(d.priceUsd) || 0,
      change24h: Number(d.change24h) || 0,
      fdv: Number(d.fdv) || 0,
      liquidity: Number(d.liquidity) || 0,
      volume24h: Number(d.volume24h) || 0,
      dexUrl: typeof d.dexUrl === "string" ? d.dexUrl : "",
    };
    return NextResponse.json(market, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({ error: "market data unavailable" }, { status: 502 });
  }
}
