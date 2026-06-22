"use client";

import { useEffect, useRef, useState } from "react";
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
/* The living diagram — the CHALLENGE MECHANISM as a FIBRE-OPTIC line.     */
/* A single hairline conduit runs left→right. The LINE ITSELF conducts a   */
/* short bright pulse: a green-lit segment travels ALONG the conduit and   */
/* the line glows where the pulse is, darkening behind it. It PAUSES       */
/* inside the 72-hour window (a clock: ring + sweeping arc), then continues */
/* through a minimal vertical gate. The window completing IS the release —  */
/* the gate parts top-to-bottom the instant the arc finishes. A challenge   */
/* is the only thing that holds the gate shut: rejected, it dismisses and   */
/* the lit pulse still passes; upheld, the gate locks into a closed blue    */
/* bar and the pulse reverses, dimming.                                     */
/* ------------------------------------------------------------------ */

const LINE_Y = 190; // the centreline every fixed mark sits on

// the window = a clock. Ring + sweeping arc, nothing more.
const WIN_CX = 430;
const WIN_CY = LINE_Y;
const WIN_R = 50; // ring radius
const ARC_R = 58; // sweeping arc, just outside the ring
const ARC_C = 2 * Math.PI * ARC_R;

// the conduit: a single hairline from the start node to the junction
const START_X = 70;
const JUNCTION_X = 614;
const CONDUIT_D = `M ${START_X} ${LINE_Y} L ${JUNCTION_X} ${LINE_Y}`;

// the fibre pulse's dwell point: its path-length at the window centre, measured
// along the straight conduit (length = x − 70), so the lit segment of the line
// glows inside the clock ring.
const LEN_WINDOW = WIN_CX - START_X; // 360

// the lit segment of the fibre: one short bright run of line that travels the
// conduit. ~70px lit, the rest dark — the line itself conducts the light.
const FIBRE_LIT = 70;

// the gate: a SINGLE vertical barrier across the horizontal line at the gate x,
// just after the window. To open it parts TOP-TO-BOTTOM — the two halves retract
// away from the centreline, opening a vertical doorway for the pulse to pass.
const GATE_X = 560;
const GATE_TOP = 158; // top edge of the closed barrier
const GATE_MID = LINE_Y; // 190 — the centreline the barrier splits at
const GATE_BOT = 222; // bottom edge of the closed barrier
const GATE_GAP = 8; // each half's inner end retracts this far from the centre
const GATE_OPEN_T = GATE_MID - GATE_GAP; // 182 — top half's open inner end
const GATE_OPEN_B = GATE_MID + GATE_GAP; // 198 — bottom half's open inner end
const GATE_REST = "rgba(236,104,0,0.55)"; // persimmon hairline at rest
const GATE_CX = GATE_X; // the barrier sits on a single vertical line on the conduit
const GATE_OPEN = 22; // open: the top half retracts UP, the bottom half DOWN

const BRANCH_IDS = ["pass", "reject", "uphold"] as const;
type BranchId = (typeof BRANCH_IDS)[number];

// the three branch destinations (endpoint labels stay clash-free)
const BRANCH_D: Record<BranchId, string> = {
  pass: "M 614 190 C 760 190, 860 90, 965 90",
  reject: "M 614 190 L 965 190",
  uphold: "M 614 190 C 760 190, 860 290, 965 290",
};

const BRANCH_COLOR: Record<BranchId, string> = {
  pass: GREEN,
  reject: AMBER,
  uphold: BLUE,
};

// the full track the beam of light rides: conduit + the chosen branch,
// rendered hidden and measured with getPointAtLength so the beam stays on
// the line precisely.
const TRACK_D: Record<BranchId, string> = {
  pass: `M ${START_X} ${LINE_Y} L ${JUNCTION_X} ${LINE_Y} C 760 190, 860 90, 965 90`,
  reject: `M ${START_X} ${LINE_Y} L ${JUNCTION_X} ${LINE_Y} L 965 190`,
  uphold: `M ${START_X} ${LINE_Y} L ${JUNCTION_X} ${LINE_Y} C 760 190, 860 290, 965 290`,
};

