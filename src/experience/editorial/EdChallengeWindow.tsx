"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChapterHead } from "../ui/ChapterHead";

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

const TICKS = Array.from({ length: 36 }, (_, i) => i);
const GATE_REST = "rgba(236,104,0,0.6)";
const ESC_DASHES = [0, 1, 2, 3, 4];
const STAKE_SEGS = [0, 1, 2, 3, 4];

const BRANCH_IDS = ["pass", "reject", "uphold"] as const;
type BranchId = (typeof BRANCH_IDS)[number];

const BRANCH_COLOR: Record<BranchId, string> = {
  pass: GREEN,
  reject: AMBER,
  uphold: BLUE,
};

/* The instrument exists at two scales: the full 1200-unit flow for ≥sm and
   a compact 400-unit variant that fits a phone at ~1:1 (the countdown stays
   ~16px). Same topology, same data attributes, same timeline — only the
   geometry differs. */
type FlowGeomBase = {
  compact: boolean;
  viewBox: string;
  lineY: number;
  winCx: number;
  winR: number; // tick ring radius
  arcR: number; // sweeping hand orbit
  startX: number;
  junctionX: number;
  gateX: number;
  gateHalf: number; // each bar's length
  gateOpen: number; // how far each bar retracts when open
  escX: number;
  escW: number;
  stakeY: number;
  fibreLit: number;
  stakeExit: number; // the dismissed stake's exit slide
  burnDrop: number; // how far the burnt segment falls
  rulerXs: number[];
  branchTail: Record<BranchId, string>;
  branchEnd: Record<BranchId, { x: number; y: number }>;
};
type FlowGeom = FlowGeomBase & {
  winCy: number;
  arcC: number;
  conduitD: string;
  lenWindow: number;
  branchD: Record<BranchId, string>;
  trackD: Record<BranchId, string>;
};

const makeGeom = (g: FlowGeomBase): FlowGeom => ({
  ...g,
  winCy: g.lineY,
  arcC: 2 * Math.PI * g.arcR,
  conduitD: `M ${g.startX} ${g.lineY} L ${g.junctionX} ${g.lineY}`,
  lenWindow: g.winCx - g.startX,
  branchD: {
    pass: `M ${g.junctionX} ${g.lineY} ${g.branchTail.pass}`,
    reject: `M ${g.junctionX} ${g.lineY} ${g.branchTail.reject}`,
    uphold: `M ${g.junctionX} ${g.lineY} ${g.branchTail.uphold}`,
  },
  trackD: {
    pass: `M ${g.startX} ${g.lineY} L ${g.junctionX} ${g.lineY} ${g.branchTail.pass}`,
    reject: `M ${g.startX} ${g.lineY} L ${g.junctionX} ${g.lineY} ${g.branchTail.reject}`,
    uphold: `M ${g.startX} ${g.lineY} L ${g.junctionX} ${g.lineY} ${g.branchTail.uphold}`,
  },
});

const GEOM_DESKTOP = makeGeom({
  compact: false,
  viewBox: "0 0 1200 400",
  lineY: 200,
  winCx: 430,
  winR: 64,
  arcR: 76,
  startX: 86,
  junctionX: 620,
  gateX: 566,
  gateHalf: 46,
  gateOpen: 30,
  escX: 34,
  escW: 40,
  stakeY: 124,
  fibreLit: 70,
  stakeExit: -46,
  burnDrop: 34,
  rulerXs: Array.from({ length: 8 }, (_, i) => 130 + i * 60),
  branchTail: {
    pass: "C 770 200, 860 96, 965 96",
    reject: "L 965 200",
    uphold: "C 770 200, 860 304, 965 304",
  },
  branchEnd: {
    pass: { x: 965, y: 96 },
    reject: { x: 965, y: 200 },
    uphold: { x: 965, y: 304 },
  },
});

