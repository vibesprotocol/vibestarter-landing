"use client";

/**
 * The Origin Capsule — the original glass pill, kept clean, with a BLOCKCHAIN
 * NODE NETWORK in the void around it.
 *
 * BACK LAYER (Canvas 2D — deliberately NOT the hero's shader contours and NOT a
 * dither): distributed nodes scattered in the void around the pill, linked into a
 * proximity mesh, with small blocks pulsing along the edges TOWARD the capsule as
 * the record seals in — the Origin Capsule at the centre of the network that
 * validates it. The mesh is a CONTAINED halo: a clear gap from the pill's border,
 * faded well before the frame edge so it never clips against the section.
 *
 * FRONT LAYER (round-2): the capsule itself — a glass cylinder of two clipped
 * halves meeting at a green seam, the cryptographic record engraved around the
 * rotating surface. THE capsule, clean, with its own single shell border.
 *
 * Driven imperatively from EdProvenance: __seal (0→1 — the halves shut, the shell
 * hardens, the mesh tightens), __pulse (a burst of blocks converges on the
 * capsule), __step the hidden-window driver hook. No setState, ever.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/* ── engraved record + meridians (the pill's surface) ─────────────────── */

const ROW_GAP = 760;
const ROW_LEN = 744;
const ROWS = [
  { text: "FOUNDER: 0x7f3a99d2e4b2 · SIG VALID · NONCE 0441 · FOUNDER: 0x7f3a99d2e4b2 · SIG VALID", y: 164, size: 10.5, fill: "rgba(255,255,255,0.28)", speed: 30 },
  { text: "AGENT: CLAUDE CODE · ERC-8004 #1 · REGISTERED · VALIDATED · AGENT: CLAUDE CODE · ERC-8004 #1", y: 196, size: 11.5, fill: "rgba(145,217,130,0.42)", speed: 22 },
  { text: "TRANSCRIPT SHA-256 · 0xd4c3b2a1f0e9d8c7 · 0x8a4f2e09c91d44ab · 0x3b7c9f4e8d21aa07 · TRANSCRIPT SHA-256", y: 232, size: 13, fill: "rgba(145,217,130,0.6)", speed: 16 },
  { text: "ARTIFACT: 0x4cd91a2e88f0 · 0x12aa34bc · 0x90ef · BUILD 2025-11-30T09:21:44Z · 0x4cd91a2e88f0", y: 268, size: 11.5, fill: "rgba(145,217,130,0.42)", speed: 23 },
  { text: "CHAIN: BASE · 8453 · APPEND-ONLY · IMMUTABLE · CHAIN: BASE · 8453 · APPEND-ONLY · IMMUTABLE", y: 300, size: 10.5, fill: "rgba(255,255,255,0.28)", speed: 29 },
] as const;

const MERIDIANS = ["M360 130 Q346 230 360 330", "M550 130 Q564 230 550 330", "M740 130 Q754 230 740 330"] as const;

/** Inner content, rendered once per half and clipped to the full pill so the
 *  halves complete each other when shut. */
function CapsuleContents() {
  return (
    <g clipPath="url(#edcap-pill)">
      <rect x="230" y="120" width="640" height="220" fill="url(#edcap-dither)" mask="url(#edcap-shade)" opacity="0.62" />
      <g mask="url(#edcap-wrap)">
        {ROWS.map((row, i) => (
          <g key={row.text} data-cap-row={i}>
            {[240, 240 + ROW_GAP].map((x) => (
              <text key={x} x={x} y={row.y} className="font-mono" fontSize={row.size} letterSpacing="1" fill={row.fill} textLength={ROW_LEN} lengthAdjust="spacingAndGlyphs">
                {row.text}
              </text>
            ))}
          </g>
        ))}
        {MERIDIANS.map((d, i) => (
          <path key={d} data-cap-meridian={i} d={d} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
        ))}
      </g>
      <path d="M300 150 Q550 128 800 150" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
      <path d="M420 140 Q550 126 680 140" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
    </g>
  );
}

type CapsuleHost = HTMLDivElement & {
  __step?: (dt: number) => void;
  __seal?: (v: number) => void;
  __pulse?: (v: number) => void;
};

