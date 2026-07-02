"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GREEN = "#91D982";
const BLUE = "#0D8BCA";
const AMBER = "#EC6800";

type Outcome = 0 | 1 | 2;

const TABS: { id: Outcome; label: string }[] = [
  { id: 0, label: "NO CHALLENGE" },
  { id: 1, label: "REJECTED" },
  { id: 2, label: "UPHELD" },
];

const OUTCOMES: Record<
  Outcome,
  { lines: React.ReactNode[]; sub: string }
> = {
  0: {
    lines: [
      <>The window passes quietly.</>,
      <>
        <span className="text-accent">97.5% releases</span> to the founder.
      </>,
    ],
    sub: "2.5% PLATFORM FEE · THE SCHEDULE CONTINUES",
  },
  1: {
    lines: [
      <>Review finds the project shipping.</>,
      <>
        <span className="text-persimmon-400">20% of the stake burns</span> to 0xdead.
      </>,
    ],
    sub: "80% RETURNS · 7-DAY COOLDOWN · THE TRANCHE STILL RELEASES",
  },
  2: {
    lines: [
      <>The project is dead or dishonest.</>,
      <>
        <span className="text-accent-bright">The campaign freezes</span> — permanently.
      </>,
    ],
    sub: "EVERY REMAINING TRANCHE BLOCKED · HOLDERS RECLAIM ESCROW PRO-RATA",
  },
};

/* ------------------------------------------------------------------ */
/* The living mechanism — a beam of light leaves ESCROW, dwells inside   */
/* the 72-HOUR WINDOW (an instrument-grade clock: tick ring, sweeping    */
/* hand, live countdown), then meets the HOLDER GATE — two weighted      */
/* bars on a guide rail. The window completing IS the release: the gate  */
/* parts the instant the countdown hits zero. A challenge is the only    */
/* thing that holds it shut — the challenger's STAKE chip appears at the */
/* gate; rejected, 20% of THE STAKE burns off (never the tranche) and    */
/* the beam still passes; upheld, the gate fuses into a blue bar and the */
/* beam returns to escrow. The machine narrates all three outcomes on    */
/* its own, in sequence; the tabs pin one.                               */
/* ------------------------------------------------------------------ */

const LINE_Y = 200;

// the window = a real clock
const WIN_CX = 430;
const WIN_CY = LINE_Y;
const WIN_R = 64; // tick ring radius
const ARC_R = 76; // sweeping hand orbit
const ARC_C = 2 * Math.PI * ARC_R;
const TICKS = Array.from({ length: 36 }, (_, i) => i);

// the conduit
const START_X = 86;
const JUNCTION_X = 620;
const CONDUIT_D = `M ${START_X} ${LINE_Y} L ${JUNCTION_X} ${LINE_Y}`;
const LEN_WINDOW = WIN_CX - START_X;
const FIBRE_LIT = 70;

// the gate — two weighted bars on a guide rail just after the window
const GATE_X = 566;
const GATE_HALF = 46; // each bar's length
const GATE_OPEN = 30; // how far each bar retracts when open
const GATE_REST = "rgba(236,104,0,0.6)";

// the escrow stack the beam departs from
const ESC_X = 34;
const ESC_W = 40;
const ESC_DASHES = [0, 1, 2, 3, 4];

// the challenger's stake chip at the gate
const STAKE_Y = 124;
const STAKE_SEGS = [0, 1, 2, 3, 4];

const BRANCH_IDS = ["pass", "reject", "uphold"] as const;
type BranchId = (typeof BRANCH_IDS)[number];

const BRANCH_D: Record<BranchId, string> = {
  pass: "M 620 200 C 770 200, 860 96, 965 96",
  reject: "M 620 200 L 965 200",
  uphold: "M 620 200 C 770 200, 860 304, 965 304",
};
const BRANCH_END: Record<BranchId, { x: number; y: number }> = {
  pass: { x: 965, y: 96 },
  reject: { x: 965, y: 200 },
  uphold: { x: 965, y: 304 },
};
const BRANCH_COLOR: Record<BranchId, string> = {
  pass: GREEN,
  reject: AMBER,
  uphold: BLUE,
};
const TRACK_D: Record<BranchId, string> = {
  pass: `M ${START_X} ${LINE_Y} L ${JUNCTION_X} ${LINE_Y} C 770 200, 860 96, 965 96`,
  reject: `M ${START_X} ${LINE_Y} L ${JUNCTION_X} ${LINE_Y} L 965 200`,
  uphold: `M ${START_X} ${LINE_Y} L ${JUNCTION_X} ${LINE_Y} C 770 200, 860 304, 965 304`,
};