const GEOM_COMPACT = makeGeom({
  compact: true,
  viewBox: "0 0 400 288",
  lineY: 168,
  winCx: 190,
  winR: 50,
  arcR: 60,
  startX: 64,
  junctionX: 330,
  gateX: 292,
  gateHalf: 34,
  gateOpen: 22,
  escX: 12,
  escW: 34,
  stakeY: 100,
  fibreLit: 40,
  stakeExit: -32,
  burnDrop: 24,
  rulerXs: [104, 132, 260],
  branchTail: {
    pass: "C 352 168, 360 122, 386 118",
    reject: "L 386 168",
    uphold: "C 352 168, 360 214, 386 218",
  },
  branchEnd: {
    pass: { x: 386, y: 118 },
    reject: { x: 386, y: 168 },
    uphold: { x: 386, y: 218 },
  },
});

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
  compact = false,
}: {
  outcome: Outcome;
  cycleNonce: number;
  onCycleEnd: () => void;
  compact?: boolean;
}) {
  const G = compact ? GEOM_COMPACT : GEOM_DESKTOP;
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

    gsap.set(fActive, { strokeDasharray: `${G.fibreLit} ${total + 2 * G.fibreLit}` });
    const rideTo = (len: number) => {
      const L = Math.max(0, Math.min(len, total));
      gsap.set(fActive, { strokeDashoffset: G.fibreLit / 2 - L });
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
      rideTo(G.lenWindow);
      cnt.h = 0;
      writeCount();
      gsap.set(challenged, { opacity: outcome === 0 ? 0 : 0.9 });
      gsap.set(stake, { opacity: outcome === 0 ? 0 : 0.9 });
      if (outcome === 0) {
        gsap.set(ring, { stroke: AMBER, opacity: 1 });
        gsap.set(gateT, { y: -G.gateOpen });
        gsap.set(gateB, { y: G.gateOpen });
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
    gsap.set(arcTrail, { opacity: 0, stroke: AMBER, strokeDasharray: `${G.arcC}`, strokeDashoffset: G.arcC });
    gsap.set(arc, { opacity: 0, stroke: AMBER, strokeDasharray: `${G.arcC}`, strokeDashoffset: G.arcC });
    gsap.set(arcHead, { opacity: 0, rotation: 0, svgOrigin: `${G.winCx} ${G.winCy}` });
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
      tl.to(gateT, { y: -G.gateOpen, duration: 0.5, ease: "power3.inOut" }, at);
      tl.to(gateB, { y: G.gateOpen, duration: 0.5, ease: "power3.inOut" }, at);
      tl.to([gateBarT, gateBarB], { opacity: 0.45, duration: 0.5 }, at);
    };

    /* ---- RESET (t = 0) ---- */
    tl.set(challenged, { opacity: 0 }, 0);
    tl.set([gateT, gateB], { y: 0 }, 0);
    tl.set([gateBarT, gateBarB], { stroke: GATE_REST, strokeWidth: 3, opacity: 1 }, 0);
    tl.set(fGroup, { opacity: 1 }, 0);
    tl.set(fGlow, { strokeWidth: 7, opacity: 0.55 }, 0);
    tl.set(ring, { stroke: AMBER, opacity: 1 }, 0);
    tl.set(arcTrail, { opacity: 0, strokeDasharray: `${G.arcC}`, strokeDashoffset: G.arcC }, 0);
    tl.set(arc, { opacity: 0, stroke: AMBER, strokeDasharray: `${G.arcC}`, strokeDashoffset: G.arcC }, 0);
    tl.set(arcHead, { opacity: 0, rotation: 0, svgOrigin: `${G.winCx} ${G.winCy}` }, 0);
    paths.forEach((p) => tl.set(p, { opacity: 0.15 }, 0));

    const pos = { l: 0 };
    tl.set(pos, { l: 0 }, 0);
    const onRide = () => rideTo(pos.l);
    tl.call(() => rideTo(0), undefined, 0);

    /* ---- STAGE A (0–1.0s): the tranche leaves escrow ---- */
    tl.to(dashes[4], { opacity: 0.12, duration: 0.4, ease: "power1.in" }, 0.05);
    tl.to(pos, { l: G.lenWindow, duration: 1.0, ease: "power2.inOut", onUpdate: onRide }, 0);

    /* ---- STAGE B — THE 72H WINDOW (1.0–3.6s) = TIME ----
       The hand sweeps the ring, the countdown runs 72:00:00 → 00:00:00,
       the elapsed trail fills behind the hand, the dwelling beam breathes. */
    const WIN_START = 1.0;
    const WIN_END = 3.6;
    const WIN_DUR = WIN_END - WIN_START;
    tl.set([arc, arcHead], { opacity: 0.95 }, WIN_START);
    tl.set(arcTrail, { opacity: 0.16 }, WIN_START);
    tl.to([arc, arcTrail], { strokeDashoffset: 0, duration: WIN_DUR, ease: "none" }, WIN_START);
    tl.to(arcHead, { rotation: 360, duration: WIN_DUR, ease: "none", svgOrigin: `${G.winCx} ${G.winCy}` }, WIN_START);
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
      tl.to(stakeBurn, { y: G.burnDrop, opacity: 0, fill: AMBER, duration: 0.7, ease: "power2.in" }, RES + 0.15);
      tl.to(stake, { x: G.stakeExit, opacity: 0, duration: 0.6, ease: "power2.inOut" }, RES + 0.75);
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
      tl.to(stake, { x: G.stakeExit, opacity: 0, duration: 0.6, ease: "power2.inOut" }, RES + 0.5);
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
        viewBox={G.viewBox}
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
              x={G.escX}
              y={G.lineY - 18 + i * 8}
              width={G.escW}
              height="2.5"
              fill="rgba(255,255,255,0.6)"
              opacity="0.8"
            />
          ))}
          <text x={G.escX} y={G.lineY - (G.compact ? 28 : 34)} className="font-mono" fontSize={G.compact ? 10 : 12} letterSpacing="2" fill="rgba(255,255,255,0.7)">
            ESCROW
          </text>
          <text x={G.escX} y={G.lineY + (G.compact ? 32 : 38)} className="font-mono" fontSize={G.compact ? 8 : 10} letterSpacing="1.5" fill="rgba(255,255,255,0.38)">
            TRANCHE REQUESTED
          </text>
        </g>

        {/* the conduit + fine ruler ticks (instrumented ground) */}
        <path data-cw-conduit d={G.conduitD} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
        <g data-cw-fixed>
          {G.rulerXs.map(
            (x) =>
              Math.abs(x - G.winCx) > G.winR + 14 &&
              Math.abs(x - G.gateX) > 12 && (
                <line key={x} x1={x} y1={G.lineY + 4} x2={x} y2={G.lineY + 9} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
              )
          )}
        </g>

        {/* THE WINDOW — instrument clock: tick ring, sweeping hand, countdown */}
        <g data-cw-fixed>
          {TICKS.map((i) => {
            const major = i % 6 === 0;
            const a = (i / TICKS.length) * Math.PI * 2 - Math.PI / 2;
            const r0 = G.winR + 3;
            const r1 = G.winR + (major ? 9 : 6);
            return (
              <line
                key={i}
                x1={G.winCx + Math.cos(a) * r0}
                y1={G.winCy + Math.sin(a) * r0}
                x2={G.winCx + Math.cos(a) * r1}
                y2={G.winCy + Math.sin(a) * r1}
                stroke={major ? AMBER : "rgba(255,255,255,0.25)"}
                strokeWidth={major ? 1.4 : 1}
                opacity={major ? 0.8 : 0.6}
              />
            );
          })}
          <circle data-cw-ring cx={G.winCx} cy={G.winCy} r={G.winR} fill="none" stroke={AMBER} strokeWidth="1.25" opacity="0.85" />
          <text
            data-cw-count
            x={G.winCx}
            y={G.winCy - 8}
            textAnchor="middle"
            className="font-mono font-bold"
            fontSize="17"
            letterSpacing="1.5"
            fill="rgba(255,255,255,0.92)"
          >
            72:00:00
          </text>
          <text x={G.winCx} y={G.winCy + 14} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="2.6" fill={AMBER}>
            THE WINDOW
          </text>
          <text x={G.winCx} y={G.winCy + 30} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.4)">
            72 HOURS
          </text>
        </g>

        {/* elapsed trail + sweeping hand */}
        <circle
          data-cw-arc-trail
          cx={G.winCx}
          cy={G.winCy}
          r={G.arcR}
          fill="none"
          stroke={AMBER}
          strokeWidth="7"
          opacity="0"
          transform={`rotate(-90 ${G.winCx} ${G.winCy})`}
        />
        <circle
          data-cw-arc
          cx={G.winCx}
          cy={G.winCy}
          r={G.arcR}
          fill="none"
          stroke={AMBER}
          strokeWidth="2"
          opacity="0"
          transform={`rotate(-90 ${G.winCx} ${G.winCy})`}
        />
        <g data-cw-arc-head opacity="0">
          <circle cx={G.winCx} cy={G.winCy - G.arcR} r="3.5" fill={AMBER} />
        </g>

        {/* branches — faint until the beam rides one */}
        {BRANCH_IDS.map((id) => (
          <path key={id} data-cw-branch={id} d={G.branchD[id]} fill="none" stroke={BRANCH_COLOR[id]} strokeWidth="2.25" opacity="0.15" />
        ))}
        {/* terminal marks */}
        {BRANCH_IDS.map((id) => (
          <circle key={`end-${id}`} data-cw-end={id} cx={G.branchEnd[id].x} cy={G.branchEnd[id].y} r="3.5" fill={BRANCH_COLOR[id]} opacity="0.25" />
        ))}

        {/* THE GATE — two weighted bars on a guide rail */}
        <g data-cw-fixed>
          <line x1={G.gateX} y1={G.lineY - G.gateHalf - G.gateOpen - 10} x2={G.gateX} y2={G.lineY + G.gateHalf + G.gateOpen + 10} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 4" />
          <g data-cw-gate="t">
            <line data-cw-gatebar-t x1={G.gateX} y1={G.lineY - G.gateHalf} x2={G.gateX} y2={G.lineY - 4} stroke={GATE_REST} strokeWidth="3" />
            <line x1={G.gateX - 4} y1={G.lineY - G.gateHalf} x2={G.gateX + 4} y2={G.lineY - G.gateHalf} stroke={GATE_REST} strokeWidth="2" />
          </g>
          <g data-cw-gate="b">
            <line data-cw-gatebar-b x1={G.gateX} y1={G.lineY + 4} x2={G.gateX} y2={G.lineY + G.gateHalf} stroke={GATE_REST} strokeWidth="3" />
            <line x1={G.gateX - 4} y1={G.lineY + G.gateHalf} x2={G.gateX + 4} y2={G.lineY + G.gateHalf} stroke={GATE_REST} strokeWidth="2" />
          </g>
          <text x={G.gateX} y={G.lineY + G.gateHalf + G.gateOpen + (G.compact ? 22 : 26)} textAnchor="middle" className="font-mono" fontSize={G.compact ? 9 : 10} letterSpacing="2" fill="rgba(255,255,255,0.4)">
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
              x={G.gateX - 19 + i * 8}
              y={G.stakeY}
              width="6"
              height="12"
              fill="rgba(255,255,255,0.85)"
            />
          ))}
          <text x={G.gateX} y={G.stakeY - 8} textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.5)">
            STAKE
          </text>
        </g>

        {/* the challenge flag */}
        <text
          data-cw-challenged
          x={G.gateX}
          y={G.stakeY - (G.compact ? 22 : 26)}
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
            <path data-cw-fibre-glow={id} d={G.trackD[id]} fill="none" stroke="#91D982" strokeWidth="7" strokeLinecap="round" opacity="0.55" filter="url(#edcw-beam-blur)" />
            <path data-cw-fibre-core={id} d={G.trackD[id]} fill="none" stroke="#E8FBE2" strokeWidth="2" strokeLinecap="round" />
          </g>
        ))}
      </svg>

      {G.compact ? (
        /* compact: the outcomes read as a legend under the instrument — the
           timeline still drives their opacity in lockstep with the machine */
        <div className="mt-3 space-y-1.5">
          <div data-cw-label="pass" className="font-mono text-[10px] tracking-[0.12em] uppercase leading-relaxed">
            <span className="text-accent">No challenge</span>
            <span className="text-white/55"> — 97.5% → founder · schedule continues</span>
          </div>
          <div data-cw-label="reject" className="font-mono text-[10px] tracking-[0.12em] uppercase leading-relaxed">
            <span className="text-persimmon-400">Rejected</span>
            <span className="text-white/55"> — 20% of stake burns · tranche releases</span>
          </div>
          <div data-cw-label="uphold" className="font-mono text-[10px] tracking-[0.12em] uppercase leading-relaxed">
            <span className="text-accent-bright">Upheld — frozen</span>
            <span className="text-white/55"> — escrow reopens to holders pro-rata</span>
          </div>
        </div>
      ) : (
        /* ≥sm: HTML outcome labels aligned to branch ends */
        <>
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
        </>
      )}
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
  const [compact, setCompact] = useState(false);
  const pinnedUntilRef = useRef(0);

  // one instrument, two scales — phones get the compact 400-unit variant
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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
    <section ref={sectionRef} data-chapter="03" data-chapter-name="The challenge window" className="relative py-16 sm:py-32 px-5 sm:px-10 border-t border-white/[0.08]">
      <div className="max-w-[1500px] mx-auto">
        <ChapterHead index="03" name="The challenge window" className="mb-6" />

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
        <div data-cw-in className="mt-10 sm:mt-16 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-white/[0.09] py-6">
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
        <div ref={stageRef} className="mt-8 sm:mt-14 min-h-[150px] sm:min-h-[230px]">
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

        {/* the living mechanism — the compact variant below sm, the full flow
            above; the key remounts the instrument when the scale changes */}
        <div data-cw-in className="mt-10 sm:mt-14">
          <ChallengeFlow
            key={compact ? "m" : "d"}
            compact={compact}
            outcome={outcome}
            cycleNonce={cycleNonce}
            onCycleEnd={handleCycleEnd}
          />
        </div>

        {/* the rulebook — three columns, one reading line */}
        <div data-cw-in className="mt-10 sm:mt-14 grid sm:grid-cols-3 gap-x-10 gap-y-6 sm:gap-y-7 border-t border-white/[0.1] pt-7">
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