function smoothstep(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function CapsuleField() {
  const hostRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const netHost = netRef.current;
    const svg = svgRef.current;
    if (!host || !netHost || !svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── back layer: the blockchain node network (Canvas 2D) ── */
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%";
    netHost.appendChild(canvas);
    const c = canvas.getContext("2d")!;

    let W = 0, H = 0, dpr = 1, svgW = 0;
    let cx = 0, cy = 0, hl = 0, hh = 0, gap = 0, reach = 0;

    type Node = { bx: number; by: number; x: number; y: number; ph: number; d: number; blue: boolean; amp: number; sx: number; sy: number };
    type Edge = { a: number; b: number };
    type Pulse = { from: number; to: number; t: number; sp: number };
    type Conn = { cx: number; cy: number; tx: number; ty: number; path: number[] };
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let connectors: Conn[] = []; // corner-callout routes that travel THROUGH the mesh

    // signed distance to the pill's exclusion stadium (px). >0 outside.
    const sdPill = (x: number, y: number) => {
      const px = Math.abs(x - cx) - (hl - hh);
      const py = Math.abs(y - cy);
      return Math.hypot(Math.max(px, 0), py) - hh;
    };

    const build = () => {
      W = netHost.clientWidth || 960;
      H = netHost.clientHeight || 600;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      // the pill on screen: svg is w-[82%] max-w-860; pill ≈ 0.58× of that wide
      svgW = Math.min(0.82 * W, 860);
      cx = W * 0.5;
      cy = H * 0.5 - svgW * 0.027; // the pill sits slightly above the SVG box centre
      hl = svgW * 0.30; // exclusion half-length (pill + a small gap)
      hh = svgW * 0.115; // exclusion half-height
      gap = svgW * 0.012; // the mesh starts just past the border
      reach = svgW * 0.32; // a big, expansive halo (the screen-fade keeps it off the edge)

      const N = reduced ? 90 : 170;
      nodes = [];
      let tries = 0;
      while (nodes.length < N && tries < N * 60) {
        tries++;
        const x = cx + (Math.random() * 2 - 1) * (hl + reach);
        const y = cy + (Math.random() * 2 - 1) * (hh + reach * 1.1);
        const d = sdPill(x, y);
        if (d < gap || d > reach) continue;
        nodes.push({
          bx: x, by: y, x, y,
          ph: Math.random() * Math.PI * 2,
          d,
          blue: Math.random() > 0.74,
          // per-node drift so the whole mesh is subtly, organically moving
          amp: svgW * (0.007 + Math.random() * 0.013),
          sx: 0.2 + Math.random() * 0.4,
          sy: 0.2 + Math.random() * 0.4,
        });
      }

      edges = [];
      const maxE = svgW * 0.088;
      for (let i = 0; i < nodes.length; i++) {
        let cnt = 0;
        for (let j = i + 1; j < nodes.length && cnt < 3; j++) {
          const dx = nodes[i].bx - nodes[j].bx, dy = nodes[i].by - nodes[j].by;
          if (Math.hypot(dx, dy) < maxE) { edges.push({ a: i, b: j }); cnt++; }
        }
      }

      // corner-callout connectors: a clean route from each corner label, through a
      // few mesh nodes lying along the way, TERMINATING exactly on the pill border.
      // The destination border point is computed directly, so the link always lands
      // on the capsule — never dangling at a floating node.
      const corners = [
        { x: W * 0.085, y: H * 0.13 },
        { x: W * 0.915, y: H * 0.13 },
        { x: W * 0.085, y: H * 0.87 },
        { x: W * 0.915, y: H * 0.87 },
      ];
      const segH = svgW * (0.291 - 0.10), pR = svgW * 0.10;
      connectors = corners.map((cp) => {
        // pill-border point nearest this corner — the route's destination
        const lx = cp.x - cx, ly = cp.y - cy;
        const sx = Math.max(-segH, Math.min(segH, lx));
        const ex0 = lx - sx, ey0 = ly;
        const el = Math.hypot(ex0, ey0) || 1;
        const tx = cx + sx + (ex0 / el) * pR, ty = cy + (ey0 / el) * pR;
        // waypoint nodes lying near the corner→border line, spread along it
        const dx = tx - cp.x, dy = ty - cp.y;
        const seg2 = dx * dx + dy * dy || 1;
        const cand: { i: number; t: number }[] = [];
        nodes.forEach((n, i) => {
          const t = ((n.bx - cp.x) * dx + (n.by - cp.y) * dy) / seg2;
          if (t < 0.06 || t > 0.95) return;
          const perp = Math.hypot(n.bx - (cp.x + dx * t), n.by - (cp.y + dy * t));
          if (perp < svgW * 0.07) cand.push({ i, t });
        });
        cand.sort((a, b) => a.t - b.t);
        const path: number[] = [];
        let lastT = -1;
        for (const w of cand) { if (w.t - lastT > 0.16) { path.push(w.i); lastT = w.t; } }
        return { cx: cp.x, cy: cp.y, tx, ty, path: path.slice(0, 5) };
      });

      pulses = [];
    };
    build();

    const target = { x: 0.5, y: 0.55 };
    const onPointer = (e: PointerEvent) => {
      const r = netHost.getBoundingClientRect();
      target.x = (e.clientX - r.left) / Math.max(1, r.width);
      target.y = (e.clientY - r.top) / Math.max(1, r.height);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let seal = reduced ? 1 : 0;
    let time = 0;
    let spawnT = 0;
    let pulsed = false;
    const mouse = { x: 0.5, y: 0.55 };

    const spawnPulse = () => {
      if (!edges.length) return;
      const e = edges[(Math.random() * edges.length) | 0];
      const a = nodes[e.a], b = nodes[e.b];
      // travel toward the capsule — destination is the node nearer the pill
      const from = a.d > b.d ? e.a : e.b;
      const to = a.d > b.d ? e.b : e.a;
      pulses.push({ from, to, t: 0, sp: 0.5 + Math.random() * 0.6 });
    };

    const fadeOf = (d: number) =>
      smoothstep(gap, gap + svgW * 0.028, d) * (1 - smoothstep(reach - svgW * 0.05, reach, d));

    // screen-space fade on BOTH axes — keeps the expansive mesh from ever cutting
    // off hard against the frame edge (it dissolves toward all four sides)
    const sf = (x: number, y: number) =>
      smoothstep(W * 0.48, W * 0.40, Math.abs(x - cx)) * smoothstep(H * 0.5, H * 0.38, Math.abs(y - cy));

    const draw = () => {
      c.clearRect(0, 0, W, H);
      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;
      const mx = mouse.x * W, my = mouse.y * H;
      const mr2 = svgW * svgW * 0.018;

      for (const n of nodes) {
        n.x = n.bx + Math.sin(time * n.sx + n.ph) * n.amp;
        n.y = n.by + Math.cos(time * n.sy + n.ph * 1.3) * n.amp;
      }

      c.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        const f = Math.min(fadeOf(a.d), fadeOf(b.d)) * Math.min(sf(a.x, a.y), sf(b.x, b.y));
        if (f <= 0.02) continue;
        c.strokeStyle = `rgba(145,217,130,${(f * (0.16 + 0.12 * seal)).toFixed(3)})`;
        c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      }

      // callout connectors — bright routes from each corner label through the mesh,
      // landing ON the capsule border. Drawn distinct from the ambient mesh.
      c.lineWidth = 1.5;
      for (const conn of connectors) {
        const ca = Math.min(0.5 + 0.45 * seal, 0.95);
        c.strokeStyle = `rgba(214,247,205,${ca.toFixed(3)})`;
        c.beginPath();
        c.moveTo(conn.cx, conn.cy);
        for (const ni of conn.path) c.lineTo(nodes[ni].x, nodes[ni].y);
        c.lineTo(conn.tx, conn.ty);
        c.stroke();
        c.fillStyle = `rgba(214,247,205,${ca.toFixed(3)})`;
        c.beginPath(); c.arc(conn.cx, conn.cy, 2.4, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(conn.tx, conn.ty, 3, 0, Math.PI * 2); c.fill();
      }

      for (const n of nodes) {
        const f = fadeOf(n.d) * sf(n.x, n.y);
        if (f <= 0.02) continue;
        const near = Math.exp(-(((n.x - mx) ** 2 + (n.y - my) ** 2) / mr2));
        const a = Math.min(f * (0.42 + 0.42 * seal + near * 0.5), 0.85);
        c.fillStyle = `rgba(${n.blue ? "13,139,202" : "145,217,130"},${a.toFixed(3)})`;
        c.beginPath(); c.arc(n.x, n.y, 1.6 + near * 1.3, 0, Math.PI * 2); c.fill();
      }

      // blocks gliding the edges toward the capsule
      for (const p of pulses) {
        const a = nodes[p.from], b = nodes[p.to];
        const t = Math.min(p.t, 1);
        const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
        const f = Math.min(fadeOf(a.d), fadeOf(b.d)) * Math.min(sf(a.x, a.y), sf(b.x, b.y)) * (1 - t * 0.25);
        c.fillStyle = `rgba(220,255,210,${(0.85 * f).toFixed(3)})`;
        c.fillRect(x - 1.7, y - 1.7, 3.4, 3.4);
      }
    };

    const step = (dt: number) => {
      time += dt;
      for (const p of pulses) p.t += dt * p.sp * 0.5;
      for (let i = pulses.length - 1; i >= 0; i--) if (pulses[i].t > 1) pulses.splice(i, 1);
      spawnT -= dt;
      if (spawnT <= 0) { spawnPulse(); spawnT = 0.16 + Math.random() * 0.3; }
      draw();
    };

    /* ── front layer: the glass pill seals as v: 0 → 1 ── */
    const applySvgSeal = (v: number) => {
      gsap.set('[data-cap-half="l"]', { x: -34 * (1 - v) });
      gsap.set('[data-cap-half="r"]', { x: 34 * (1 - v) });
      gsap.set("[data-cap-shell]", { opacity: 0.28 + 0.72 * v });
      gsap.set("[data-cap-seam]", { opacity: 0.2 * v });
      gsap.set("[data-cap-engrave]", { opacity: v });
    };

    const hostAny = host as CapsuleHost;
    hostAny.__step = step;
    hostAny.__seal = (v: number) => { seal = v; applySvgSeal(v); };
    hostAny.__pulse = (v: number) => {
      if (v > 0.04 && !pulsed) { for (let k = 0; k < 12; k++) spawnPulse(); pulsed = true; }
      if (v <= 0.01) pulsed = false;
    };

    let inView = true;
    const io = new IntersectionObserver(([entry]) => { inView = entry?.isIntersecting ?? true; });
    io.observe(host);

    const ctx = gsap.context(() => {
      if (reduced) {
        applySvgSeal(1);
        gsap.set("[data-cap-meridian]", { opacity: 0 });
        return;
      }
      applySvgSeal(0);
      gsap.set("[data-cap-meridian]", { opacity: 0 });

      const turn = gsap.timeline();
      ROWS.forEach((row, i) => {
        turn.to(`[data-cap-row="${i}"]`, { x: -ROW_GAP, duration: row.speed, ease: "none", repeat: -1 }, 0);
      });
      MERIDIANS.forEach((_, i) => {
        turn.fromTo(`[data-cap-meridian="${i}"]`, { x: 0 }, { x: 40, duration: 8, ease: "none", repeat: -1 }, i * 2.7);
        turn.to(
          `[data-cap-meridian="${i}"]`,
          { keyframes: [{ opacity: 1, duration: 1.6 }, { opacity: 1, duration: 4.8 }, { opacity: 0, duration: 1.6 }], repeat: -1, ease: "none" },
          i * 2.7
        );
      });

      const breathe = gsap.timeline({ repeat: -1 });
      breathe
        .to("[data-cap-seam]", { opacity: 0.15, duration: 2.4, ease: "sine.inOut" })
        .to("[data-cap-seam]", { opacity: 0.4, duration: 2.4, ease: "sine.inOut" });

      const scan = gsap.timeline({ repeat: -1, repeatDelay: 3.4 });
      scan.fromTo("[data-cap-scan]", { x: 0 }, { x: 760, duration: 1.6, ease: "power1.inOut" });
    }, svg);

    let raf = 0;
    let disposed = false;
    if (reduced) {
      draw();
    } else {
      let last = performance.now();
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (disposed) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (document.hidden || !inView) return;
        step(dt);
      };
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => { build(); draw(); };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      ctx.revert();
      delete hostAny.__step;
      delete hostAny.__seal;
      delete hostAny.__pulse;
      if (canvas.parentElement === netHost) netHost.removeChild(canvas);
    };
  }, []);

  return (
    <div ref={hostRef} data-capsule className="pointer-events-none absolute inset-0">
      {/* blockchain node network */}
      <div ref={netRef} aria-hidden className="absolute inset-0" />
      {/* the glass pill */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg ref={svgRef} viewBox="0 100 1100 320" className="w-[82%] max-w-[860px] block">
          <defs>
            <pattern id="edcap-dither" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="1.6" height="1.6" fill="#91D982" opacity="0.5" />
              <rect x="2" y="2" width="1.6" height="1.6" fill="#91D982" opacity="0.28" />
            </pattern>
            <clipPath id="edcap-half-l"><rect x="0" y="0" width="550" height="460" /></clipPath>
            <clipPath id="edcap-half-r"><rect x="550" y="0" width="550" height="460" /></clipPath>
            <clipPath id="edcap-pill"><rect x="230" y="120" width="640" height="220" rx="110" /></clipPath>
            <linearGradient id="edcap-shade-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="1" />
              <stop offset="0.35" stopColor="#fff" stopOpacity="0.25" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="0.65" stopColor="#fff" stopOpacity="0.25" />
              <stop offset="1" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <mask id="edcap-shade"><rect x="230" y="120" width="640" height="220" fill="url(#edcap-shade-grad)" /></mask>
            <linearGradient id="edcap-wrap-grad" gradientUnits="userSpaceOnUse" x1="230" y1="0" x2="870" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.11" stopColor="#fff" stopOpacity="1" />
              <stop offset="0.89" stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="edcap-wrap"><rect x="230" y="120" width="640" height="220" fill="url(#edcap-wrap-grad)" /></mask>
            <linearGradient id="edcap-scan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#91D982" stopOpacity="0" />
              <stop offset="0.5" stopColor="#91D982" stopOpacity="0.06" />
              <stop offset="1" stopColor="#91D982" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g data-cap-half="l" clipPath="url(#edcap-half-l)">
            <rect data-cap-shell x="230" y="120" width="640" height="220" rx="110" fill="none" stroke="rgba(145,217,130,0.55)" strokeWidth="2" />
            <rect x="240" y="130" width="620" height="200" rx="100" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <CapsuleContents />
          </g>
          <g data-cap-half="r" clipPath="url(#edcap-half-r)">
            <rect data-cap-shell x="230" y="120" width="640" height="220" rx="110" fill="none" stroke="rgba(145,217,130,0.55)" strokeWidth="2" />
            <rect x="240" y="130" width="620" height="200" rx="100" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <CapsuleContents />
          </g>

          <g clipPath="url(#edcap-pill)">
            <rect data-cap-scan x="170" y="120" width="60" height="220" fill="url(#edcap-scan)" />
          </g>

          <line data-cap-seam x1="550" y1="120" x2="550" y2="340" stroke="#91D982" strokeWidth="2" opacity="0.2" />

          <g data-cap-engrave>
            <text x="550" y="390" textAnchor="middle" className="font-mono font-bold" fontSize={18} letterSpacing="1.5" fill="rgba(255,255,255,0.95)">
              0x3b7c9f4e8d21aa07…a2e8
            </text>
            <text x="550" y="414" textAnchor="middle" className="font-mono" fontSize={11} letterSpacing="3" fill="rgba(255,255,255,0.5)">
              ORIGIN CAPSULE · SEALED AT FINALIZATION · BASE 8453
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