function ChallengeFlow({ outcome }: { outcome: Outcome }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<gsap.core.Timeline | null>(null);

  // intro — the conduit draws on, fixed marks fade in
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
      tl.fromTo("[data-cw-fixed]", { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.08 }, 0.2);
    }, root);
    return () => ctx.revert();
  }, []);

  // the ambient loop — the LINE ITSELF conducts the pulse (a bright dash that
  // travels along the actual stroke; the conduit glows where the light is — no
  // object rides on top). Rebuilt whenever the outcome changes.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const branches = BRANCH_IDS.map((id) =>
      root.querySelector<SVGPathElement>(`[data-cw-branch="${id}"]`)
    );
    const fibreGroups = BRANCH_IDS.map((id) =>
      root.querySelector<SVGGElement>(`[data-cw-fibre="${id}"]`)
    );
    const fibreGlows = BRANCH_IDS.map((id) =>
      root.querySelector<SVGPathElement>(`[data-cw-fibre-glow="${id}"]`)
    );
    const fibreCores = BRANCH_IDS.map((id) =>
      root.querySelector<SVGPathElement>(`[data-cw-fibre-core="${id}"]`)
    );
    const labels = BRANCH_IDS.map((id) =>
      root.querySelector<HTMLElement>(`[data-cw-label="${id}"]`)
    );
    const gateL = root.querySelector<SVGLineElement>("[data-cw-gate='l']");
    const gateR = root.querySelector<SVGLineElement>("[data-cw-gate='r']");
    const challenged = root.querySelector<SVGTextElement>("[data-cw-challenged]");
    const arc = root.querySelector<SVGCircleElement>("[data-cw-arc]");
    const ring = root.querySelector<SVGCircleElement>("[data-cw-ring]");
    if (
      !arc || !ring || !gateL || !gateR || !challenged ||
      branches.some((b) => !b) || fibreGroups.some((g) => !g) ||
      fibreGlows.some((g) => !g) || fibreCores.some((c) => !c) || labels.some((l) => !l)
    )
      return;
    const paths = branches as SVGPathElement[];
    const tags = labels as HTMLElement[];
    const active = paths[outcome];
    const fGroup = fibreGroups[outcome] as SVGGElement;
    const fGlow = fibreGlows[outcome] as SVGPathElement;
    const fActive = [fibreGlows[outcome], fibreCores[outcome]] as SVGPathElement[];
    const total = (fibreCores[outcome] as SVGPathElement).getTotalLength();

    // a short lit segment of the stroke, travelling along it: a dash of FIBRE_LIT
    // px and a gap longer than the line, so only one lit run is on the conduit at
    // a time. Setting its centre at path-distance `pos` lights the line there.
    gsap.set(fActive, { strokeDasharray: `${FIBRE_LIT} ${total + 2 * FIBRE_LIT}` });
    const rideTo = (len: number) => {
      const L = Math.max(0, Math.min(len, total));
      gsap.set(fActive, { strokeDashoffset: FIBRE_LIT / 2 - L });
    };
    const ride = (o: { l: number }) => rideTo(o.l);
    // only the chosen outcome's line lights up
    (fibreGroups as SVGGElement[]).forEach((g, i) => gsap.set(g, { opacity: i === outcome ? 1 : 0 }));

    // gate states — two clean hairlines: a doorway that opens, or a closed bar
    const gateRest = () => {
      gsap.set(gateL, { y: 0, stroke: GATE_REST, strokeWidth: 1.6, opacity: 1 });
      gsap.set(gateR, { y: 0, stroke: GATE_REST, strokeWidth: 1.6, opacity: 1 });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // static frame — the beam dwelling at the window, gate state per outcome
      paths.forEach((p, i) => gsap.set(p, { opacity: i === outcome ? 1 : 0.4 }));
      tags.forEach((l, i) => gsap.set(l, { opacity: i === outcome ? 1 : 0.5 }));
      gsap.set(arc, { opacity: 0 });
      gsap.set(fGroup, { opacity: outcome === 2 ? 0.45 : 1 });
      gsap.set(fGlow, { strokeWidth: 7, opacity: 0.55 });
      rideTo(LEN_WINDOW); // the lit segment at the window
      gsap.set(challenged, { opacity: outcome === 0 ? 0 : 0.9 });
      if (outcome === 0) {
        // released — gate open, ring amber
        gsap.set(ring, { stroke: AMBER, opacity: 1 });
        gsap.set(gateL, { y: -GATE_OPEN, stroke: GATE_REST, strokeWidth: 1.6, opacity: 0.5 });
        gsap.set(gateR, { y: GATE_OPEN, stroke: GATE_REST, strokeWidth: 1.6, opacity: 0.5 });
      } else if (outcome === 1) {
        // a challenge stands — gate closed, flushed persimmon
        gsap.set(ring, { stroke: AMBER, opacity: 1 });
        gsap.set(gateL, { y: 0, stroke: AMBER, strokeWidth: 2.4, opacity: 1 });
        gsap.set(gateR, { y: 0, stroke: AMBER, strokeWidth: 2.4, opacity: 1 });
      } else {
        // upheld — gate locked into one closed blue bar, ring blue
        gsap.set(ring, { stroke: BLUE, opacity: 1 });
        gsap.set(gateL, { y: 0, stroke: BLUE, strokeWidth: 3, opacity: 1 });
        gsap.set(gateR, { y: 0, stroke: BLUE, strokeWidth: 3, opacity: 1 });
      }
      return;
    }

    // label emphasis follows the selection, outside the loop
    tags.forEach((l, i) => gsap.to(l, { opacity: i === outcome ? 1 : 0.4, duration: 0.35 }));

    // clear any leftovers from the previous outcome's cycle
    gsap.killTweensOf(fGlow);
    gsap.set(fGroup, { opacity: 1 });
    gsap.set(fGlow, { strokeWidth: 7, opacity: 0.55 });
    gsap.set(challenged, { opacity: 0 });
    gateRest();
    gsap.set(ring, { stroke: AMBER, opacity: 1 });
    gsap.set(arc, { stroke: AMBER });
    rideTo(0);

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.7,
      scrollTrigger: { trigger: root, start: "top 80%", toggleActions: "play pause resume pause" },
    });
    loopRef.current = tl;

    const flashTag = (at: number) =>
      tl.to(tags[outcome], { opacity: 0.3, duration: 0.16, repeat: 1, yoyo: true }, at);
    // the gate opens — the two hairlines slide cleanly apart and soften
    const openGate = (at: number) => {
      tl.to(gateL, { y: -GATE_OPEN, opacity: 0.45, duration: 0.5, ease: "power3.inOut" }, at);
      tl.to(gateR, { y: GATE_OPEN, opacity: 0.45, duration: 0.5, ease: "power3.inOut" }, at);
    };

    /* ---- RESET BLOCK (t = 0): every persistent node to spawn state ---- */
    tl.set(challenged, { opacity: 0 }, 0);
    tl.set(gateL, { y: 0, stroke: GATE_REST, strokeWidth: 1.6, opacity: 1 }, 0);
    tl.set(gateR, { y: 0, stroke: GATE_REST, strokeWidth: 1.6, opacity: 1 }, 0);
    tl.set(fGroup, { opacity: 1 }, 0);
    tl.set(fGlow, { strokeWidth: 7, opacity: 0.55 }, 0);
    tl.set(ring, { stroke: AMBER, opacity: 1 }, 0);
    tl.set(arc, { opacity: 0, stroke: AMBER, strokeDasharray: `${ARC_C}`, strokeDashoffset: ARC_C }, 0);
    paths.forEach((p) => tl.set(p, { opacity: 0.15 }, 0));

    // the travelling-light proxy: a single number the beam rides along the track
    const pos = { l: 0 };
    tl.set(pos, { l: 0 }, 0);
    const onRide = () => ride(pos);
    // snap the beam home at the top of every loop (avoids a one-frame carry-over
    // from the previous cycle's end position)
    tl.call(() => rideTo(0), undefined, 0);

    /* ---- STAGE A (0–1.0s): the beam of light travels in from the start and
       arrives INSIDE the window, where it will dwell.                        */
    tl.to(pos, { l: LEN_WINDOW, duration: 1.0, ease: "power2.inOut", onUpdate: onRide }, 0);

    /* ---- STAGE B — THE 72H WINDOW (1.0–3.6s) = TIME ----
       The arc sweeps the full ring (the clock running) while the beam dwells
       inside, gently breathing. The gate stays CLOSED across the path. For a
       challenged outcome, a challenge is raised mid-window — the gate flushes
       persimmon and "CHALLENGED" flashes above it.                           */
    const WIN_START = 1.0;
    const WIN_END = 3.6;
    tl.set(arc, { opacity: 0.9 }, WIN_START);
    tl.to(arc, { strokeDashoffset: 0, duration: WIN_END - WIN_START, ease: "none" }, WIN_START);
    // the dwelling light breathes through the window — the line's glow swells
    // and softens (the conduit itself pulses; nothing rides on top)
    tl.to(fGlow, { strokeWidth: 11, opacity: 0.85, duration: 0.85, ease: "sine.inOut", yoyo: true, repeat: 1 }, WIN_START + 0.2);
    tl.fromTo(active, { opacity: 0.15 }, { opacity: 0.3, duration: WIN_END - WIN_START, ease: "none" }, WIN_START);

    if (outcome !== 0) {
      // a challenge is raised mid-window — the gate flushes persimmon and
      // "CHALLENGED" flashes above it
      tl.to([gateL, gateR], { stroke: AMBER, strokeWidth: 2.4, duration: 0.2, ease: "none" }, 1.6);
      tl.fromTo(challenged, { opacity: 0 }, { opacity: 0.95, duration: 0.18, ease: "none" }, 1.6);
      tl.to(challenged, { opacity: 0.6, duration: 0.4, ease: "none" }, 1.85);
    }

    /* ---- STAGE C — WINDOW ENDS → GATE DECISION (3.6s+) ----
       The window passing IS the release: the gate opens the instant the arc
       completes — unless a challenge is holding it shut.                     */
    const RES = WIN_END;
    let END = RES;

    if (outcome === 0) {
      // NO CHALLENGE — the instant the arc completes the gate opens and the
      // beam glides through to the founder endpoint, brightening.
      openGate(RES);
      tl.to(pos, { l: total, duration: 1.9, ease: "power1.inOut", onUpdate: onRide }, RES + 0.45);
      tl.to(active, { opacity: 0.65, duration: 0.5, ease: "none" }, RES + 0.7);
      tl.to(fGlow, { strokeWidth: 9, opacity: 0.9, duration: 0.5, ease: "power1.out" }, RES + 0.45);
      flashTag(RES + 2.0);
      END = RES + 2.7;
    }
    if (outcome === 1) {
      // REJECTED — at window end the challenge is DISMISSED: the gate flushes
      // bright then opens, and the beam still passes through to the endpoint.
      tl.to([gateL, gateR], { stroke: "rgba(255,255,255,0.9)", strokeWidth: 2.4, duration: 0.14, ease: "none" }, RES);
      tl.to(challenged, { opacity: 0, duration: 0.25, ease: "none" }, RES + 0.1);
      tl.to([gateL, gateR], { stroke: GATE_REST, strokeWidth: 1.6, duration: 0.35, ease: "none" }, RES + 0.2);
      openGate(RES + 0.6);
      tl.to(pos, { l: total, duration: 1.9, ease: "power1.inOut", onUpdate: onRide }, RES + 1.0);
      tl.to(active, { opacity: 0.65, duration: 0.5, ease: "none" }, RES + 1.1);
      flashTag(RES + 2.5);
      END = RES + 3.2;
    }
    if (outcome === 2) {
      // UPHELD — at window end the challenge HOLDS: the two hairlines join into
      // a single closed BLUE bar (gate locked); the ring hardens blue. The beam
      // cannot pass — it reverses back along the line and dims (escrow returns).
      tl.to([gateL, gateR], { stroke: BLUE, strokeWidth: 3, duration: 0.3, ease: "power1.in" }, RES + 0.05);
      tl.to(challenged, { opacity: 0, duration: 0.3, ease: "none" }, RES + 0.1);
      tl.to(gateL, { y: 0, duration: 0.4, ease: "power2.inOut" }, RES + 0.3);
      tl.to(gateR, { y: 0, duration: 0.4, ease: "power2.inOut" }, RES + 0.3);
      tl.to(ring, { stroke: BLUE, duration: 0.45, ease: "power2.out" }, RES + 0.35);
      tl.to(arc, { stroke: BLUE, duration: 0.45, ease: "none" }, RES + 0.35);
      // the wall holds — the lit line recoils back toward the holders and dims
      tl.to(pos, { l: 0, duration: 1.5, ease: "power2.inOut", onUpdate: onRide }, RES + 0.7);
      tl.to(fGroup, { opacity: 0, duration: 0.6, ease: "power1.in" }, RES + 1.7);
      flashTag(RES + 1.2);
      END = RES + 2.7;
    }
    tl.to({}, { duration: 0.05 }, END);

    return () => {
      gsap.killTweensOf(tags);
      gsap.killTweensOf(fGlow);
      tl.scrollTrigger?.kill();
      tl.kill();
      loopRef.current = null;
    };
  }, [outcome]);

  return (
    <div ref={rootRef} className="relative">
      <svg
        viewBox="0 0 1200 380"
        className="w-full"
        role="img"
        aria-label="A single pulse of light travels along a hairline conduit and pauses inside the 72-hour window, a clock whose arc sweeps down the countdown. A minimal two-line gate sits just after the window. With no challenge, the gate opens the instant the window ends and the beam glides through to the founder. A rejected challenge flashes the gate then dismisses, and the beam still passes. An upheld challenge locks the gate into a closed blue bar, and the beam reverses back to the holders."
      >
        <defs>
          {/* soft blur for the beam's glow halo */}
          <filter id="edcw-beam-blur" x="-60%" y="-400%" width="220%" height="900%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        {/* start node — a small clean dot + label */}
        <g data-cw-fixed>
          <circle cx={START_X} cy={LINE_Y} r="4" fill="rgba(255,255,255,0.85)" />
          <text x={START_X} y={LINE_Y - 20} className="font-mono" fontSize="12" letterSpacing="2" fill="rgba(255,255,255,0.7)">
            TRANCHE REQUESTED
          </text>
        </g>

        {/* the conduit — a single hairline from the start to the junction */}
        <path data-cw-conduit d={CONDUIT_D} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.25" />

        {/* the window = the CLOCK — a clean ring + a sweeping countdown arc.
            Minimal: just the ring, the arc, and "72H". The beam dwells inside. */}
        <g data-cw-fixed>
          <circle data-cw-ring cx={WIN_CX} cy={WIN_CY} r={WIN_R} fill="none" stroke={AMBER} strokeWidth="1.25" opacity="0.85" />
          {/* 12-o'clock tick — the start mark the hand sweeps from */}
          <line x1={WIN_CX} y1={WIN_CY - ARC_R - 4} x2={WIN_CX} y2={WIN_CY - WIN_R - 1} stroke={AMBER} strokeWidth="1.25" />
          <text x={WIN_CX} y={WIN_CY + 30} textAnchor="middle" className="font-mono" fontSize="13" letterSpacing="2" fill={AMBER}>
            72H
          </text>
        </g>

        {/* countdown arc — the sweeping hand, driven during the window phase */}
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

        {/* three branches — faint until the beam travels one */}
        {BRANCH_IDS.map((id) => (
          <path
            key={id}
            data-cw-branch={id}
            d={BRANCH_D[id]}
            fill="none"
            stroke={BRANCH_COLOR[id]}
            strokeWidth="2"
            opacity="0.15"
          />
        ))}

        {/* THE GATE — two clean vertical hairlines: a narrow doorway across the
            path just after the window. Opens when the window completes; a
            challenge holds it shut; upheld, the two join into a closed bar. */}
        <g data-cw-fixed>
          <line data-cw-gate="l" x1={GATE_CX} y1={GATE_TOP} x2={GATE_CX} y2={GATE_MID} stroke={GATE_REST} strokeWidth="1.6" />
          <line data-cw-gate="r" x1={GATE_CX} y1={GATE_MID} x2={GATE_CX} y2={GATE_BOT} stroke={GATE_REST} strokeWidth="1.6" />
          <text x={GATE_CX} y={GATE_BOT + 18} textAnchor="middle" className="font-mono" fontSize="10" letterSpacing="2" fill="rgba(255,255,255,0.4)">
            HOLDER GATE
          </text>
        </g>

        {/* the challenge flag — flashes above the gate when a challenge stands */}
        <text
          data-cw-challenged
          x={GATE_CX}
          y={GATE_TOP - 12}
          textAnchor="middle"
          className="font-mono"
          fontSize="10"
          letterSpacing="2"
          fill={AMBER}
          opacity="0"
        >
          CHALLENGED
        </text>

        {/* THE FIBRE PULSE — the LINE ITSELF lights up. A short bright run of the
            actual conduit/branch stroke travels along it (an animated dash),
            glowing where the pulse is. No object rides on top of the track. */}
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
        className="absolute left-[84%] top-[calc(23.7%-9px)] w-[16%] font-mono text-[10px] lg:text-[11px] tracking-[0.14em] uppercase leading-relaxed"
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
        className="absolute left-[84%] top-[calc(76.3%-9px)] w-[16%] font-mono text-[10px] lg:text-[11px] tracking-[0.14em] uppercase leading-relaxed"
      >
        <span className="inline-block bg-black/80 px-1 -ml-1 text-accent-bright">Upheld — frozen</span>
        <br />
        <span className="text-white/55">Escrow reopens to holders pro-rata</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — the challenge window. Every release can be challenged; the      */
/* reader picks the outcome and the mechanism runs it, on a loop.       */
/* ------------------------------------------------------------------ */

export function EdChallengeWindow() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [outcome, setOutcome] = useState<Outcome>(0);

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

        {/* the outcome selector */}
        <div data-cw-in className="mt-14 sm:mt-16 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-white/[0.09] py-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              data-cursor="link"
              onClick={() => setOutcome(tab.id)}
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
          <ChallengeFlow outcome={outcome} />
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
