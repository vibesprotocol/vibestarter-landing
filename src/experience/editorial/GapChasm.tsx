"use client";

import { useEffect, useRef } from "react";

/**
 * THE FUNDING GAP — problem first, then the solution.
 *
 * PROBLEM (as the section arrives): the void dominates. A relentless
 * waterfall of small wireframe ideas pours over the cliff edge — hundreds,
 * arcing off the lip, tumbling down the left face, dissolving into Bayer
 * dither in the deep, past the ghost type. The LOST tally ticks. There is
 * no bridge and no way across.
 *
 * SOLUTION (drawn by scroll): the VIBESTARTER bridge MATERIALISES — deck,
 * towers, cable and hangers dissolve IN, piece by piece, through a Bayer
 * ordering with a shimmer on each part as it lands. The swarm dims back,
 * and ONE GREEN IDEA — larger, glowing, singular — walks through the grey
 * crowd, crosses the deck alone above the still-falling masses, and takes
 * its place on the funded side. FUNDED flips to 01.
 *
 * The copy stands on the plateaus (EdGap shares this geometry via CHASM).
 * One cleared 2d canvas per frame. __step(dt) advances + renders
 * (hidden-tab driver); __scroll(p) feeds the scrub; __fill(v) pins the
 * fill (dev). Reduced motion draws the resolved frame. No setState, ever.
 */

const GREEN = { r: 145, g: 217, b: 130 };

/* geometry shared with EdGap's text columns — the tear is dead-centre */
export const CHASM = {
  platformY: 0.46,
  leftEdge: 0.325,
  rightEdge: 0.675,
};

function vhash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

/* ---- wireframe idea-shapes ---- */

type V3 = { x: number; y: number; z: number };

const SHAPES: Record<string, { verts: V3[]; edges: [number, number][] }> = {
  diamond: {
    verts: [
      { x: 0, y: -1, z: 0 },
      { x: 0.7, y: 0, z: 0 },
      { x: 0, y: 0, z: 0.7 },
      { x: -0.7, y: 0, z: 0 },
      { x: 0, y: 0, z: -0.7 },
      { x: 0, y: 1, z: 0 },
    ],
    edges: [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1],
    ],
  },
  tetra: {
    verts: [
      { x: 0, y: -0.8, z: 0 },
      { x: 0.7, y: 0.4, z: -0.4 },
      { x: -0.7, y: 0.4, z: -0.4 },
      { x: 0, y: 0.4, z: 0.6 },
    ],
    edges: [
      [0, 1], [0, 2], [0, 3],
      [1, 2], [2, 3], [3, 1],
    ],
  },
  cube: {
    verts: [
      { x: -0.5, y: -0.5, z: -0.5 }, { x: 0.5, y: -0.5, z: -0.5 },
      { x: 0.5, y: -0.5, z: 0.5 }, { x: -0.5, y: -0.5, z: 0.5 },
      { x: -0.5, y: 0.5, z: -0.5 }, { x: 0.5, y: 0.5, z: -0.5 },
      { x: 0.5, y: 0.5, z: 0.5 }, { x: -0.5, y: 0.5, z: 0.5 },
    ],
    edges: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ],
  },
};
const SHAPE_KEYS = Object.keys(SHAPES);

// swarm state: 0 marching · 1 falling
type Idea = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotSpeed: number;
  kind: string;
  size: number;
  phase: number;
  opacity: number;
  state: 0 | 1;
  shatterDepth: number; // fraction of the chasm at which it breaks apart (>1 = never)
};

// a fragment of a broken idea — a lone tumbling wireframe shard
type Shard = { x: number; y: number; vx: number; vy: number; rot: number; rotSpeed: number; size: number; life: number; maxLife: number; seed: number };

type ChasmHost = HTMLDivElement & {
  __step?: (dt: number) => void;
  __scroll?: (p: number) => void;
  __fill?: (v: number) => void;
};

const MAX_SWARM = 300;

