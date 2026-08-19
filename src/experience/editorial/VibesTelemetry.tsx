"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

/**
 * $VIBES telemetry — the platform's own token read the way everything else
 * on this page is read: as an instrument, not an advert. A terminal cursor
 * blinks the feed live, the price settles out of a digit scramble, and a
 * centre-zero drift gauge (survey ticks + needle) carries the 24h move —
 * accent green above zero, persimmon below. Feed: /api/vibes-market, a
 * passthrough to the app's own Dexscreener proxy, refreshed on the proxy's
 * 60s cadence.
 */

const VIBES_TOKEN = "0xefFC8815487084a97edfdfF968b56Ea123421Acb";
const RAISE_URL = "https://app.vibestarter.xyz/raises/vibes";
const FALLBACK_CHART_URL = `https://dexscreener.com/base/${VIBES_TOKEN}`;

interface VibesMarket {
  priceUsd: number;
  change24h: number;
  fdv: number;
  liquidity: number;
  volume24h: number;
  dexUrl: string;
}

/* drift gauge geometry — ±20% full scale */
const GAUGE_W = 150;
const GAUGE_H = 26;
const GAUGE_MID = GAUGE_W / 2;
const PX_PER_PCT = 3.4;
const GAUGE_RANGE = 20;

const UP = "#91D982";
const DOWN = "#EC6800";
const IDLE = "rgba(255,255,255,0.42)";

function fmtPrice(p: number): string {
  if (!(p > 0)) return "—";
  if (p >= 1) return `$${p.toFixed(2)}`;
  if (p >= 0.01) return `$${p.toFixed(4)}`;
  const decimals = Math.min(Math.ceil(-Math.log10(p)) + 3, 12);
  return `$${p.toFixed(decimals)}`;
}

function fmtCompact(v: number): string {
  if (!(v > 0)) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtChange(c: number): string {
  return `${c >= 0 ? "+" : "-"}${Math.abs(c).toFixed(1)}%`;
}

function GaugeTicks() {
  const ticks: React.ReactElement[] = [];
  for (let pct = -GAUGE_RANGE; pct <= GAUGE_RANGE; pct += 2.5) {
    const x = GAUGE_MID + pct * PX_PER_PCT;
    const major = pct % 10 === 0;
    ticks.push(
      <line
        key={pct}
        x1={x}
        y1={major ? 7 : 10.5}
        x2={x}
        y2={major ? 19 : 15.5}
        stroke={
          pct === 0 ? "rgba(255,255,255,0.4)" : major ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.09)"
        }
        strokeWidth={1}
      />
    );
  }
  return <>{ticks}</>;
}

/**
 * Hover-scramble link whose scrambling text can never reflow the row: an
 * invisible static twin reserves the word's exact footprint and the live
 * (scrambled) copy renders absolutely on top of it, out of layout entirely.
 */
function ScrambleLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-cursor="link"
      className="ed-link font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-white/60 hover:text-white transition-colors"
    >
      <span className="relative inline-block whitespace-nowrap">
        <span aria-hidden className="invisible">{label}</span>
        <span data-scramble className="absolute inset-0">
          {label}
        </span>
      </span>{" "}
      ↗
    </a>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex flex-col items-center gap-1.5">
      <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/50">{label}</span>
      {/* fixed 7ch slot (mono) — values swapping in must never reflow the row */}
      <span
        className={`inline-block min-w-[7ch] text-center font-mono text-[13px] tabular-nums ${
          value === "—" ? "text-white/40" : "text-white/85"
        }`}
      >
        {value}
      </span>
    </span>
  );
}

