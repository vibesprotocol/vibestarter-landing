"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Topographic contour field — the hero graphic. Brand-green elevation lines
 * drift slowly across black; the cursor raises the terrain, bending the
 * contours around it. Fine Bayer-dither shading fills the bands at a whisper.
 * One full-screen fragment shader; cheap, crisp, no geometry.
 *
 * Survey-map instrumentation rides on top: crosshair grid ticks with mono
 * coordinate labels, live elevation figures sampled from the same fbm the
 * shader draws, and a corner readout tracking the cursor — ground being
 * surveyed before anything is built on it.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uMark; // chevron-landform amplitude (1 = full; drives reveals)
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = r * p * 2.03;
      a *= 0.5;
    }
    return v;
  }

  float Bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2.0 + a.y * a.y * 0.75);
  }

  float sdSeg(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = vUv;
    p.x *= aspect;
    vec2 m = uMouse;
    m.x *= aspect;

    // the cursor raises the terrain
    float d = distance(p, m);
    float inf = exp(-d * d * 6.5);

    // the mark — the Vibestarter chevron as a landform. A ridge of elevation
    // shaped like >_ rises out of the terrain; the contours wrap around it
    // and the glyph emerges from the medium itself.
    // portrait: the landform sits in the open ground JUST BELOW the CTAs —
    // sized to that zone, optically centred, nothing covering it
    float gsc = aspect < 1.0 ? min(0.36 * aspect, 0.24) : 0.56;
    vec2 gc = aspect < 1.0 ? vec2(0.5 * aspect + 0.0625 * gsc, 0.115) : vec2(0.72 * aspect, 0.52);
    vec2 gq = (p - gc) / gsc;
    float d1 = sdSeg(gq, vec2(-0.8125, 0.5), vec2(-0.1875, 0.0));
    float d2 = sdSeg(gq, vec2(-0.1875, 0.0), vec2(-0.8125, -0.5));
    float d3 = sdSeg(gq, vec2(-0.0625, -0.5), vec2(0.6875, -0.5));
    float dm = min(min(d1, d2), d3);
    float ridge = exp(-(dm * dm) / 0.0056) * (0.85 + 0.06 * sin(uTime * 0.4)) * uMark;
    float calm = exp(-(dm * dm) / 0.09);

    // portrait terrain runs at a lower frequency so the ambient contours
    // don't tangle the (smaller) landform
    vec2 q = p * (aspect < 1.0 ? 1.9 : 2.4) + vec2(uTime * 0.020, -uTime * 0.013);
    float e = fbm(q) * (1.0 - 0.6 * calm * uMark) + ridge + inf * 0.42;

    float bands = e * 15.0;
    float fw = fwidth(bands);
    float c = fract(bands);
    float edge = min(c, 1.0 - c);
    float line = 1.0 - smoothstep(0.0, fw * 1.5, edge);

    vec3 GREEN = vec3(0.569, 0.851, 0.510);
    vec3 BLUE = vec3(0.051, 0.545, 0.792);
    float elev = smoothstep(0.2, 0.95, e);
    vec3 lineCol = mix(BLUE, GREEN, elev);
    // phones have no cursor raise and a veil over the claim — the ambient
    // contours need more of their own light to read at all
    float lineA = line * (0.10 + 0.42 * elev + inf * 0.55) * (aspect < 1.0 ? 1.55 : 1.0);

    // dither shading between contours, barely there
    float b = Bayer2(gl_FragCoord.xy / 4.0) * 0.25 + Bayer2(gl_FragCoord.xy / 2.0);
    float shade = step(b, c * 0.30 + inf * 0.22) * (0.030 + inf * 0.05);

    vec3 col = lineCol * lineA + GREEN * shade;
    float alpha = clamp(max(lineA * 0.85, shade * 2.0), 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

/* ---- TS port of the shader's elevation function (same constants) -------- */

function topoHash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function topoNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const ab = topoHash(ix, iy) + (topoHash(ix + 1, iy) - topoHash(ix, iy)) * ux;
  const cd = topoHash(ix, iy + 1) + (topoHash(ix + 1, iy + 1) - topoHash(ix, iy + 1)) * ux;
  return ab + (cd - ab) * uy;
}

function topoFbm(x: number, y: number): number {
  let v = 0;
  let a = 0.5;
  for (let i = 0; i < 5; i++) {
    v += a * topoNoise(x, y);
    // mat2(0.8, -0.6, 0.6, 0.8) * p, then * 2.03 — GLSL mat2 is column-major
    const nx = (0.8 * x + 0.6 * y) * 2.03;
    const ny = (-0.6 * x + 0.8 * y) * 2.03;
    x = nx;
    y = ny;
    a *= 0.5;
  }
  return v;
}

/* ---- survey grid geometry — 6 x 4 intersections, ~8% inset -------------- */

const COLS = Array.from({ length: 6 }, (_, i) => 8 + (i * 84) / 5);
const ROWS = Array.from({ length: 4 }, (_, j) => 8 + (j * 84) / 3);

/* the 8 most central intersections carry live elevation figures */
const ELEV_POINTS = ROWS.slice(1, 3).flatMap((topPct) =>
  COLS.slice(1, 5).map((leftPct) => ({ leftPct, topPct }))
);

const pad4 = (n: number) =>
  String(Math.max(0, Math.min(1024, Math.round(n)))).padStart(4, "0");

const fmt3 = (e: number) =>
  String(Math.max(0, Math.min(999, Math.round(e * 1000)))).padStart(3, "0");

export function TopoField({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const elevRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    // touch devices have no cursor — a resting raise would sit mid-screen as
    // a permanent bright bump whose contour rings read as stray dashed arcs.
    // Park it far off-field so the terrain carries only the mark.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const restX = coarse ? -3 : 0.68;
    const restY = coarse ? -3 : 0.55;
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uRes: { value: new THREE.Vector2(host.clientWidth, host.clientHeight) },
        uMouse: { value: new THREE.Vector2(restX, restY) },
        uTime: { value: 8 },
        uMark: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const target = new THREE.Vector2(restX, restY);
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // fingers aren't survey cursors
      const r = host.getBoundingClientRect();
      target.set(
        (e.clientX - r.left) / Math.max(1, r.width),
        1 - (e.clientY - r.top) / Math.max(1, r.height)
      );
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // elevation at a uv point — the exact math the fragment shader runs:
    // aspect-corrected p, gaussian cursor raise, drifting fbm domain, and
    // the chevron-mark ridge (kept in lockstep with the GLSL)
    const segDist = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
      const pax = px - ax;
      const pay = py - ay;
      const bax = bx - ax;
      const bay = by - ay;
      const h = Math.max(0, Math.min(1, (pax * bax + pay * bay) / (bax * bax + bay * bay)));
      return Math.hypot(pax - bax * h, pay - bay * h);
    };
    const sampleElev = (u: number, v: number): number => {
      const res = material.uniforms.uRes.value as THREE.Vector2;
      const aspect = res.x / Math.max(1, res.y);
      const mouse = material.uniforms.uMouse.value as THREE.Vector2;
      const px = u * aspect;
      const py = v;
      const dx = px - mouse.x * aspect;
      const dy = py - mouse.y;
      const inf = Math.exp(-(dx * dx + dy * dy) * 6.5);
      const t = material.uniforms.uTime.value as number;
      const gsc = aspect < 1 ? Math.min(0.36 * aspect, 0.24) : 0.56;
      const gcx = aspect < 1 ? 0.5 * aspect + 0.0625 * gsc : 0.72 * aspect;
      const gcy = aspect < 1 ? 0.115 : 0.52;
      const gx = (px - gcx) / gsc;
      const gy = (py - gcy) / gsc;
      const dm = Math.min(
        segDist(gx, gy, -0.8125, 0.5, -0.1875, 0.0),
        segDist(gx, gy, -0.1875, 0.0, -0.8125, -0.5),
        segDist(gx, gy, -0.0625, -0.5, 0.6875, -0.5)
      );
      const mk = material.uniforms.uMark.value as number;
      const ridge = Math.exp(-(dm * dm) / 0.0056) * (0.85 + 0.06 * Math.sin(t * 0.4)) * mk;
      const calm = Math.exp(-(dm * dm) / 0.09);
      const qf = aspect < 1 ? 1.9 : 2.4;
      return topoFbm(px * qf + t * 0.02, py * qf - t * 0.013) * (1 - 0.6 * calm * mk) + ridge + inf * 0.42;
    };

    // refs + textContent only — never setState from the step path
    const writeElevations = () => {
      for (let i = 0; i < ELEV_POINTS.length; i++) {
        const node = elevRefs.current[i];
        const pt = ELEV_POINTS[i];
        if (!node || !pt) continue;
        node.textContent = `· ${fmt3(sampleElev(pt.leftPct / 100, 1 - pt.topPct / 100))}`;
      }
    };
    const writeReadout = () => {
      const node = readoutRef.current;
      if (!node) return;
      const e = sampleElev(target.x, target.y);
      node.textContent = `X ${pad4(target.x * 1024)} · Y ${pad4((1 - target.y) * 1024)} · ELEV ${e.toFixed(3)}`;
    };

    let raf = 0;
    let disposed = false;
    let elevAcc = 0.25; // sample the figures on the first step, then every ~0.25s
    const start = performance.now();
    const step = (dt: number) => {
      if (disposed) return;
      material.uniforms.uTime.value += dt;
      const m = material.uniforms.uMouse.value as THREE.Vector2;
      m.lerp(target, 0.06);
      elevAcc += dt;
      if (elevAcc >= 0.25) {
        elevAcc = 0;
        writeElevations();
      }
      writeReadout();
      renderer.render(scene, camera);
    };
    // expose for the dev driver
    (host as unknown as Record<string, unknown>).__step = step;
    (host as unknown as Record<string, unknown>).__mark = (v: number) => {
      material.uniforms.uMark.value = v;
    };

    // ambient loop pauses while the field is offscreen (the dev driver calls
    // step() directly, so this gate never blocks manual stepping)
    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
    });
    io.observe(host);

    if (reduced) {
      renderer.render(scene, camera);
      // static figures matching the rendered frame — no live updates
      writeElevations();
      writeReadout();
    } else {
      let last = start;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (document.hidden || !inView) return;
        step(dt);
      };
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      (material.uniforms.uRes.value as THREE.Vector2).set(host.clientWidth, host.clientHeight);
      if (reduced) {
        // setSize clears the buffer — repaint the static frame and refresh
        // the figures so the readable state survives a resize
        renderer.render(scene, camera);
        writeElevations();
        writeReadout();
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden data-topo className={`pointer-events-none ${className}`}>
      {/* survey grid — crosshair ticks + edge coordinates, static */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        {COLS.map((cx, i) => (
          <text
            key={`t${i}`}
            x={`${cx}%`}
            y={20}
            textAnchor="middle"
            className="font-mono hidden sm:block"
            fontSize={10}
            letterSpacing={2}
            fill="rgba(255,255,255,0.18)"
          >
            {String((i + 1) * 100).padStart(4, "0")}
          </text>
        ))}
        {ROWS.map((ry, j) => (
          <text
            key={`l${j}`}
            x={10}
            y={`${ry}%`}
            dominantBaseline="middle"
            className="font-mono hidden sm:block"
            fontSize={10}
            letterSpacing={2}
            fill="rgba(255,255,255,0.18)"
          >
            {String((j + 1) * 100).padStart(4, "0")}
          </text>
        ))}
        {ROWS.map((ry, j) =>
          COLS.map((cx, i) => (
            <svg key={`x${i}-${j}`} x={`${cx}%`} y={`${ry}%`} overflow="visible" className="hidden sm:block">
              <path d="M-5 0H5M0 -5V5" stroke="rgba(255,255,255,0.10)" strokeWidth={1} />
            </svg>
          ))
        )}
      </svg>

      {/* live elevation figures at the central intersections */}
      {ELEV_POINTS.map((pt, i) => (
        <span
          key={`${pt.leftPct}-${pt.topPct}`}
          ref={(el) => {
            elevRefs.current[i] = el;
          }}
          className="absolute hidden sm:block font-mono text-[10px] tracking-[0.15em] text-accent/30 whitespace-nowrap"
          style={{ left: `${pt.leftPct}%`, top: `${pt.topPct}%`, transform: "translate(9px, -50%)" }}
        >
          · 000
        </span>
      ))}

      {/* corner readout — cursor position on the survey grid */}
      <div className="absolute bottom-7 right-5 sm:right-10 hidden sm:block text-right">
        <p className="font-mono text-[11px] tracking-[0.22em] text-white/45">
          <span ref={readoutRef}>X 0000 · Y 0000 · ELEV 0.000</span>
        </p>
        <p className="mt-1.5 font-mono text-[10px] tracking-[0.28em] uppercase text-accent/60">
          survey grid — base 8453
        </p>
      </div>
    </div>
  );
}