export function GapChasm({ className = "" }: { className?: string } = {}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const fundedRef = useRef<HTMLSpanElement>(null);
  const fundedRowRef = useRef<HTMLDivElement>(null);
  const lostRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const fundedEl = fundedRef.current;
    const fundedRow = fundedRowRef.current;
    const lostEl = lostRef.current;
    const mark = markRef.current;
    if (!host || !fundedEl || !fundedRow || !lostEl || !mark) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // purge any canvas a failed HMR cleanup may have leaked — a stale frozen
    // layer would paint dead pixels over everything this effect draws
    host.querySelectorAll("canvas").forEach((c) => c.remove());
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.insertBefore(canvas, host.firstChild);
    const ctx = canvas.getContext("2d")!;

    let W = 0;
    let H = 0;
    let py = 0;
    let lx = 0;
    let rx = 0;

    /* ---- ghost type ---- */
    const textCanvas = document.createElement("canvas");
    let textW = 0;
    let textH = 0;
    const buildGhostType = () => {
      if (W < 10) return;
      const probe = document.createElement("span");
      probe.className = "font-display";
      probe.style.cssText = "position:absolute;visibility:hidden";
      document.body.appendChild(probe);
      const fam = getComputedStyle(probe).fontFamily || "monospace";
      probe.remove();

      textW = Math.max(2, Math.round((rx - lx) * 1.2 * dpr));
      textH = Math.max(2, Math.round(textW * 0.36));
      textCanvas.width = textW;
      textCanvas.height = textH;
      const tc = textCanvas.getContext("2d")!;
      tc.clearRect(0, 0, textW, textH);
      tc.fillStyle = "#ffffff";
      tc.textAlign = "center";
      tc.textBaseline = "middle";
      const big = textW * 0.155;
      try {
        (tc as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-big * 0.02}px`;
      } catch {}
      tc.font = `700 ${big}px ${fam}`;
      tc.fillText("90%", textW / 2, textH * 0.26);
      const mid = textW * 0.062;
      try {
        (tc as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${mid * 0.18}px`;
      } catch {}
      tc.font = `700 ${mid}px ${fam}`;
      tc.fillText("NEVER CROSS", textW / 2, textH * 0.56);
      const small = textW * 0.026;
      try {
        (tc as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${small * 0.5}px`;
      } catch {}
      tc.font = `500 ${small}px ${fam}`;
      tc.fillText("THE FUNDING GAP", textW / 2, textH * 0.82);
      // clean type, no dither — it must read instantly
    };

    /* ---- the swarm ---- */
    const swarm: Idea[] = [];
    const shards: Shard[] = [];
    let lost = 0;
    let spawnT = 0;
    let time = 0;
    let warmed = false;
    let fundedShown = false;

    const spawn = () => {
      if (swarm.length >= MAX_SWARM) return;
      const size = 4.5 + Math.random() * Math.random() * 9;
      swarm.push({
        x: -20 - Math.random() * 120,
        y: py - size * 0.95 - Math.random() * Math.random() * 14, // a loose crowd, not single file

        vx: 150 + Math.random() * 110,
        vy: 0,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.4 + Math.random() * 0.6,
        kind: SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)],
        size,
        phase: Math.random() * Math.PI * 2,
        opacity: 0,
        state: 0,
        // most fracture partway down; some fall whole into the dark
        shatterDepth: Math.random() < 0.7 ? 0.22 + Math.random() * 0.35 : 9,
      });
    };

    const shatter = (s: Idea) => {
      const n = 4 + Math.floor(Math.random() * 3);
      for (let k = 0; k < n; k++) {
        if (shards.length > 220) break;
        const a = Math.random() * Math.PI * 2;
        const sp = 40 + Math.random() * 70;
        shards.push({
          x: s.x + (Math.random() - 0.5) * s.size,
          y: s.y + (Math.random() - 0.5) * s.size,
          vx: s.vx * 0.3 + Math.cos(a) * sp,
          vy: s.vy * 0.55 + Math.sin(a) * sp * 0.6,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 12,
          size: s.size * (0.3 + Math.random() * 0.4),
          life: 0.8 + Math.random() * 0.7,
          maxLife: 1.5,
          seed: Math.random() * 10,
        });
      }
    };

    const drawShape = (
      x: number,
      y: number,
      size: number,
      rot: number,
      kind: string,
      r: number,
      g: number,
      b: number,
      alpha: number,
      width = 1
    ) => {
      const { verts, edges } = SHAPES[kind];
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const pts = verts.map((v) => {
        const rxv = v.x * cos - v.z * sin;
        const rz = v.x * sin + v.z * cos;
        const scale = 200 / (200 + rz * size);
        return { x: x + rxv * size * scale, y: y + v.y * size * scale };
      });
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      ctx.lineWidth = width;
      for (const [a, bb] of edges) {
        ctx.beginPath();
        ctx.moveTo(pts[a].x, pts[a].y);
        ctx.lineTo(pts[bb].x, pts[bb].y);
        ctx.stroke();
      }
    };

    /* ---- mouse parallax ---- */
    const mouse = { x: 0.5, tx: 0.5 };
    const onPointer = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      if (r.width < 1) return;
      mouse.tx = (e.clientX - r.left) / r.width;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    /* ---- fill ---- */
    let fillTarget = reduced ? 1 : 0;
    let fillCur = reduced ? 1 : 0;
    const writeLost = () => {
      lostEl.textContent = String(Math.min(lost, 9999));
    };

    /* ---- solid ground ---- */
    let ditherPattern: CanvasPattern | null = null;
    const buildDither = () => {
      const pc = document.createElement("canvas");
      pc.width = 4;
      pc.height = 4;
      const px = pc.getContext("2d")!;
      px.fillStyle = "rgba(255,255,255,0.85)";
      px.fillRect(0, 0, 1.4, 1.4);
      px.fillRect(2, 2, 1.4, 1.4);
      ditherPattern = ctx.createPattern(pc, "repeat");
    };

    const drawCliff = (edgeX: number, left: boolean, par: number) => {
      const x0 = left ? 0 : edgeX;
      const x1 = left ? edgeX : W;

      if (ditherPattern) {
        ctx.save();
        ctx.fillStyle = ditherPattern;
        ctx.globalAlpha = 0.09;
        ctx.fillRect(x0, py + 1, x1 - x0, 54);
        ctx.globalAlpha = 0.045;
        ctx.fillRect(x0, py + 55, x1 - x0, 80);
        ctx.restore();
      }

      for (let i = 0; i < 14; i++) {
        const depth = 5 + i * i * 1.55;
        const y0 = py + depth;
        if (y0 > H - 8) break;
        const a = 0.3 * (1 - i / 15.5);
        const wob = 2 + i * 1.3;
        const pull = vhash(i * 7.3, left ? 1 : 2) * 16 + par * (i + 1) * 1.6;
        ctx.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const bx0 = left ? 0 : edgeX + pull;
        const bx1 = left ? edgeX - pull : W;
        for (let x = bx0; x <= bx1; x += 9) {
          const y = y0 + Math.sin(x * 0.014 + i * 2.1 + time * 0.1) * wob * 0.4 + Math.sin(x * 0.043 + i * 4.7) * wob * 0.2;
          if (x === bx0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // the wall runs the FULL depth, tapering inward as it falls —
      // perspective: the tear converges into the dark
      ctx.beginPath();
      ctx.moveTo(edgeX, py);
      const wallSteps = 16;
      for (let i = 1; i <= wallSteps; i++) {
        const t = i / wallSteps;
        const yy = py + (H - py) * t;
        const taper = (left ? 1 : -1) * t * t * 26; // converges with depth
        const jag = (left ? -1 : 1) * (vhash(i * 3.1, left ? 5 : 9) * 12) * (1 - t * 0.5);
        ctx.lineTo(edgeX + taper + jag, yy);
      }
      const faceGrad = ctx.createLinearGradient(0, py, 0, H);
      faceGrad.addColorStop(0, "rgba(255,255,255,0.5)");
      faceGrad.addColorStop(0.55, "rgba(255,255,255,0.14)");
      faceGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = faceGrad;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      // faint inner echo of the wall — a second face deeper in, parallax-shifted
      ctx.beginPath();
      ctx.moveTo(edgeX + (left ? 10 : -10) + par * 4, py + 30);
      for (let i = 2; i <= wallSteps; i++) {
        const t = i / wallSteps;
        const yy = py + (H - py) * t;
        const taper = (left ? 1 : -1) * t * t * 40;
        const jag = (left ? -1 : 1) * (vhash(i * 7.9, left ? 11 : 13) * 9) * (1 - t * 0.5);
        ctx.lineTo(edgeX + (left ? 10 : -10) + par * 4 + taper + jag, yy);
      }
      const echoGrad = ctx.createLinearGradient(0, py, 0, H);
      echoGrad.addColorStop(0, "rgba(255,255,255,0.16)");
      echoGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = echoGrad;
      ctx.lineWidth = 1;
      ctx.stroke();

      // lip glint
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(edgeX, py);
      ctx.lineTo(edgeX, py + 14);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, py);
      ctx.lineTo(x1, py);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.beginPath();
      ctx.moveTo(edgeX, py - 4);
      ctx.lineTo(edgeX, py + 8);
      ctx.stroke();
    };

    /* ---- the bridge: a glowing TRUSS that MATERIALISES member by member ---
       two parallel chords, X-lattice bracing, lit joints — a structure with
       substance, assembling through a Bayer ordering                        */
    const PANELS = 16;
    type Part = { kind: "chordT" | "chordB" | "diagA" | "diagB" | "post" | "joint"; i: number; th: number };
    const parts: Part[] = [];
    {
      // BUILT LEFT TO RIGHT: a construction front sweeps across the span;
      // each panel assembles its members in quick succession as it arrives
      const KIND_DELAY: Record<Part["kind"], number> = {
        post: 0,
        chordT: 0.012,
        chordB: 0.024,
        diagA: 0.04,
        diagB: 0.055,
        joint: 0.07,
      };
      const push = (kind: Part["kind"], i: number, of: number) =>
        parts.push({ kind, i, th: (i / of) * 0.78 + KIND_DELAY[kind] });
      for (let i = 0; i < PANELS; i++) push("chordT", i, PANELS);
      for (let i = 0; i < PANELS; i++) push("chordB", i, PANELS);
      for (let i = 0; i < PANELS; i++) push("diagA", i, PANELS);
      for (let i = 0; i < PANELS; i++) push("diagB", i, PANELS);
      for (let i = 0; i <= PANELS; i++) push("post", i, PANELS + 1);
      for (let i = 0; i <= PANELS; i++) push("joint", i, PANELS + 1);
    }

    /* ---- one frame ---- */
    const step = (dt: number) => {
      if (W < 10) return;
      time += dt;
      fillCur += (fillTarget - fillCur) * Math.min(1, dt * 3.0);
      const fill = fillCur;
      const span = rx - lx;
      const matProg = Math.min(1, Math.max(0, (fill - 0.42) / 0.28)); // the bridge materialises
      const focusT = Math.min(1, Math.max(0, (fill - 0.66) / 0.14)); // the swarm recedes
      const heroT = Math.min(1, Math.max(0, (fill - 0.7) / 0.28)); // the one that crosses
      mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 5);
      const par = (mouse.x - 0.5) * 2;

      ctx.clearRect(0, 0, W, H);

      /* dust — three parallax strata sinking at different rates */
      for (let i = 0; i < 70; i++) {
        const layer = i % 3; // 0 near · 1 mid · 2 far
        const px = lx + vhash(i * 7.7, 3.1) * span + par * (6 - layer * 2);
        const speed = (14 - layer * 4) + vhash(i * 3.3, 9.7) * 10;
        const yy = py + 16 + ((vhash(i * 1.9, 5.5) * (H - py) + time * speed) % (H - py - 20));
        const depth = (yy - py) / (H - py);
        const a = (0.13 - layer * 0.035) * (1 - depth * 0.85);
        if (a < 0.01) continue;
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        const sz = 1.6 - layer * 0.4;
        ctx.fillRect(px, yy, sz, sz);
      }

      /* ghost type — integer placement so the dither never resamples soft */
      if (textW > 2) {
        ctx.globalAlpha = 0.2;
        ctx.drawImage(
          textCanvas,
          Math.round((lx + rx) / 2 - textW / dpr / 2),
          Math.round(py + (H - py) * 0.58 - textH / dpr / 2),
          Math.round(textW / dpr),
          Math.round(textH / dpr)
        );
        ctx.globalAlpha = 1;
      }

      drawCliff(lx, true, par);
      drawCliff(rx, false, par);

      /* THE WATERFALL — hundreds pour over the edge and dissolve */
      spawnT -= dt;
      while (spawnT <= 0) {
        if (focusT < 0.6) spawn(); // the flow stops once the one takes focus
        spawnT += 0.045; // ~22/s
      }
      const swarmDim = 1 - focusT; // the crowd FADES once the one takes focus
      for (let i = swarm.length - 1; i >= 0; i--) {
        const s = swarm[i];
        s.rot += s.rotSpeed * dt;
        if (s.state === 0) {
          s.opacity = Math.min(1, s.opacity + dt * 2);
          s.x += s.vx * dt;
          if (s.x >= lx - 4) {
            s.state = 1;
            s.vy = 20;
            // some carry momentum further into the void — a wider spray
            if (Math.random() < 0.3) s.vx *= 1.7;
            lost++;
            writeLost();
          }
        } else {
          s.vy += dt * 300;
          s.y += s.vy * dt;
          s.x += s.vx * dt * 0.34; // the arc off the lip
          s.vx *= 1 - dt * 0.9;
          s.rot += s.vy * dt * 0.0022;
          const depth = (s.y - py) / (H - py);
          if (depth >= s.shatterDepth) {
            // the idea BREAKS — wireframe shards tumble on separately
            shatter(s);
            swarm.splice(i, 1);
            continue;
          }
          s.opacity = Math.max(0, 1 - depth * 1.15);
          if (s.opacity <= 0 || s.y > H + 20) {
            swarm.splice(i, 1);
            continue;
          }
        }
        const bob = s.state === 0 ? Math.sin(time * 1.3 + s.phase) * 1.6 : 0;
        drawShape(s.x, s.y + bob, s.size, s.rot, s.kind, 225, 232, 227, s.opacity * 0.5 * swarmDim);
      }

      /* shards — the broken pieces, tumbling and fading */
      for (let i = shards.length - 1; i >= 0; i--) {
        const sh = shards[i];
        sh.life -= dt;
        if (sh.life <= 0 || sh.y > H + 12) {
          shards.splice(i, 1);
          continue;
        }
        sh.vy += dt * 210;
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        sh.vx *= 1 - dt * 0.5;
        sh.rot += sh.rotSpeed * dt;
        const lf = sh.life / sh.maxLife;
        const flash = Math.min(1, Math.max(0, (lf - 0.82) / 0.18)); // bright at the break
        const a = (lf * 0.55 + flash * 0.4) * swarmDim;
        ctx.strokeStyle = `rgba(${235 + Math.round(20 * flash)},${240},${236},${a.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let k = 0; k < 3; k++) {
          const ang = sh.rot + sh.seed + (k * Math.PI * 2) / 3;
          const rr = sh.size * (0.55 + 0.45 * vhash(sh.seed, k));
          const px = sh.x + Math.cos(ang) * rr;
          const pyy = sh.y + Math.sin(ang) * rr;
          if (k === 0) ctx.moveTo(px, pyy);
          else ctx.lineTo(px, pyy);
        }
        ctx.closePath();
        ctx.stroke();
      }

      /* THE BRIDGE — a glowing truss, materialising member by member */
      const trussH = Math.max(14, Math.min(20, H * 0.022));
      if (matProg > 0.001) {
        // no area glows inside the void — the tear stays pure black; the
        // structure's own members and joints carry all the light
        const panelX = (i: number) => lx + (span * i) / PANELS;
        for (const part of parts) {
          const a = Math.min(1, Math.max(0, (matProg - part.th) / 0.16));
          if (a <= 0.001) continue;
          const shimmer = (1 - a) * 0.7; // bright as each member lands
          const col = (base: number) =>
            `rgba(${GREEN.r + Math.round(70 * shimmer)},${GREEN.g + Math.round(32 * shimmer)},${GREEN.b + Math.round(70 * shimmer)},${Math.min(1, base * a + shimmer).toFixed(3)})`;
          if (part.kind === "chordT" || part.kind === "chordB") {
            const y = part.kind === "chordT" ? py : py + trussH;
            ctx.strokeStyle = col(part.kind === "chordT" ? 0.9 : 0.75);
            ctx.lineWidth = part.kind === "chordT" ? 2.4 : 2;
            ctx.beginPath();
            ctx.moveTo(panelX(part.i), y);
            ctx.lineTo(panelX(part.i + 1), y);
            ctx.stroke();
          } else if (part.kind === "diagA" || part.kind === "diagB") {
            ctx.strokeStyle = col(0.42);
            ctx.lineWidth = 1;
            ctx.beginPath();
            if (part.kind === "diagA") {
              ctx.moveTo(panelX(part.i), py);
              ctx.lineTo(panelX(part.i + 1), py + trussH);
            } else {
              ctx.moveTo(panelX(part.i), py + trussH);
              ctx.lineTo(panelX(part.i + 1), py);
            }
            ctx.stroke();
          } else if (part.kind === "post") {
            ctx.strokeStyle = col(0.55);
            ctx.lineWidth = part.i === 0 || part.i === PANELS ? 2.2 : 1;
            ctx.beginPath();
            ctx.moveTo(panelX(part.i), py);
            ctx.lineTo(panelX(part.i), py + trussH);
            ctx.stroke();
          } else {
            // lit joints on the top chord
            const x = panelX(part.i);
            const jg = ctx.createRadialGradient(x, py, 0, x, py, 5);
            jg.addColorStop(0, `rgba(220,255,210,${(0.8 * a + shimmer).toFixed(3)})`);
            jg.addColorStop(1, "rgba(145,217,130,0)");
            ctx.fillStyle = jg;
            ctx.fillRect(x - 5, py - 5, 10, 10);
          }
        }
      }

      /* THE ONE — the singular green idea that crosses */
      if (heroT > 0.001) {
        const size = 17;
        let hx: number;
        if (heroT < 0.2) {
          hx = lx - 240 + (240 - 4) * (heroT / 0.2);
        } else if (heroT < 0.88) {
          hx = lx - 4 + (span + 8) * ((heroT - 0.2) / 0.68);
        } else {
          const t = (heroT - 0.88) / 0.12;
          hx = rx + 4 + 42 * (1 - (1 - t) * (1 - t));
        }
        const hy = py - size * 0.95;
        const rot = time * 0.5;
        // the focus glow
        const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 34);
        glow.addColorStop(0, `rgba(${GREEN.r},${GREEN.g},${GREEN.b},0.22)`);
        glow.addColorStop(1, "rgba(145,217,130,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(hx - 34, hy - 34, 68, 68);
        drawShape(hx, hy, size, rot, "diamond", GREEN.r, GREEN.g, GREEN.b, 0.95, 1.5);

        if (heroT >= 0.99 && !fundedShown) {
          fundedShown = true;
          fundedEl.textContent = "01";
        }
        if (heroT < 0.99 && fundedShown) {
          fundedShown = false;
          fundedEl.textContent = "00";
        }
      }
      fundedRow.style.opacity = String(Math.min(1, Math.max(0, (matProg - 0.7) / 0.3)));

      /* the mark above the truss */
      const mo = Math.min(1, Math.max(0, (matProg - 0.9) / 0.1));
      mark.style.opacity = String(mo);
      mark.style.transform = `translate(-50%, calc(-100% - ${16 + (1 - mo) * 8}px))`;
    };

    (host as ChasmHost).__step = (dt: number) => step(dt);
    (host as ChasmHost).__scroll = (p: number) => {
      // the section is pinned; the story unfolds over the whole pinned scroll
      fillTarget = Math.min(1, Math.max(0, p / 0.92));
    };
    (host as ChasmHost).__fill = (v: number) => {
      fillTarget = fillCur = Math.min(1, Math.max(0, v));
    };

    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
    });
    io.observe(host);

    let raf = 0;
    let disposed = false;
    if (!reduced) {
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

    const applySize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w < 4 || h < 4 || (w === W && h === H)) return;
      W = w;
      H = h;
      py = CHASM.platformY * h;
      lx = CHASM.leftEdge * w;
      rx = CHASM.rightEdge * w;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDither();
      buildGhostType();
      // the visitor arrives to a waterfall already in full flow
      if (!warmed && !reduced) {
        warmed = true;
        for (let i = 0; i < 600; i++) step(1 / 60);
      }
      if (reduced) {
        for (let i = 0; i < 240; i++) step(1 / 60);
      }
    };
    applySize();
    const ro = new ResizeObserver(applySize);
    ro.observe(host);
    document.fonts?.ready.then(() => buildGhostType());
    writeLost();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      delete (host as ChasmHost).__step;
      delete (host as ChasmHost).__scroll;
      delete (host as ChasmHost).__fill;
      if (canvas.parentElement === host) host.removeChild(canvas);
    };
  }, []);

  return (
    <div ref={hostRef} data-gap-chasm aria-hidden className={`pointer-events-none ${className}`}>
      {/* map annotations */}
      <div
        className="absolute font-mono text-[10px] tracking-[0.22em] uppercase text-white/45"
        style={{ left: "3%", top: `calc(${CHASM.platformY * 100}% + 14px)` }}
      >
        Solo builders →
      </div>
      <div
        ref={fundedRowRef}
        className="absolute font-mono text-[10px] tracking-[0.22em] uppercase text-accent/70 text-right"
        style={{ right: "3%", top: `calc(${CHASM.platformY * 100}% + 14px)`, opacity: 0 }}
      >
        Funded · <span ref={fundedRef} className="text-accent">00</span>
      </div>

      {/* the mark above the cable */}
      <div
        ref={markRef}
        className="absolute text-center whitespace-nowrap"
        style={{ left: `${((CHASM.leftEdge + CHASM.rightEdge) / 2) * 100}%`, top: `${CHASM.platformY * 100}%`, transform: "translate(-50%, -100%)", opacity: 0 }}
      >
        <div className="font-display font-bold text-[clamp(15px,1.3vw,21px)] tracking-[-0.02em] text-accent">VIBESTARTER</div>
      </div>

      {/* the score the void keeps — centred on the gap */}
      <div
        className="absolute font-mono text-[10px] tracking-[0.22em] uppercase text-center whitespace-nowrap"
        style={{ left: `${((CHASM.leftEdge + CHASM.rightEdge) / 2) * 100}%`, bottom: "5%", transform: "translateX(-50%)" }}
      >
        <span className="text-white/40">Lost to the gap · </span>
        <span ref={lostRef} className="text-white/75">0</span>
      </div>
    </div>
  );
}
