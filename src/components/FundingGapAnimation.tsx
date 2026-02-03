"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Layout constants
const LEFT_PLATFORM = 0.25;
const RIGHT_PLATFORM = 0.75;
const PLATFORM_Y = 0.42;

interface WireframeShape {
  x: number;
  y: number;
  z: number;
  vy: number; // vertical velocity for gravity
  rotation: number;
  rotationSpeed: number;
  type: "diamond" | "tetra" | "cube";
  size: number;
  phase: number;
  crossed: boolean;
  opacity: number;
  state: "waiting" | "crossing" | "arrived" | "falling";
  progress: number;
}

// Void particles that drift downward
interface VoidParticle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
}

export function FundingGapAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<WireframeShape[]>([]);
  const voidParticlesRef = useRef<VoidParticle[]>([]);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [crossedCount, setCrossedCount] = useState(0);
  const crossedCountRef = useRef(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();

    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    const leftX = LEFT_PLATFORM * width;
    const rightX = RIGHT_PLATFORM * width;
    const platformY = PLATFORM_Y * height;

    // Colors
    const lineColor = "rgba(255, 255, 255, 0.15)";
    const lineColorBright = "rgba(255, 255, 255, 0.25)";
    const accentColor = "rgba(122, 201, 104, 0.8)";
    const accentColorDim = "rgba(122, 201, 104, 0.35)";
    const dashedColor = "rgba(255, 255, 255, 0.08)";

    // Project 3D to 2D with simple perspective
    const project = (x: number, y: number, z: number, centerX: number, centerY: number) => {
      const scale = 200 / (200 + z);
      return {
        x: centerX + x * scale,
        y: centerY + y * scale,
        scale,
      };
    };

    // Draw wireframe diamond (octahedron)
    const drawDiamond = (cx: number, cy: number, size: number, rotation: number, color: string, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      // Diamond vertices
      const vertices = [
        { x: 0, y: -size, z: 0 },      // top
        { x: size * 0.7, y: 0, z: 0 }, // right
        { x: 0, y: 0, z: size * 0.7 }, // front
        { x: -size * 0.7, y: 0, z: 0 },// left
        { x: 0, y: 0, z: -size * 0.7 },// back
        { x: 0, y: size, z: 0 },       // bottom
      ];

      // Rotate around Y axis
      const rotated = vertices.map(v => ({
        x: v.x * cos - v.z * sin,
        y: v.y,
        z: v.x * sin + v.z * cos,
      }));

      const projected = rotated.map(v => project(v.x, v.y, v.z, cx, cy));

      // Draw edges
      const edges = [
        [0, 1], [0, 2], [0, 3], [0, 4], // top to middle
        [5, 1], [5, 2], [5, 3], [5, 4], // bottom to middle
        [1, 2], [2, 3], [3, 4], [4, 1], // middle ring
      ];

      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a].x, projected[a].y);
        ctx.lineTo(projected[b].x, projected[b].y);
        ctx.stroke();
      });

      ctx.restore();
    };

    // Draw wireframe tetrahedron
    const drawTetra = (cx: number, cy: number, size: number, rotation: number, color: string, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      const h = size * 0.8;
      const vertices = [
        { x: 0, y: -h, z: 0 },
        { x: size * 0.7, y: h * 0.5, z: -size * 0.4 },
        { x: -size * 0.7, y: h * 0.5, z: -size * 0.4 },
        { x: 0, y: h * 0.5, z: size * 0.6 },
      ];

      const rotated = vertices.map(v => ({
        x: v.x * cos - v.z * sin,
        y: v.y,
        z: v.x * sin + v.z * cos,
      }));

      const projected = rotated.map(v => project(v.x, v.y, v.z, cx, cy));

      const edges = [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]];
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a].x, projected[a].y);
        ctx.lineTo(projected[b].x, projected[b].y);
        ctx.stroke();
      });

      ctx.restore();
    };

    // Draw wireframe cube
    const drawCube = (cx: number, cy: number, size: number, rotation: number, color: string, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const s = size * 0.5;

      const vertices = [
        { x: -s, y: -s, z: -s }, { x: s, y: -s, z: -s },
        { x: s, y: -s, z: s }, { x: -s, y: -s, z: s },
        { x: -s, y: s, z: -s }, { x: s, y: s, z: -s },
        { x: s, y: s, z: s }, { x: -s, y: s, z: s },
      ];

      const rotated = vertices.map(v => ({
        x: v.x * cos - v.z * sin,
        y: v.y,
        z: v.x * sin + v.z * cos,
      }));

      const projected = rotated.map(v => project(v.x, v.y, v.z, cx, cy));

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a].x, projected[a].y);
        ctx.lineTo(projected[b].x, projected[b].y);
        ctx.stroke();
      });

      ctx.restore();
    };

    // Draw platform (simple wireframe structure)
    const drawPlatform = (x: number, y: number, w: number, isLeft: boolean) => {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      // Main platform line
      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(x - w, y);
        ctx.lineTo(x, y);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
      }
      ctx.stroke();

      // Vertical supports
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = dashedColor;
      const supportCount = 3;
      for (let i = 0; i <= supportCount; i++) {
        const sx = isLeft ? x - w + (w / supportCount) * i : x + (w / supportCount) * i;
        ctx.beginPath();
        ctx.moveTo(sx, y);
        ctx.lineTo(sx, y + 60);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Edge detail
      ctx.strokeStyle = lineColorBright;
      ctx.beginPath();
      ctx.moveTo(isLeft ? x : x, y - 2);
      ctx.lineTo(isLeft ? x : x, y + 8);
      ctx.stroke();
    };

    // Draw the bridge (VIBESTARTER)
    const drawBridge = (progress: number, timestamp: number) => {
      const bridgeWidth = rightX - leftX;
      const segments = 14;
      const segmentWidth = bridgeWidth / segments;
      const maxSag = 30;

      // Bridge glow underneath - layered approach for smoother fade
      const glowCenterX = (leftX + rightX) / 2;
      const glowCenterY = platformY + maxSag / 2;
      const maxGlowRadius = bridgeWidth * 0.6;

      // Multiple overlapping radial layers
      for (let layer = 0; layer < 5; layer++) {
        const radius = maxGlowRadius * (1 - layer * 0.15);
        const opacity = 0.012 - layer * 0.002;
        const glowGradient = ctx.createRadialGradient(
          glowCenterX, glowCenterY, 0,
          glowCenterX, glowCenterY, radius
        );
        glowGradient.addColorStop(0, `rgba(122, 201, 104, ${opacity})`);
        glowGradient.addColorStop(1, "rgba(122, 201, 104, 0)");
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(glowCenterX, glowCenterY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bridge cables (curved)
      ctx.strokeStyle = accentColorDim;
      ctx.lineWidth = 1;

      for (let i = 0; i <= segments; i++) {
        const x = leftX + segmentWidth * i;
        const sag = Math.sin((i / segments) * Math.PI) * maxSag;

        if (i < segments * progress) {
          ctx.beginPath();
          ctx.moveTo(x, platformY);
          ctx.lineTo(x, platformY + sag + 12);
          ctx.stroke();
        }
      }

      // Main bridge line (thicker, more prominent)
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(leftX, platformY);

      for (let i = 1; i <= segments * progress; i++) {
        const x = leftX + segmentWidth * i;
        const sag = Math.sin((i / segments) * Math.PI) * maxSag;
        ctx.lineTo(x, platformY + sag);
      }
      ctx.stroke();

      // Bridge deck (dashed)
      if (progress > 0.2) {
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = accentColorDim;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftX, platformY + 10);

        for (let i = 1; i <= segments * progress; i++) {
          const x = leftX + segmentWidth * i;
          const sag = Math.sin((i / segments) * Math.PI) * maxSag;
          ctx.lineTo(x, platformY + sag + 10);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // VIBESTARTER label above the bridge
      const labelX = (leftX + rightX) / 2;
      const labelY = platformY - 12;

      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(122, 201, 104, 0.9)";
      ctx.fillText("VIBESTARTER", labelX, labelY);

      // Small decorative lines
      ctx.strokeStyle = "rgba(122, 201, 104, 0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(labelX - 50, labelY + 1);
      ctx.lineTo(labelX - 38, labelY + 1);
      ctx.moveTo(labelX + 38, labelY + 1);
      ctx.lineTo(labelX + 50, labelY + 1);
      ctx.stroke();
    };

    // Create initial shapes - MOST ideas fail (only ~10% cross)
    const createShape = (index: number): WireframeShape => {
      const types: Array<"diamond" | "tetra" | "cube"> = ["diamond", "tetra", "cube"];
      const willCross = Math.random() < 0.10; // Only 10% make it
      return {
        x: leftX - 60 - index * 45 - Math.random() * 25,
        y: platformY - 28 - Math.random() * 12,
        z: Math.random() * 40 - 20,
        vy: 0, // Start with no vertical velocity
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: 0.006 + Math.random() * 0.006,
        type: types[Math.floor(Math.random() * types.length)],
        size: 12 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
        crossed: willCross,
        opacity: 0,
        state: "waiting",
        progress: 0,
      };
    };

    // Create void particles - very subtle
    const createVoidParticle = (): VoidParticle => ({
      x: leftX + Math.random() * (rightX - leftX),
      y: platformY + 20 + Math.random() * 30,
      speed: 0.15 + Math.random() * 0.25, // Slower
      size: 0.5 + Math.random() * 0.8, // Smaller
      opacity: 0.04 + Math.random() * 0.06, // Much more subtle
    });

    // Initialize void particles
    for (let i = 0; i < 20; i++) {
      const p = createVoidParticle();
      p.y = platformY + Math.random() * (height - platformY - 50);
      voidParticlesRef.current.push(p);
    }

    // Initialize shapes
    for (let i = 0; i < 6; i++) {
      shapesRef.current.push(createShape(i));
    }

    let lastSpawn = 0;
    const bridgeProgress = { value: 1 }; // Bridge already complete, no animation

    const animate = (timestamp: number) => {
      timeRef.current = timestamp;
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      // Subtle grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // THE VOID - single gradient with many stops for smooth transition
      const voidWidth = rightX - leftX + 20;
      const voidLeft = leftX - 10;
      const voidTop = platformY + 5;

      const voidGradient = ctx.createLinearGradient(0, voidTop, 0, height);
      // Many color stops for smooth gradient (avoiding banding)
      voidGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      voidGradient.addColorStop(0.05, "rgba(0, 0, 0, 0.02)");
      voidGradient.addColorStop(0.1, "rgba(0, 0, 0, 0.05)");
      voidGradient.addColorStop(0.15, "rgba(0, 0, 0, 0.08)");
      voidGradient.addColorStop(0.2, "rgba(0, 0, 0, 0.12)");
      voidGradient.addColorStop(0.25, "rgba(0, 0, 0, 0.16)");
      voidGradient.addColorStop(0.3, "rgba(0, 0, 0, 0.21)");
      voidGradient.addColorStop(0.35, "rgba(0, 0, 0, 0.27)");
      voidGradient.addColorStop(0.4, "rgba(0, 0, 0, 0.33)");
      voidGradient.addColorStop(0.45, "rgba(0, 0, 0, 0.40)");
      voidGradient.addColorStop(0.5, "rgba(0, 0, 0, 0.47)");
      voidGradient.addColorStop(0.55, "rgba(0, 0, 0, 0.54)");
      voidGradient.addColorStop(0.6, "rgba(0, 0, 0, 0.62)");
      voidGradient.addColorStop(0.65, "rgba(0, 0, 0, 0.70)");
      voidGradient.addColorStop(0.7, "rgba(0, 0, 0, 0.78)");
      voidGradient.addColorStop(0.75, "rgba(0, 0, 0, 0.85)");
      voidGradient.addColorStop(0.8, "rgba(0, 0, 0, 0.91)");
      voidGradient.addColorStop(0.85, "rgba(0, 0, 0, 0.95)");
      voidGradient.addColorStop(0.9, "rgba(0, 0, 0, 0.98)");
      voidGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
      ctx.fillStyle = voidGradient;
      ctx.fillRect(voidLeft, voidTop, voidWidth, height - voidTop);

      // Update and draw void particles (drifting downward)
      for (const p of voidParticlesRef.current) {
        p.y += p.speed;

        // Reset particle when it goes off screen
        if (p.y > height) {
          p.y = platformY + 20;
          p.x = leftX + Math.random() * (rightX - leftX);
        }

        // Fade out as particles go deeper
        const depth = (p.y - platformY) / (height - platformY);
        const fadeOpacity = p.opacity * (1 - depth * 0.8);

        ctx.fillStyle = `rgba(255, 255, 255, ${fadeOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw platforms
      drawPlatform(leftX, platformY, width * 0.22, true);
      drawPlatform(rightX, platformY, width * 0.22, false);

      // Draw bridge (no animation, always complete)
      drawBridge(1, timestamp);

      // FUNDING GAP text - drawn on canvas for prominence, positioned lower in the void
      const gapCenterX = (leftX + rightX) / 2;
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fillText("FUNDING GAP", gapCenterX, platformY + 120);

      // Decorative lines around text
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gapCenterX - 80, platformY + 120);
      ctx.lineTo(gapCenterX - 50, platformY + 120);
      ctx.moveTo(gapCenterX + 50, platformY + 120);
      ctx.lineTo(gapCenterX + 80, platformY + 120);
      ctx.stroke();

      // Spawn new shapes (more frequently to show more failing)
      if (timestamp - lastSpawn > 1800 && shapesRef.current.length < 15) {
        shapesRef.current.push(createShape(0));
        lastSpawn = timestamp;
      }

      // Update and draw shapes
      const newShapes: WireframeShape[] = [];

      for (const shape of shapesRef.current) {
        shape.rotation += shape.rotationSpeed;
        const floatY = Math.sin(timestamp * 0.001 + shape.phase) * 4;

        switch (shape.state) {
          case "waiting":
            shape.opacity = Math.min(1, shape.opacity + 0.02);
            shape.x += 0.5;

            // Only transition when going over the cliff edge
            if (shape.x >= leftX + 10) {
              if (shape.crossed && bridgeProgress.value > 0.9) {
                shape.state = "crossing";
              } else if (!shape.crossed) {
                // Go over the edge, then fall
                shape.state = "falling";
                shape.vy = 0.5; // Initial small velocity
              } else {
                shape.x = leftX - 15; // Wait for bridge
              }
            }
            break;

          case "crossing":
            shape.progress += 0.008;
            const bridgeX = leftX + (rightX - leftX) * shape.progress;
            const sag = Math.sin(shape.progress * Math.PI) * 25;
            shape.x = bridgeX;
            shape.y = platformY + sag - 25;

            if (shape.progress >= 1) {
              shape.state = "arrived";
              crossedCountRef.current++;
              setCrossedCount(crossedCountRef.current);
            }
            break;

          case "arrived":
            shape.x += 0.3;
            shape.opacity -= 0.015;
            if (shape.opacity <= 0) continue;
            break;

          case "falling":
            // Gravity acceleration
            shape.vy += 0.15; // Accelerate downward
            shape.y += shape.vy;
            shape.x += 0.1; // Slight drift
            shape.rotation += 0.04 + shape.vy * 0.01; // Tumble faster as falling faster

            // Fade out gradually as it falls into the void
            const fallDepth = (shape.y - platformY) / (height - platformY);
            shape.opacity = Math.max(0, 1 - fallDepth * 1.2);

            if (shape.opacity <= 0 || shape.y > height + 20) continue;
            break;
        }

        // Draw shape
        const drawY = shape.state === "crossing" ? shape.y : shape.y + floatY;
        // Funded shapes are green, others are white/gray
        const color = shape.crossed ? accentColor : lineColorBright;

        if (shape.type === "diamond") {
          drawDiamond(shape.x, drawY, shape.size, shape.rotation, color, shape.opacity);
        } else if (shape.type === "tetra") {
          drawTetra(shape.x, drawY, shape.size, shape.rotation, color, shape.opacity);
        } else {
          drawCube(shape.x, drawY, shape.size, shape.rotation, color, shape.opacity);
        }

        // Draw connector line to platform for waiting shapes
        if (shape.state === "waiting" && shape.x > leftX - 100) {
          ctx.setLineDash([2, 3]);
          ctx.strokeStyle = `rgba(255, 255, 255, ${shape.opacity * 0.1})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(shape.x, drawY + shape.size);
          ctx.lineTo(shape.x, platformY);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        newShapes.push(shape);
      }

      shapesRef.current = newShapes;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      shapesRef.current = [];
      voidParticlesRef.current = [];
    };
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[350px] bg-[#0a0a0a] overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Ideas label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute left-4 top-4 z-10"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-black/30">
          <div className="w-1.5 h-1.5 bg-white/40" />
          <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Ideas</span>
        </div>
      </motion.div>

      {/* Success label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute right-4 top-4 z-10"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 border border-accent/20 bg-black/30">
          <span className="text-[10px] text-accent/60 font-mono uppercase tracking-wider">Funded</span>
          <div className="w-1.5 h-1.5 bg-accent/60" />
        </div>
      </motion.div>

{/* Gap label removed - now drawn on canvas for better visibility */}

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-4 right-4 z-10"
      >
        <div className="flex items-center justify-between py-2 px-3 border border-white/5 bg-black/50">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/60 font-mono">90% of ideas fail without funding</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-accent/70 animate-pulse" />
            <span className="text-[10px] font-mono text-accent/70">{crossedCount} funded</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
