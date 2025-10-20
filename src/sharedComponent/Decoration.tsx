"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type ShapeKind = "circle" | "square" | "triangle" | "ring" | "diamond";

type ShapeConfig = {
  id: string;
  kind: ShapeKind;
  size: number;
  opacity: number;
  hueVar: string;
  topPct: number;
  leftPct: number;
  driftX: number;
  driftY: number;
  rotate: number;
  duration: number;
  delay: number;
  z?: number;
};

/* ---------------- tiny PRNG from a runtime seed ---------------- */
const prand = (seed: number) => {
  let t = seed || 1;
  return () => {
    // xorshift32
    t ^= t << 13;
    t ^= t >> 17;
    t ^= t << 5;
    return ((t >>> 0) % 1_000_000) / 1_000_000; // [0,1)
  };
};

/* ---------------- helpers ---------------- */
function keepAwayFromCenter(
  topPct: number,
  leftPct: number,
  centerX: number,
  centerY: number,
  radiusPct: number
) {
  const dx = leftPct - centerX;
  const dy = topPct - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < radiusPct) {
    const k = radiusPct / (dist || 0.0001);
    return { top: centerY + dy * k, left: centerX + dx * k };
  }
  return { top: topPct, left: leftPct };
}

export type DecorationProps = {
  /** Random count between [minCount,maxCount] each load */
  minCount?: number; // default 10
  maxCount?: number; // default 22
  /** z-index for wrapper */
  zIndex?: number; // default 10
  /** Respect reduced motion automatically (kept simple: always animates, but you can wire a flag if needed) */
  className?: string;
  style?: React.CSSProperties;
  masked?: boolean; // default true
  avoidCenter?:
    | false
    | { xPct?: number; yPct?: number; radiusPct?: number }; // default {50,40,22}
  /** Optional: set to true to reuse the same random layout during a tab session (until refresh) */
  persistInSession?: boolean; // default false
  /** Session key when persistInSession = true */
  sessionKey?: string; // default "decoration-layout"
  /** Optional palette override */
  palette?: Partial<Record<ShapeKind, string>>;
};

