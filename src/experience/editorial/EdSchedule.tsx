"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TAPE = [
  { pct: "10%", label: "T0 · DAY 0 · KICKSTART", eth: "8.50 Ξ" },
  { pct: "15%", label: "T1 · DAY 30", eth: "12.75 Ξ" },
  { pct: "15%", label: "T2 · DAY 60", eth: "12.75 Ξ" },
  { pct: "15%", label: "T3 · DAY 90", eth: "12.75 Ξ" },
  { pct: "15%", label: "T4 · DAY 120", eth: "12.75 Ξ" },
  { pct: "15%", label: "T5 · DAY 150", eth: "12.75 Ξ" },
  { pct: "15%", label: "T6 · DAY 180", eth: "12.75 Ξ" },
];

/**
 * 02 — the schedule as a typographic tape on one page-wide rail. The
 * full-bleed band IS the rail line: its borders are the twin rails, a rail
 * bed of sleeper ties runs along its bottom edge, each tranche is a station
 * on the line, and a single release runs the line station to station —
 * flashing amber in transit (the 72h window) and igniting each numeral as
 * it arrives. Copy stands alone without any of it.
 */
export function EdSchedule() {
  const sectionRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const tapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const band = bandRef.current;
    const tape = tapeRef.current;
    if (!section || !band || !tape) return;

    // the full tape always fits the viewport — the kickstart 10% and final
    // tranche must never crop off the edges
    const fit = () => {
      gsap.set(tape, { scale: 1 });
      gsap.set(tape, {
        scale: Math.min(1, (window.innerWidth * 0.96) / tape.scrollWidth),
        transformOrigin: "center bottom",
      });
    };

    // stations live on the page-wide rail bed; align each one under its
    // tranche numeral's center and store the geometry the sweep needs
    const stationXs: number[] = [];
    const stationScales: number[] = [];
    let bandW = 0;
    const positionStations = () => {
      const stations = gsap.utils.toArray<HTMLElement>("[data-rail-station]", band);
      const blocks = gsap.utils.toArray<HTMLElement>("[data-tape-pct]", band);
      const bandRect = band.getBoundingClientRect();
      bandW = bandRect.width;
      // neutralize the parallax drift so stations sit where the tape rests
      // (the drift tween uses a % unit — convert to px before subtracting)
      const driftX = Number(gsap.getProperty(tape, "x", "px")) || 0;
      blocks.forEach((block, i) => {
        const station = stations[i];
        if (!station) return;
        const r = block.getBoundingClientRect();
        const cx = r.left + r.width / 2 - bandRect.left - driftX;
        stationXs[i] = cx;
        stationScales[i] = bandW > 0 ? cx / bandW : 0;
        gsap.set(station, { x: cx, xPercent: -50, yPercent: -50, rotation: 45 });
      });
    };

    let sweep: gsap.core.Timeline | null = null;
    const handleResize = () => {
      fit();
      positionStations();
      sweep?.invalidate();
    };
    fit();
    positionStations();
    window.addEventListener("resize", handleResize);

    // if the webfonts weren't ready yet, glyph widths change on swap —
    // re-measure the fit scale and station geometry once they land
    let disposed = false;
    document.fonts.ready.then(() => {
      if (disposed) return;
      handleResize();
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // complete final state: the whole line lit, every station served
      gsap.utils.toArray<HTMLElement>("[data-tape-pct]", section).forEach((el) => {
        el.style.color = "#91D982";
      });
      gsap.set(gsap.utils.toArray<HTMLElement>("[data-rail-station]", section), {
        backgroundColor: "#91D982",
        borderColor: "#91D982",
      });
      const railLive = section.querySelector<HTMLElement>("[data-rail-live]");
      if (railLive) gsap.set(railLive, { scaleX: 1 });
      const pulse = section.querySelector<HTMLElement>("[data-rail-pulse]");
      if (pulse) gsap.set(pulse, { opacity: 0 });
      return () => {
        disposed = true;
        window.removeEventListener("resize", handleResize);
      };
    }

    const ctx = gsap.context(() => {
      // numerals roll in
      gsap.fromTo(
        "[data-tape-pct]",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.07,
          ease: "power4.out",
          scrollTrigger: { trigger: tape, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        "[data-tape-meta]",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          stagger: 0.07,
          delay: 0.3,
          scrollTrigger: { trigger: tape, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // gentle parallax drift across the tape
      gsap.fromTo(
        tape,
        { x: "1.5%" },
        {
          x: "-1.5%",
          ease: "none",
          scrollTrigger: { trigger: tape, start: "top bottom", end: "bottom top", scrub: 0.8 },
        }
      );

      // one release runs the line: a single head enters from the page's left
      // edge and travels station to station — amber in transit (the 72h
      // window), arriving exactly as each numeral ignites. Behind it the
      // live rail extends, station by station, until the whole line is lit.
      const pcts = gsap.utils.toArray<HTMLElement>("[data-tape-pct]", section);
      const stations = gsap.utils.toArray<HTMLElement>("[data-rail-station]", section);
      const railLive = section.querySelector<HTMLElement>("[data-rail-live]");
      const pulse = section.querySelector<HTMLElement>("[data-rail-pulse]");
      if (!railLive || !pulse) return;

      // center the head on the rail so it lands exactly on each station's x
      gsap.set(pulse, { x: -20, xPercent: -50, yPercent: -50 });

      sweep = gsap.timeline({
        repeat: -1,
        repeatDelay: 2.4,
        scrollTrigger: { trigger: tape, start: "top 85%", toggleActions: "play pause resume pause" },
      });
      const s = sweep;
      pcts.forEach((el, i) => {
        const at = i * 1.7;
        const ignite = i === 0 ? 0.2 : at + 1.0;

        // the leg: from the previous station (or the page edge) into station i
        if (i === 0) {
          s.fromTo(pulse, { x: -20 }, { x: () => stationXs[0] ?? 0, duration: 0.2, ease: "power1.inOut" }, 0);
          s.fromTo(pulse, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "none" }, 0);
        } else {
          s.to(pulse, { x: () => stationXs[i] ?? 0, duration: 1.45, ease: "power1.inOut" }, ignite - 1.45);
          // the 72h window passes in transit — the head beats amber, then green
          s.to(
            pulse,
            {
              backgroundColor: "#EC6800",
              boxShadow: "0 0 16px rgba(236,104,0,0.9)",
              duration: 0.22,
              repeat: 3,
              yoyo: true,
              ease: "none",
            },
            at
          );
        }

        // arrival: numeral ignites
        if (i > 0) {
          s.to(el, { color: "#EC6800", duration: 0.22, repeat: 3, yoyo: true, ease: "none" }, at);
          s.to(el, { color: "#91D982", duration: 0.45, ease: "power2.out" }, ignite);
        } else {
          s.fromTo(el, { color: "#ffffff" }, { color: "#91D982", duration: 0.45, ease: "power2.out" }, ignite);
        }
        // arrival: the station lights and the live rail extends to reach it
        s.to(
          stations[i],
          { backgroundColor: "#91D982", borderColor: "#91D982", duration: 0.45, ease: "power2.out" },
          ignite
        );
        s.to(railLive, { scaleX: () => stationScales[i] ?? 0, duration: 0.45, ease: "power2.out" }, ignite);
      });
      // past the last station the release runs off the right page edge and fades
      const lastIgnite = (TAPE.length - 1) * 1.7 + 1.0;
      s.to(pulse, { x: () => bandW + 30, duration: 1.2, ease: "power1.in" }, lastIgnite + 0.25);
      s.to(pulse, { opacity: 0, duration: 0.4, ease: "none" }, lastIgnite + 1.05);

      // the lit line holds until the loop restarts — explicit reset
      s.eventCallback("onRepeat", () => {
        pcts.forEach((el) => {
          gsap.set(el, { color: "#ffffff" });
        });
        gsap.set(stations, { backgroundColor: "#000000", borderColor: "rgba(255,255,255,0.4)" });
        gsap.set(railLive, { scaleX: 0 });
        gsap.set(pulse, { x: -20, opacity: 0, backgroundColor: "#91D982" });
      });
    }, section);

    return () => {
      disposed = true;
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <section id="schedule" ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden border-t border-white/[0.08]">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-10 mb-12 sm:mb-16">
        <p className="font-mono text-[11px] tracking-[0.32em] uppercase mb-6">
          <span className="text-accent">02</span>
          <span className="text-white/40"> — The schedule</span>
        </p>
        <h2 className="font-display font-bold tracking-[-0.04em] leading-[0.98] text-[clamp(40px,6.4vw,96px)] text-white">
          FUNDING ON{" "}
          <span className="text-accent">rails.</span>
        </h2>
        <p className="mt-6 max-w-[560px] text-muted font-sans font-light text-[15px] sm:text-base leading-relaxed">
          The raise funds the founder on a fixed clock — 10% the moment it closes, then 15%
          every thirty days for six months. No milestones to perform, no committee to
          convince. <span className="text-white">Time is the only variable a founder cannot perform around.</span>
        </p>
      </div>

      {/* the rail line: the band itself is the rail — its borders are the twin
          rails, the rail bed runs its bottom edge, tranches are stations on it */}
      <div ref={bandRef} className="relative border-y border-white/[0.16] py-10 sm:py-14">
        {/* upper rail bed — the band reads as one piece of rail infrastructure */}
        <div
          aria-hidden
          className="absolute top-0 left-0 w-full h-[18px] pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 26px, rgba(255,255,255,0.07) 26px 27px)",
          }}
        >
          <span className="absolute top-1/2 left-0 h-px w-full bg-white/[0.10]" />
        </div>

        {/* lower rail bed — carries the live rail, the stations, the release */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-full h-[18px] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 26px, rgba(255,255,255,0.07) 26px 27px)",
          }}
        >
          <span className="absolute top-1/2 left-0 h-px w-full bg-white/[0.10]" />
          <span
            data-rail-live
            className="absolute top-1/2 -translate-y-1/2 left-0 h-[3px] w-full bg-accent origin-left scale-x-0"
          />
          {TAPE.map((t) => (
            <span
              key={t.label}
              data-rail-station
              className="absolute left-0 top-1/2 w-[10px] h-[10px] border border-white/40 bg-black"
            />
          ))}
          <span
            data-rail-pulse
            className="absolute left-0 top-1/2 w-[10px] h-[10px] rounded-full bg-accent opacity-0"
            style={{ boxShadow: "0 0 16px rgba(145,217,130,0.9)" }}
          />
        </div>

        {/* the tape */}
        <div className="flex justify-center">
          <div ref={tapeRef} className="flex items-end w-max gap-0 px-[4vw] pb-[26px] will-change-transform">
            {TAPE.map((t, i) => (
              <div key={t.label} className="flex items-end">
                {i > 0 && (
                  <div className="relative flex flex-col items-center self-stretch justify-center px-5 sm:px-8" aria-hidden>
                    <span className="w-px flex-1 bg-white/[0.12]" />
                    <span className="font-mono text-[11px] tracking-[0.2em] text-persimmon-400/90 py-2 whitespace-nowrap">
                      72H
                    </span>
                    <span className="w-px flex-1 bg-white/[0.12]" />
                  </div>
                )}
                <div>
                  <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                    <span
                      data-tape-pct
                      data-skew
                      className="block font-display font-bold text-[clamp(64px,9vw,150px)] leading-[0.9] tracking-[-0.05em] text-white will-change-transform"
                    >
                      {t.pct}
                    </span>
                  </span>
                  <p data-tape-meta className="mt-3 font-mono text-[12px] sm:text-[13px] tracking-[0.2em] uppercase text-white/40 whitespace-nowrap">
                    {t.label} <span className="text-white/25">·</span>{" "}
                    <span className="text-white/60">{t.eth}</span>
                  </p>
                  {/* the ignition underline — fills as the release arrives */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-5 sm:px-10 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/35">
          Example 100 ETH raise · 2.5% platform fee per tranche · a 72h challenge window before each release
        </p>
        <a href="/whitepaper" data-cursor="link" className="ed-link font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/55 hover:text-white transition-colors whitespace-nowrap">
          Read §5 of the whitepaper ↗
        </a>
      </div>

      {/* the substance: how a claim works — one line */}
      <div className="max-w-[1500px] mx-auto px-5 sm:px-10 mt-16 sm:mt-20">
        <div className="grid sm:grid-cols-3 gap-x-10 gap-y-6 border-y border-white/[0.09] py-6">
          {[
            {
              n: "01",
              t: "Request",
              d: "When a tranche's time arrives, the founder requests it on-chain. Nothing releases automatically.",
            },
            {
              n: "02",
              t: "Window",
              d: "A 72-hour challenge window opens. Token holders can pause the schedule if something is wrong.",
            },
            {
              n: "03",
              t: "Claim",
              d: "If unchallenged, the founder claims — 97.5% to the founder, 2.5% to the platform.",
            },
          ].map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="font-mono text-[11px] text-accent pt-0.5">{s.n}</span>
              <div>
                <p className="font-display font-bold text-[14px] text-white tracking-tight uppercase">{s.t}</p>
                <p className="mt-1 text-white/55 font-sans font-light text-[13px] leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