const fmtCountdown = (hours: number) => {
  const clamped = Math.max(0, hours);
  const h = Math.floor(clamped);
  const m = Math.floor((clamped - h) * 60);
  const s = Math.floor(((clamped - h) * 60 - m) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

function ChallengeFlow({
  outcome,
  cycleNonce,
  onCycleEnd,
}: {
  outcome: Outcome;
  cycleNonce: number;
  onCycleEnd: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const onCycleEndRef = useRef(onCycleEnd);
  onCycleEndRef.current = onCycleEnd;

  // intro — conduit draws on, fixed marks fade in
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const rails = gsap.utils.toArray<SVGPathElement>("[data-cw-conduit]", root);
      rails.forEach((rail) => {
        const len = rail.getTotalLength();
        rail.style.strokeDasharray = String(len);
        rail.style.strokeDashoffset = String(len);
      });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 85%", toggleActions: "play none none reverse" },
      });
      tl.to(rails, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0);
      tl.fromTo("[data-cw-fixed]", { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.06 }, 0.2);
    }, root);
    return () => ctx.revert();
  }, []);

  // one narrated pass of the chosen outcome; completion hands control back
  // to the parent, which advances the story
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
    const branches = BRANCH_IDS.map((id) => q<SVGPathElement>(`[data-cw-branch="${id}"]`));
    const fibreGroups = BRANCH_IDS.map((id) => q<SVGGElement>(`[data-cw-fibre="${id}"]`));
    const fibreGlows = BRANCH_IDS.map((id) => q<SVGPathElement>(`[data-cw-fibre-glow="${id}"]`));
    const fibreCores = BRANCH_IDS.map((id) => q<SVGPathElement>(`[data-cw-fibre-core="${id}"]`));
    const ends = BRANCH_IDS.map((id) => q<SVGCircleElement>(`[data-cw-end="${id}"]`));
    const labels = BRANCH_IDS.map((id) => q<HTMLElement>(`[data-cw-label="${id}"]`));
    const gateT = q<SVGGElement>('[data-cw-gate="t"]');
    const gateB = q<SVGGElement>('[data-cw-gate="b"]');
    const gateBarT = q<SVGLineElement>("[data-cw-gatebar-t]");
    const gateBarB = q<SVGLineElement>("[data-cw-gatebar-b]");
    const challenged = q<SVGTextElement>("[data-cw-challenged]");
    const arc = q<SVGCircleElement>("[data-cw-arc]");
    const arcTrail = q<SVGCircleElement>("[data-cw-arc-trail]");
    const arcHead = q<SVGGElement>("[data-cw-arc-head]");
    const ring = q<SVGCircleElement>("[data-cw-ring]");
    const count = q<SVGTextElement>("[data-cw-count]");
    const stake = q<SVGGElement>("[data-cw-stake]");
    const stakeBurn = q<SVGRectElement>("[data-cw-stake-burn]");
    const escDashes = ESC_DASHES.map((i) => q<SVGRectElement>(`[data-cw-esc="${i}"]`));

    if (
      !arc || !arcTrail || !arcHead || !ring || !count || !gateT || !gateB ||
      !gateBarT || !gateBarB || !challenged || !stake || !stakeBurn ||
      branches.some((b) => !b) || fibreGroups.some((g) => !g) ||
      fibreGlows.some((g) => !g) || fibreCores.some((c) => !c) ||
      ends.some((e) => !e) || labels.some((l) => !l) || escDashes.some((d) => !d)
    )
      return;
    const paths = branches as SVGPathElement[];
    const tags = labels as HTMLElement[];
    const endDots = ends as SVGCircleElement[];
    const active = paths[outcome];
    const fGroup = fibreGroups[outcome] as SVGGElement;
    const fGlow = fibreGlows[outcome] as SVGPathElement;
    const fActive = [fibreGlows[outcome], fibreCores[outcome]] as SVGPathElement[];
    const total = (fibreCores[outcome] as SVGPathElement).getTotalLength();
    const dashes = escDashes as SVGRectElement[];

    gsap.set(fActive, { strokeDasharray: `${FIBRE_LIT} ${total + 2 * FIBRE_LIT}` });
    const rideTo = (len: number) => {
      const L = Math.max(0, Math.min(len, total));
      gsap.set(fActive, { strokeDashoffset: FIBRE_LIT / 2 - L });
    };
    (fibreGroups as SVGGElement[]).forEach((g, i) => gsap.set(g, { opacity: i === outcome ? 1 : 0 }));

    const cnt = { h: 72 };
    // Quantize the readout to ~12Hz. Written every frame, the digit positions
    // alias against the frame rate (72h compressed into a 2.6s sweep) and the
    // minutes-tens slot lands on the worst rhythm — near-random values every
    // frame that the eye reads as a blur. Held ~5 frames per value, every
    // position flickers uniformly and legibly.
    let cntTick = 0;
    const writeCountQuantized = () => {
      cntTick++;
      if (cnt.h > 0.001 && cntTick % 5 !== 0) return;
      count.textContent = fmtCountdown(cnt.h);
    };
    const writeCount = () => {
      count.textContent = fmtCountdown(cnt.h);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // static frame — beam dwelling at the window, gate state per outcome
      paths.forEach((p, i) => gsap.set(p, { opacity: i === outcome ? 1 : 0.4 }));
      tags.forEach((l, i) => gsap.set(l, { opacity: i === outcome ? 1 : 0.5 }));
      gsap.set([arc, arcHead], { opacity: 0 });
      gsap.set(arcTrail, { opacity: 0 });
      gsap.set(fGroup, { opacity: outcome === 2 ? 0.45 : 1 });
      gsap.set(fGlow, { strokeWidth: 7, opacity: 0.55 });
      rideTo(LEN_WINDOW);
      cnt.h = 0;
      writeCount();
      gsap.set(challenged, { opacity: outcome === 0 ? 0 : 0.9 });
      gsap.set(stake, { opacity: outcome === 0 ? 0 : 0.9 });
      if (outcome === 0) {
        gsap.set(ring, { stroke: AMBER, opacity: 1 });
        gsap.set(gateT, { y: -GATE_OPEN });
        gsap.set(gateB, { y: GATE_OPEN });
        gsap.set([gateBarT, gateBarB], { stroke: GATE_REST, strokeWidth: 3, opacity: 0.5 });
      } else if (outcome === 1) {
        gsap.set(ring, { stroke: AMBER, opacity: 1 });
        gsap.set([gateBarT, gateBarB], { stroke: AMBER, strokeWidth: 4, opacity: 1 });
      } else {
        gsap.set(ring, { stroke: BLUE, opacity: 1 });
        gsap.set([gateBarT, gateBarB], { stroke: BLUE, strokeWidth: 5, opacity: 1 });
      }
      return;
    }

    tags.forEach((l, i) => gsap.to(l, { opacity: i === outcome ? 1 : 0.4, duration: 0.35 }));

    gsap.killTweensOf([fGlow, stake, stakeBurn]);
    gsap.set(fGroup, { opacity: 1 });
    gsap.set(fGlow, { strokeWidth: 7, opacity: 0.55 });
    gsap.set(challenged, { opacity: 0 });
    gsap.set(stake, { opacity: 0, x: 0 });
    gsap.set(stakeBurn, { y: 0, opacity: 1, fill: "rgba(255,255,255,0.85)" });
    gsap.set([gateT, gateB], { y: 0 });
    gsap.set([gateBarT, gateBarB], { stroke: GATE_REST, strokeWidth: 3, opacity: 1 });
    gsap.set(ring, { stroke: AMBER, opacity: 1 });
    // clear the previous cycle's clock immediately — never show a full trail
    // against a reset countdown, even for a frame
    gsap.set(arcTrail, { opacity: 0, stroke: AMBER, strokeDasharray: `${ARC_C}`, strokeDashoffset: ARC_C });
    gsap.set(arc, { opacity: 0, stroke: AMBER, strokeDasharray: `${ARC_C}`, strokeDashoffset: ARC_C });
    gsap.set(arcHead, { opacity: 0, rotation: 0, svgOrigin: `${WIN_CX} ${WIN_CY}` });
    gsap.set(endDots, { opacity: 0.25, r: 3.5 });
    gsap.set(dashes, { opacity: 0.8 });
    cnt.h = 72;
    writeCount();
    rideTo(0);

    const tl = gsap.timeline({
      paused: false,
      scrollTrigger: { trigger: root, start: "top 80%", toggleActions: "play pause resume pause" },
      onComplete: () => onCycleEndRef.current(),
    });

    const flashTag = (at: number) =>
      tl.to(tags[outcome], { opacity: 0.3, duration: 0.16, repeat: 1, yoyo: true }, at);
    const openGate = (at: number) => {
      tl.to(gateT, { y: -GATE_OPEN, duration: 0.5, ease: "power3.inOut" }, at);
      tl.to(gateB, { y: GATE_OPEN, duration: 0.5, ease: "power3.inOut" }, at);
      tl.to([gateBarT, gateBarB], { opacity: 0.45, duration: 0.5 }, at);
    };

    /* ---- RESET (t = 0) ---- */
    tl.set(challenged, { opacity: 0 }, 0);
    tl.set([gateT, gateB], { y: 0 }, 0);
    tl.set([gateBarT, gateBarB], { stroke: GATE_REST, strokeWidth: 3, opacity: 1 }, 0);
    tl.set(fGroup, { opacity: 1 }, 0);
    tl.set(fGlow, { strokeWidth: 7, opacity: 0.55 }, 0);
    tl.set(ring, { stroke: AMBER, opacity: 1 }, 0);
    tl.set(arcTrail, { opacity: 0, strokeDasharray: `${ARC_C}`, strokeDashoffset: ARC_C }, 0);
    tl.set(arc, { opacity: 0, stroke: AMBER, strokeDasharray: `${ARC_C}`, strokeDashoffset: ARC_C }, 0);
    tl.set(arcHead, { opacity: 0, rotation: 0, svgOrigin: `${WIN_CX} ${WIN_CY}` }, 0);
    paths.forEach((p) => tl.set(p, { opacity: 0.15 }, 0));

    const pos = { l: 0 };
    tl.set(pos, { l: 0 }, 0);
    const onRide = () => rideTo(pos.l);
    tl.call(() => rideTo(0), undefined, 0);

    /* ---- STAGE A (0–1.0s): the tranche leaves escrow ---- */
    tl.to(dashes[4], { opacity: 0.12, duration: 0.4, ease: "power1.in" }, 0.05);
    tl.to(pos, { l: LEN_WINDOW, duration: 1.0, ease: "power2.inOut", onUpdate: onRide }, 0);

    /* ---- STAGE B — THE 72H WINDOW (1.0–3.6s) = TIME ----
       The hand sweeps the ring, the countdown runs 72:00:00 → 00:00:00,
       the elapsed trail fills behind the hand, the dwelling beam breathes. */
    const WIN_START = 1.0;
    const WIN_END = 3.6;
    const WIN_DUR = WIN_END - WIN_START;
    tl.set([arc, arcHead], { opacity: 0.95 }, WIN_START);
    tl.set(arcTrail, { opacity: 0.16 }, WIN_START);
    tl.to([arc, arcTrail], { strokeDashoffset: 0, duration: WIN_DUR, ease: "none" }, WIN_START);
    tl.to(arcHead, { rotation: 360, duration: WIN_DUR, ease: "none", svgOrigin: `${WIN_CX} ${WIN_CY}` }, WIN_START);
    tl.to(cnt, { h: 0, duration: WIN_DUR, ease: "none", onUpdate: writeCountQuantized }, WIN_START);
    tl.to(fGlow, { strokeWidth: 11, opacity: 0.85, duration: 0.85, ease: "sine.inOut", yoyo: true, repeat: 1 }, WIN_START + 0.2);
    tl.fromTo(active, { opacity: 0.15 }, { opacity: 0.3, duration: WIN_DUR, ease: "none" }, WIN_START);

    if (outcome !== 0) {
      // a challenge is raised mid-window — the stake chip lands at the gate,
      // the bars flush persimmon, CHALLENGED flashes
      tl.fromTo(stake, { opacity: 0, y: -10 }, { opacity: 0.95, y: 0, duration: 0.3, ease: "power2.out" }, 1.6);
      tl.to([gateBarT, gateBarB], { stroke: AMBER, strokeWidth: 4, duration: 0.2, ease: "none" }, 1.6);
      tl.fromTo(challenged, { opacity: 0 }, { opacity: 0.95, duration: 0.18, ease: "none" }, 1.6);
      tl.to(challenged, { opacity: 0.6, duration: 0.4, ease: "none" }, 1.85);
    }

    /* ---- STAGE C — the countdown hits zero → the gate decides ---- */
    const RES = WIN_END;
    let END = RES;
    tl.set(arcHead, { opacity: 0 }, RES);

    if (outcome === 0) {
      // NO CHALLENGE — zero on the clock IS the release
      openGate(RES);
      tl.to(pos, { l: total, duration: 1.9, ease: "power1.inOut", onUpdate: onRide }, RES + 0.45);
      tl.to(active, { opacity: 0.65, duration: 0.5, ease: "none" }, RES + 0.7);
      tl.to(fGlow, { strokeWidth: 9, opacity: 0.9, duration: 0.5, ease: "power1.out" }, RES + 0.45);
      tl.to(endDots[0], { opacity: 1, r: 5, duration: 0.3, ease: "power2.out" }, RES + 2.1);
      flashTag(RES + 2.0);
      END = RES + 2.8;
    }
    if (outcome === 1) {
      // REJECTED — the challenge dismisses: 20% of THE STAKE burns off, the
      // rest returns, the gate opens, the beam still passes
      tl.to([gateBarT, gateBarB], { stroke: "rgba(255,255,255,0.9)", strokeWidth: 4, duration: 0.14, ease: "none" }, RES);
      tl.to(challenged, { opacity: 0, duration: 0.25, ease: "none" }, RES + 0.1);
      tl.to(stakeBurn, { y: 34, opacity: 0, fill: AMBER, duration: 0.7, ease: "power2.in" }, RES + 0.15);
      tl.to(stake, { x: -46, opacity: 0, duration: 0.6, ease: "power2.inOut" }, RES + 0.75);
      tl.to([gateBarT, gateBarB], { stroke: GATE_REST, strokeWidth: 3, duration: 0.35, ease: "none" }, RES + 0.2);
      openGate(RES + 0.7);
      tl.to(pos, { l: total, duration: 1.9, ease: "power1.inOut", onUpdate: onRide }, RES + 1.1);
      tl.to(active, { opacity: 0.65, duration: 0.5, ease: "none" }, RES + 1.2);
      tl.to(endDots[1], { opacity: 1, r: 5, duration: 0.3, ease: "power2.out" }, RES + 2.8);
      flashTag(RES + 2.6);
      END = RES + 3.3;
    }
    if (outcome === 2) {
      // UPHELD — the challenge holds: the bars fuse into a blue lock, the
      // beam reverses into escrow (the dash relights — nothing released)
      tl.to([gateBarT, gateBarB], { stroke: BLUE, strokeWidth: 5, duration: 0.3, ease: "power1.in" }, RES + 0.05);
      tl.to(challenged, { opacity: 0, duration: 0.3, ease: "none" }, RES + 0.1);
      tl.to(stake, { x: -46, opacity: 0, duration: 0.6, ease: "power2.inOut" }, RES + 0.5);
      tl.to(ring, { stroke: BLUE, duration: 0.45, ease: "power2.out" }, RES + 0.35);
      tl.to([arc, arcTrail], { stroke: BLUE, duration: 0.45, ease: "none" }, RES + 0.35);
      tl.to(pos, { l: 0, duration: 1.5, ease: "power2.inOut", onUpdate: onRide }, RES + 0.7);
      tl.to(dashes[4], { opacity: 0.8, duration: 0.4, ease: "power1.out" }, RES + 2.1);
      tl.to(fGroup, { opacity: 0, duration: 0.6, ease: "power1.in" }, RES + 1.8);
      flashTag(RES + 1.2);
      END = RES + 2.8;
    }
    // hold the resolved frame a beat before the story advances
    tl.to({}, { duration: 1.0 }, END);

    return () => {
      gsap.killTweensOf(tags);
      gsap.killTweensOf([fGlow, stake, stakeBurn]);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [outcome, cycleNonce]);

  return (
    <div ref={rootRef} className="relative">
      <svg
        viewBox="0 0 1200 400"
        className="w-full"
        role="img"
        aria-label="A beam of light leaves an escrow stack and pauses inside the 72-hour window — a clock with a tick ring, a sweeping hand, and a live countdown. A weighted two-bar gate sits just after the window. With no challenge, the gate opens the instant the countdown hits zero and the beam glides through to the founder. A challenge places the challenger's stake at the gate: rejected, twenty percent of the stake burns off, the rest returns, and the beam still passes; upheld, the gate fuses into a blue lock and the beam returns to escrow."
      >
        <defs>
          <filter id="edcw-beam-blur" x="-60%" y="-400%" width="220%" height="900%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        {/* ESCROW — the stack the beam departs from and returns to */}
        <g data-cw-fixed>
          {ESC_DASHES.map((i) => (
            <rect
              key={i}
              data-cw-esc={i}
              x={ESC_X}
              y={LINE_Y - 18 + i * 8}
              width={ESC_W}
              height="2.5"
              fill="rgba(255,255,255,0.6)"
              opacity="0.8"
            />
          ))}
          <text x={ESC_X} y={LINE_Y - 34} className="font-mono" fontSize="12" letterSpacing="2" fill="rgba(255,255,255,0.7)">
            ESCROW
          </text>
          <text x={ESC_X} y={LINE_Y + 38} className="font-mono" fontSize="10" letterSpacing="1.5" fill="rgba(255,255,255,0.38)">
            TRANCHE REQUESTED
          </text>
        </g>

        {/* the conduit + fine ruler ticks (instrumented ground) */}
        <path data-cw-conduit d={CONDUIT_D} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
        <g data-cw-fixed>
          {Array.from({ length: 8 }, (_, i) => 130 + i * 60).map(
            (x) =>
              Math.abs(x - WIN_CX) > WIN_R + 14 &&
              Math.abs(x - GATE_X) > 12 && (
                <line key={x} x1={x} y1={LINE_Y + 4} x2={x} y2={LINE_Y + 9} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
              )
          )}
        </g>

        {/* THE WINDOW — instrument clock: tick ring, sweeping hand, countdown */}
        <g data-cw-fixed>
          {TICKS.map((i) => {
            const major = i % 6 === 0;
            const a = (i / TICKS.length) * Math.PI * 2 - Math.PI / 2;
            const r0 = WIN_R + 3;
            const r1 = WIN_R + (major ? 9 : 6);
            return (
              <line
                key={i}
                x1={WIN_CX + Math.cos(a) * r0}
                y1={WIN_CY + Math.sin(a) * r0}
                x2={WIN_CX + Math.cos(a) * r1}
                y2={WIN_CY + Math.sin(a) * r1}
                stroke={major ? AMBER : "rgba(255,255,255,0.25)"}
                strokeWidth={major ? 1.4 : 1}
                opacity={major ? 0.8 : 0.6}
              />
            );
          })}
          <circle data-cw-ring cx={WIN_CX} cy={WIN_CY} r={WIN_R} fill="none" stroke={AMBER} strokeWidth="1.25" opacity="0.85" />
          <text
            data-cw-count
            x={WIN_CX}
            y={WIN_CY - 8}
            textAnchor="middle"
            className="font-mono font-bold"
            fontSize="17"
            letterSpacing="1.5"
            fill="rgba(255,255,255,0.92)"
          >
            72:00:00
          </text>
          <text x={WIN_CX} y={WIN_CY + 14} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="2.6" fill={AMBER}>
            THE WINDOW
          </text>
          <text x={WIN_CX} y={WIN_CY + 30} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.4)">
            72 HOURS
          </text>
        </g>

        {/* elapsed trail + sweeping hand */}
        <circle
          data-cw-arc-trail
          cx={WIN_CX}
          cy={WIN_CY}
          r={ARC_R}
          fill="none"
          stroke={AMBER}
          strokeWidth="7"
          opacity="0"
          transform={`rotate(-90 ${WIN_CX} ${WIN_CY})`}
        />
        <circle
          data-cw-arc
          cx={WIN_CX}
          cy={WIN_CY}
          r={ARC_R}
          fill="none"
          stroke={AMBER}
          strokeWidth="2"
          opacity="0"
          transform={`rotate(-90 ${WIN_CX} ${WIN_CY})`}
        />
        <g data-cw-arc-head opacity="0">
          <circle cx={WIN_CX} cy={WIN_CY - ARC_R} r="3.5" fill={AMBER} />
        </g>

        {/* branches — faint until the beam rides one */}
        {BRANCH_IDS.map((id) => (
          <path key={id} data-cw-branch={id} d={BRANCH_D[id]} fill="none" stroke={BRANCH_COLOR[id]} strokeWidth="2.25" opacity="0.15" />
        ))}
        {/* terminal marks */}
        {BRANCH_IDS.map((id) => (
          <circle key={`end-${id}`} data-cw-end={id} cx={BRANCH_END[id].x} cy={BRANCH_END[id].y} r="3.5" fill={BRANCH_COLOR[id]} opacity="0.25" />
        ))}

        {/* THE GATE — two weighted bars on a guide rail */}
        <g data-cw-fixed>
          <line x1={GATE_X} y1={LINE_Y - GATE_HALF - GATE_OPEN - 10} x2={GATE_X} y2={LINE_Y + GATE_HALF + GATE_OPEN + 10} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 4" />
          <g data-cw-gate="t">
            <line data-cw-gatebar-t x1={GATE_X} y1={LINE_Y - GATE_HALF} x2={GATE_X} y2={LINE_Y - 4} stroke={GATE_REST} strokeWidth="3" />
            <line x1={GATE_X - 4} y1={LINE_Y - GATE_HALF} x2={GATE_X + 4} y2={LINE_Y - GATE_HALF} stroke={GATE_REST} strokeWidth="2" />
          </g>
          <g data-cw-gate="b">
            <line data-cw-gatebar-b x1={GATE_X} y1={LINE_Y + 4} x2={GATE_X} y2={LINE_Y + GATE_HALF} stroke={GATE_REST} strokeWidth="3" />
            <line x1={GATE_X - 4} y1={LINE_Y + GATE_HALF} x2={GATE_X + 4} y2={LINE_Y + GATE_HALF} stroke={GATE_REST} strokeWidth="2" />
          </g>
          <text x={GATE_X} y={LINE_Y + GATE_HALF + GATE_OPEN + 26} textAnchor="middle" className="font-mono" fontSize="10" letterSpacing="2" fill="rgba(255,255,255,0.4)">
            HOLDER GATE
          </text>
        </g>

        {/* the challenger's stake — a segmented chip that lands at the gate;
            on rejection its last segment burns off (the stake, not the tranche) */}
        <g data-cw-stake opacity="0">
          {STAKE_SEGS.map((i) => (
            <rect
              key={i}
              data-cw-stake-seg={i}
              {...(i === STAKE_SEGS.length - 1 ? { "data-cw-stake-burn": true } : {})}
              x={GATE_X - 19 + i * 8}
              y={STAKE_Y}
              width="6"
              height="12"
              fill="rgba(255,255,255,0.85)"
            />
          ))}
          <text x={GATE_X} y={STAKE_Y - 8} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.5)">
            STAKE
          </text>
        </g>

        {/* the challenge flag */}
        <text
          data-cw-challenged
          x={GATE_X}
          y={STAKE_Y - 26}
          textAnchor="middle"
          className="font-mono"
          fontSize="10"
          letterSpacing="2"
          fill={AMBER}
          opacity="0"
        >
          CHALLENGED
        </text>

        {/* THE BEAM — the line itself conducts the light */}
        {BRANCH_IDS.map((id) => (
          <g key={`fibre-${id}`} data-cw-fibre={id} style={{ opacity: 0 }}>
            <path data-cw-fibre-glow={id} d={TRACK_D[id]} fill="none" stroke="#91D982" strokeWidth="7" strokeLinecap="round" opacity="0.55" filter="url(#edcw-beam-blur)" />
            <path data-cw-fibre-core={id} d={TRACK_D[id]} fill="none" stroke="#E8FBE2" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </svg>

      {/* HTML outcome labels aligned to branch ends */}
      <div
        data-cw-label="pass"
        className="absolute left-[84%] top-[calc(24%-9px)] w-[16%] font-mono text-[10px] lg:text-[11px] tracking-[0.14em] uppercase leading-relaxed"
      >
        <span className="inline-block bg-black/80 px-1 -ml-1 text-accent">No challenge</span>
        <br />
        <span className="text-white/55">97.5% → founder · schedule continues</span>
      </div>
      <div
        data-cw-label="reject"
        className="absolute left-[84%] top-[calc(50%-9px)] w-[16%] font-mono text-[10px] lg:text-[11px] tracking-[0.14em] uppercase leading-relaxed"
      >
        <span className="inline-block bg-black/80 px-1 -ml-1 text-persimmon-400">Rejected</span>
        <br />
        <span className="text-white/55">20% of stake burns · tranche releases</span>
      </div>
      <div
        data-cw-label="uphold"
        className="absolute left-[84%] top-[calc(76%-9px)] w-[16%] font-mono text-[10px] lg:text-[11px] tracking-[0.14em] uppercase leading-relaxed"
      >
        <span className="inline-block bg-black/80 px-1 -ml-1 text-accent-bright">Upheld — frozen</span>
        <br />
        <span className="text-white/55">Escrow reopens to holders pro-rata</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — the challenge window. The machine narrates all three outcomes    */
/* in sequence, statement and diagram in lockstep; the tabs pin one.     */
/* ------------------------------------------------------------------ */

const PIN_MS = 14000;

export function EdChallengeWindow() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [outcome, setOutcome] = useState<Outcome>(0);
  const [cycleNonce, setCycleNonce] = useState(0);
  const pinnedUntilRef = useRef(0);

  const handleCycleEnd = useCallback(() => {
    if (Date.now() < pinnedUntilRef.current) {
      setCycleNonce((n) => n + 1); // replay the pinned outcome
      return;
    }
    setOutcome((o) => ((o + 1) % 3) as Outcome);
  }, []);

  const pick = (id: Outcome) => {
    pinnedUntilRef.current = Date.now() + PIN_MS;
    setOutcome((prev) => {
      if (prev === id) setCycleNonce((n) => n + 1);
      return id;
    });
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = stage.querySelectorAll("[data-out-line]");
    const sub = stage.querySelector("[data-out-sub]");
    const tl = gsap.timeline();
    tl.fromTo(lines, { yPercent: 112 }, { yPercent: 0, duration: 0.65, stagger: 0.09, ease: "power4.out" });
    tl.fromTo(sub, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.3);
    return () => {
      tl.kill();
    };
  }, [outcome]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-cw-in]",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 72%", toggleActions: "play none none reverse" },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-5 sm:px-10 border-t border-white/[0.08]">
      <div className="max-w-[1500px] mx-auto">
        <p data-cw-in className="font-mono text-[11px] tracking-[0.32em] uppercase mb-6">
          <span className="text-accent">03</span>
          <span className="text-white/40"> — The challenge window</span>
        </p>

        <div data-cw-in>
          <h2 className="font-display font-bold tracking-[-0.04em] leading-[0.98] text-[clamp(40px,6.4vw,96px)] text-white">
            EVERY RELEASE
            <br />
            CAN BE <span className="text-accent">challenged.</span>
          </h2>
          <p className="mt-6 max-w-[560px] text-muted font-sans font-light text-[15px] sm:text-base leading-relaxed">
            Before any tranche after the kickstart can be claimed, a 72-hour window opens.
            Holders with enough stake can challenge — and the contract, not the platform,
            enforces what happens next.
          </p>
        </div>

        {/* the outcome index — the machine cycles it; clicking pins one */}
        <div data-cw-in className="mt-14 sm:mt-16 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-white/[0.09] py-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              data-cursor="link"
              onClick={() => pick(tab.id)}
              aria-pressed={outcome === tab.id}
              className={`relative font-display font-bold tracking-[-0.02em] text-[clamp(18px,2.4vw,36px)] transition-colors duration-300 ${
                outcome === tab.id ? "text-white" : "text-white/25 hover:text-white/60"
              }`}
            >
              {tab.label}
              <span
                className={`absolute -bottom-[7px] left-0 h-[3px] bg-accent transition-all duration-[400ms] ${
                  outcome === tab.id ? "w-full" : "w-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* the statement */}
        <div ref={stageRef} className="mt-12 sm:mt-14 min-h-[180px] sm:min-h-[230px]">
          {OUTCOMES[outcome].lines.map((line, i) => (
            <span key={`${outcome}-${i}`} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span
                data-out-line
                className="block font-display font-bold tracking-[-0.035em] leading-[1.06] text-[clamp(28px,4.6vw,68px)] text-white will-change-transform"
              >
                {line}
              </span>
            </span>
          ))}
          <p data-out-sub key={`sub-${outcome}`} className="mt-6 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/40">
            {OUTCOMES[outcome].sub}
          </p>
        </div>

        {/* the living mechanism */}
        <div data-cw-in className="mt-14 hidden sm:block">
          <ChallengeFlow outcome={outcome} cycleNonce={cycleNonce} onCycleEnd={handleCycleEnd} />
        </div>

        {/* the rulebook — three columns, one reading line */}
        <div data-cw-in className="mt-14 grid sm:grid-cols-3 gap-x-10 gap-y-7 border-t border-white/[0.1] pt-7">
          {[
            {
              k: "Stake to challenge",
              v: "Graduated by tranche: 0.25% of supply early, 0.50% mid, 1.00% late — rising as the founder earns a track record.",
            },
            {
              k: "While under review",
              v: "The stake locks in escrow and any holder can signal support on-chain. Review is bounded: only these three outcomes exist.",
            },
            {
              k: "Griefing has a price",
              v: "A rejected challenger loses 20% and sits out a 7-day cooldown. Honest founders can’t be held hostage; dishonest ones can’t run out the clock.",
            },
          ].map((r) => (
            <div key={r.k}>
              <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/40">{r.k}</p>
              <p className="mt-2 text-white/60 font-sans font-light text-[13.5px] leading-relaxed">{r.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