export default function Decoration({
  minCount = 10,
  maxCount = 22,
  zIndex = 10,
  className = "",
  style,
  masked = true,
  avoidCenter = { xPct: 50, yPct: 40, radiusPct: 22 },
  persistInSession = false,
  sessionKey = "decoration-layout",
  palette,
}: DecorationProps) {
  // Avoid SSR hydration mismatches — only render after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Create a random seed once per mount (or load from session)
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    if (persistInSession && typeof window !== "undefined") {
      const saved = sessionStorage.getItem(sessionKey);
      if (saved) {
        setSeed(Number(saved));
        return;
      }
    }
    // Prefer crypto if available
    const randomSeed =
      typeof crypto !== "undefined" && "getRandomValues" in crypto
        ? crypto.getRandomValues(new Uint32Array(1))[0] || Math.floor(Math.random() * 1e9)
        : Math.floor(Math.random() * 1e9);

    setSeed(randomSeed);
    if (persistInSession && typeof window !== "undefined") {
      sessionStorage.setItem(sessionKey, String(randomSeed));
    }
  }, [persistInSession, sessionKey]);

  const shapes = useMemo<ShapeConfig[] | null>(() => {
    if (!mounted || seed == null) return null;

    const kinds: ShapeKind[] = ["circle", "square", "triangle", "ring", "diamond"];
    const rnd = prand(seed);

    // random count each load
    const countRange = Math.max(0, maxCount - minCount);
    const count = minCount + Math.floor(rnd() * (countRange + 1));

    // palette mapping (can randomize per-shape as well)
    const paletteVars: Record<ShapeKind, string> = {
      circle: palette?.circle ?? "--primary",
      triangle: palette?.triangle ?? "--accent",
      ring: palette?.ring ?? "--foreground",
      square: palette?.square ?? "--muted-foreground",
      diamond: palette?.diamond ?? "--muted-foreground",
    };

    const items: ShapeConfig[] = [];
    for (let i = 0; i < count; i++) {
      // random kind
      const kind = kinds[Math.floor(rnd() * kinds.length)];

      // random size, opacity, and colorVar (sometimes swap)
      const size = 28 + Math.floor(rnd() * 84); // 28..112
      const opacity = 0.10 + rnd() * 0.24; // 0.10..0.34
      const hueVar = paletteVars[kind];

      // random initial position
      let topPct = 2 + rnd() * 92;  // 2..94
      let leftPct = 2 + rnd() * 96; // 2..98

      if (avoidCenter) {
        const { xPct = 50, yPct = 40, radiusPct = 22 } = avoidCenter;
        const n = keepAwayFromCenter(topPct, leftPct, xPct, yPct, radiusPct);
        topPct = Math.min(98, Math.max(2, n.top));
        leftPct = Math.min(98, Math.max(2, n.left));
      }

      // random drift/timing
      const driftX = 8 + rnd() * 48; // 8..56
      const driftY = 8 + rnd() * 48; // 8..56
      const rotate = Math.floor(rnd() * 360);
      const duration = 5.5 + rnd() * 8; // 5.5..13.5
      const delay = rnd() * 3; // 0..3

      items.push({
        id: `shape-${i}`,
        kind,
        size,
        opacity,
        hueVar,
        topPct,
        leftPct,
        driftX,
        driftY,
        rotate,
        duration,
        delay,
        z: zIndex,
      });
    }
    return items;
  }, [mounted, seed, minCount, maxCount, palette, avoidCenter, zIndex]);

  if (!mounted || seed == null || !shapes) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        zIndex,
        ...(masked
          ? {
              maskImage:
                "radial-gradient(120% 120% at 50% 40%, black 60%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(120% 120% at 50% 40%, black 60%, transparent 100%)",
            }
          : {}),
        ...style,
      }}
    >
      {shapes.map((s) => {
        const base: React.CSSProperties = {
          position: "absolute",
          top: `${s.topPct}%`,
          left: `${s.leftPct}%`,
          width: s.kind === "triangle" ? 0 : s.size,
          height: s.kind === "triangle" ? 0 : s.size,
          opacity: s.opacity,
          zIndex: s.z ?? zIndex,
        };

        const anim = {
          x: [0, s.driftX, -s.driftX * 0.6, 0],
          y: [0, -s.driftY, s.driftY * 0.5, 0],
          rotate: [s.rotate, s.rotate + 8, s.rotate - 6, s.rotate],
          transition: {
            duration: s.duration,

            ease: "easeInOut" as const,
            delay: s.delay,
          },
        };

        switch (s.kind) {
          case "circle":
            return (
              <motion.div
                key={s.id}
                className="rounded-full"
                style={{
                  ...base,
                  background: `hsl(var(${s.hueVar}))`,
                  filter: "blur(0.2px)",
                }}
                animate={anim}
              />
            );
          case "square":
            return (
              <motion.div
                key={s.id}
                style={{
                  ...base,
                  background: `hsl(var(${s.hueVar}))`,
                  borderRadius: 10,
                }}
                animate={anim}
              />
            );
          case "diamond":
            return (
              <motion.div
                key={s.id}
                style={{
                  ...base,
                  width: s.size * 0.9,
                  height: s.size * 0.9,
                  background: `hsl(var(${s.hueVar}))`,
                  transform: `rotate(45deg)`,
                  borderRadius: 8,
                }}
                animate={anim}
              />
            );
          case "ring":
            return (
              <motion.div
                key={s.id}
                className="rounded-full"
                style={{
                  ...base,
                  background: "transparent",
                  border: `${Math.max(2, Math.floor(s.size / 12))}px solid hsl(var(--primary)/0.25)`,
                  boxShadow: "0 0 0 1px hsl(var(--background)/0.5) inset",
                }}
                animate={anim}
              />
            );
          case "triangle":
            return (
              <motion.div
                key={s.id}
                style={{
                  ...base,
                  borderLeft: `${s.size * 0.45}px solid transparent`,
                  borderRight: `${s.size * 0.45}px solid transparent`,
                  borderBottom: `${s.size * 0.75}px solid hsl(var(${s.hueVar}))`,
                  filter: "blur(0.2px)",
                  width: 0,
                  height: 0,
                }}
                animate={anim}
              />
            );
        }
      })}
    </div>
  );
}