export function VibesTelemetry() {
  const priceRef = useRef<HTMLSpanElement>(null);
  const changeRef = useRef<HTMLSpanElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const hasDataRef = useRef(false);
  const lastPriceRef = useRef("");
  const [market, setMarket] = useState<VibesMarket | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;

    const apply = (m: VibesMarket) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const priceText = fmtPrice(m.priceUsd);
      const changeText = fmtChange(m.change24h);

      if (priceRef.current && priceText !== lastPriceRef.current) {
        lastPriceRef.current = priceText;
        if (reduced) priceRef.current.textContent = priceText;
        else
          gsap.to(priceRef.current, {
            duration: 0.8,
            scrambleText: { text: priceText, chars: "0123456789", speed: 1.3 },
          });
      }
      if (changeRef.current) {
        if (reduced) changeRef.current.textContent = changeText;
        else
          gsap.to(changeRef.current, {
            duration: 0.6,
            scrambleText: { text: changeText, chars: "0123456789.", speed: 1.2 },
          });
      }
      if (needleRef.current) {
        const x = Math.max(-GAUGE_RANGE, Math.min(GAUGE_RANGE, m.change24h)) * PX_PER_PCT;
        if (reduced) gsap.set(needleRef.current, { x });
        else gsap.to(needleRef.current, { x, duration: 1.1, ease: "power3.out" });
      }
      setMarket(m);
    };

    const load = async () => {
      try {
        const res = await fetch("/api/vibes-market");
        if (!res.ok) throw new Error("bad status");
        const m = (await res.json()) as VibesMarket;
        if (!alive) return;
        hasDataRef.current = true;
        setFailed(false);
        apply(m);
      } catch {
        // a broken feed shows nothing rather than dead zeros — but keep
        // stale figures if a refresh fails after a good load
        if (alive && !hasDataRef.current) setFailed(true);
      }
    };

    load();
    const id = window.setInterval(load, 60_000);
    const onVis = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (failed) return null;

  const live = market !== null;
  const up = (market?.change24h ?? 0) >= 0;
  const needleColor = live ? (up ? UP : DOWN) : IDLE;

  return (
    <div data-launch-fade className="mt-12 sm:mt-14">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 px-2">
        {/* feed identity + price — one cluster so phones keep them together */}
        <span className="flex items-center gap-5">
          <span className="flex items-center gap-2.5 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-white/60">
            <span aria-hidden className="inline-block w-[7px] h-[13px] bg-accent animate-terminal-blink" />
            $VIBES · Live
          </span>

          {/* price — settles out of a digit scramble on each reading */}
          {/* fixed 10ch slot (mono) — the scramble must never reflow the row */}
          <span
            ref={priceRef}
            className={`inline-block min-w-[10ch] text-center font-display font-bold text-[22px] sm:text-[26px] tracking-tight tabular-nums transition-colors duration-500 ${
              live ? "text-white" : "text-white/40"
            }`}
          >
            $0.0000000
          </span>
        </span>

        {/* 24h drift gauge — centre-zero survey scale */}
        <span className="flex flex-col items-center gap-1">
          <svg
            width={GAUGE_W}
            height={GAUGE_H}
            viewBox={`0 0 ${GAUGE_W} ${GAUGE_H}`}
            aria-hidden
            className="overflow-visible"
          >
            <line
              x1={2}
              y1={GAUGE_H / 2}
              x2={GAUGE_W - 2}
              y2={GAUGE_H / 2}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth={1}
            />
            <GaugeTicks />
            <g ref={needleRef}>
              <line
                x1={GAUGE_MID}
                y1={2}
                x2={GAUGE_MID}
                y2={GAUGE_H - 2}
                stroke={needleColor}
                strokeWidth={5}
                opacity={0.22}
              />
              <line
                x1={GAUGE_MID}
                y1={2}
                x2={GAUGE_MID}
                y2={GAUGE_H - 2}
                stroke={needleColor}
                strokeWidth={1.6}
              />
            </g>
          </svg>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase">
            <span
              ref={changeRef}
              className={live ? (up ? "text-accent" : "text-persimmon-500") : "text-white/40"}
            >
              ——
            </span>
            <span className="text-white/50"> · 24h</span>
          </span>
        </span>

        {/* panel stats — one cluster so phones get a single three-up row */}
        <span className="flex items-start gap-8">
          <Stat label="FDV" value={market ? fmtCompact(market.fdv) : "—"} />
          <Stat label="Liquidity" value={market ? fmtCompact(market.liquidity) : "—"} />
          <Stat label="24h Vol" value={market ? fmtCompact(market.volume24h) : "—"} />
        </span>

        {/* exits */}
        <span className="flex items-center gap-6">
          <ScrambleLink href={RAISE_URL} label="Raise" />
          <ScrambleLink href={market?.dexUrl || FALLBACK_CHART_URL} label="Chart" external />
        </span>
      </div>
    </div>
  );
}
