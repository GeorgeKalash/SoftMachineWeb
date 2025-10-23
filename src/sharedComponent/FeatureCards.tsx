// src/sharedComponent/FeatureCards.tsx
"use client";

import React, { useRef, useState, type ReactNode, useCallback } from "react";
import {
  motion,
  Variants,
  useReducedMotion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

/* ------------------------------- Defaults ------------------------------- */

const DEFAULT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const defaultContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const defaultFadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: DEFAULT_EASE } },
};

/* --------------------------------- Types -------------------------------- */

export type PreviewKind =
  | "cards"
  | "timeline"
  | "bubbles"
  | "link"
  | "gear"
  | "scroll"
  // new ones
  | "radar"
  | "spark"
  | "tiles"
  | "inbox"
  | "gauge"
  | "donut"
  | "orbit"
  | "wave"
  | "typing";

export type FeatureItem = {
  title: string;
  desc: string;
  preview?: PreviewKind;
  icon?: ReactNode;
  "data-testid"?: string;
};

export type FeatureGridProps = {
  items: FeatureItem[];
  className?: string;

  /** Animated ambient sweep behind the grid when any card is hovered */
  ambient?: boolean;

  /** Override animation curves / variants */
  ease?: [number, number, number, number];
  containerVariants?: Variants;
  childVariants?: Variants;

  /** Viewport triggers */
  inViewOnce?: boolean;
  inViewAmount?: number;

  /** Notify parent if any card is hovered */
  onActiveChange?: (active: boolean) => void;

  /** Respect prefers-reduced-motion and stop infinite loops */
  reducedMotionAware?: boolean;

  /** Enable 3D tilt/parallax on cards */
  enableTilt?: boolean;
  tiltMaxDeg?: number; // default 6
};

/* ------------------------------ Feature Grid ---------------------------- */

export function FeatureGrid({
  items,
  className = "",
  ambient = true,
  ease = DEFAULT_EASE,
  containerVariants = defaultContainer,
  childVariants = defaultFadeUp,
  inViewOnce = true,
  inViewAmount = 0.2,
  onActiveChange,
  reducedMotionAware = true,
  enableTilt = false,
  tiltMaxDeg = 6,
}: FeatureGridProps) {
  const [hoverCount, setHoverCount] = useState(0);
  const featuresActive = hoverCount > 0;

  // notify parent (optional)
  if (onActiveChange) onActiveChange(featuresActive);

  return (
    <div className={`relative ${className}`}>
      {/* Ambient sweep */}
      {ambient && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          animate={{
            opacity: featuresActive ? 1 : 0,
            x: featuresActive ? ["-10%", "10%", "-10%"] : 0,
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: featuresActive ? Infinity : 0,
          }}
          style={{
            background:
              "radial-gradient(40% 60% at 50% 20%, rgba(99,102,241,0.12), transparent 60%), radial-gradient(40% 60% at 20% 80%, rgba(14,165,233,0.12), transparent 60%), radial-gradient(40% 60% at 80% 70%, rgba(236,72,153,0.12), transparent 60%)",
          }}
        />
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: inViewOnce, amount: inViewAmount }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {items.map((item, i) => (
          <FeatureCard
            key={`${item.title}-${i}`}
            {...item}
            ease={ease}
            variants={childVariants}
            onHoverStart={() => setHoverCount((c) => c + 1)}
            onHoverEnd={() => setHoverCount((c) => Math.max(0, c - 1))}
            reducedMotionAware={reducedMotionAware}
            enableTilt={enableTilt}
            tiltMaxDeg={tiltMaxDeg}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------------------- Feature Card UI --------------------------- */

type InternalCardProps = FeatureItem & {
  ease?: [number, number, number, number];
  variants?: Variants;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  reducedMotionAware?: boolean;
  enableTilt?: boolean;
  tiltMaxDeg?: number;
};

export function FeatureCard({
  title,
  desc,
  preview = "cards",
  icon,
  ease = DEFAULT_EASE,
  variants = defaultFadeUp,
  onHoverStart,
  onHoverEnd,
  reducedMotionAware = true,
  enableTilt = false,
  tiltMaxDeg = 6,
  ...rest
}: InternalCardProps) {
  const [active, setActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const rm = reducedMotionAware && prefersReducedMotion;
  const repeatVal = active && !rm ? Infinity : 0;

  // --- 3D tilt (optional) ---
  const ref = useRef<HTMLDivElement | null>(null);
  const nx = useMotionValue(0); // normalized [-0.5 .. 0.5]
  const ny = useMotionValue(0);
  const springCfg = { stiffness: 200, damping: 20, mass: 0.2 };

  const rotateX = useSpring(
    useTransform(ny, [-0.5, 0.5], [tiltMaxDeg, -tiltMaxDeg]),
    springCfg
  );
  const rotateY = useSpring(
    useTransform(nx, [-0.5, 0.5], [-tiltMaxDeg, tiltMaxDeg]),
    springCfg
  );
  const transZ = useSpring(
    useTransform(ny, [-0.5, 0.5], [0, 0]), // reserved if you want pop-out
    springCfg
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;  // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    nx.set(px - 0.5);
    ny.set(py - 0.5);
  }, [enableTilt, nx, ny]);

  const resetTilt = useCallback(() => {
    nx.set(0);
    ny.set(0);
  }, [nx, ny]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      variants={variants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      onHoverStart={() => {
        setActive(true);
        onHoverStart?.();
      }}
      onHoverEnd={() => {
        setActive(false);
        onHoverEnd?.();
      }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition will-change-transform hover:shadow-lg"
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={
        enableTilt
          ? {
              transformStyle: "preserve-3d",
              perspective: 1000,
              rotateX,
              rotateY,
              translateZ: transZ,
            }
          : undefined
      }
      {...rest}
    >
      {/* Preview area */}
      <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-100">
        {/* Soft vignette */}
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 40%, rgba(15, 23, 42, 0.06), transparent 70%)",
          }}
        />
        {preview === "cards"   && <CardsPreview   active={active} ease={ease} repeat={repeatVal} />}
        {preview === "timeline"&& <TimelinePreview active={active} ease={ease} repeat={repeatVal} />}
        {preview === "bubbles" && <BubblesPreview active={active} ease={ease} repeat={repeatVal} />}
        {preview === "link"    && <LinkPreview    active={active} ease={ease} repeat={repeatVal} />}
        {preview === "gear"    && <GearPreview    active={active} ease={ease} repeat={repeatVal} />}
        {preview === "scroll"  && <ScrollPreview  active={active} ease={ease} repeat={repeatVal} />}

        {/* New ones */}
        {preview === "radar"   && <RadarPreview   active={active} ease={ease} repeat={repeatVal} />}
        {preview === "spark"   && <SparkPreview   active={active} ease={ease} repeat={repeatVal} />}
        {preview === "tiles"   && <TilesPreview   active={active} ease={ease} repeat={repeatVal} />}
        {preview === "inbox"   && <InboxPreview   active={active} ease={ease} repeat={repeatVal} />}
        {preview === "gauge"   && <GaugePreview   active={active} ease={ease} repeat={repeatVal} />}
        {preview === "donut"   && <DonutPreview   active={active} ease={ease} repeat={repeatVal} />}
        {preview === "orbit"   && <OrbitPreview   active={active} ease={ease} repeat={repeatVal} />}
        {preview === "wave"    && <WavePreview    active={active} ease={ease} repeat={repeatVal} />}
        {preview === "typing"  && <TypingPreview  active={active} ease={ease} repeat={repeatVal} />}
      </div>

      {/* Text content */}
      <div className="mt-4 flex items-start gap-4">
        {icon && <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center">{icon}</span>}
        <div>
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <p className="mt-1 text-sm text-slate-600">{desc}</p>
        </div>
      </div>

      {/* Accent underline on hover */}
      <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-slate-900 transition-all duration-300 group-hover:w-full" />
    </motion.div>
  );
}

/* ----------------------- Animated Preview Implementations ---------------------- */
/* All previews accept { active, ease, repeat } so we can centrally control reduced-motion. */

type PreviewProps = {
  active: boolean;
  ease: [number, number, number, number];
  repeat: number | 0;
};

function CardsPreview({ active, ease, repeat }: PreviewProps) {
  const base = "absolute rounded-lg border border-slate-200 bg-white shadow-sm will-change-transform";
  return (
    <>
      <motion.div
        className={`${base} left-4 top-6 h-20 w-40`}
        animate={active ? { y: [-2, -6, -2], rotate: [0, -2, 0] } : { y: 0, rotate: 0 }}
        transition={{ duration: 2.2, ease, repeat }}
      >
        <SkeletonLines />
      </motion.div>
      <motion.div
        className={`${base} left-16 top-10 h-20 w-40`}
        animate={active ? { y: [2, -2, 2], rotate: [0, 2, 0] } : { y: 0, rotate: 0 }}
        transition={{ duration: 2, ease, repeat, delay: 0.2 }}
      >
        <SkeletonLines />
      </motion.div>
      <motion.div
        className={`${base} left-28 top-4 h-20 w-40`}
        animate={active ? { y: [-1, -4, -1] } : { y: 0 }}
        transition={{ duration: 1.8, ease, repeat, delay: 0.4 }}
      >
        <SkeletonLines />
      </motion.div>
    </>
  );
}

function TimelinePreview({ active, ease, repeat }: PreviewProps) {
  const bar = "h-3 rounded-md bg-slate-200 overflow-hidden";
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3 px-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={bar}>
          <motion.div
            className="h-full rounded-md bg-slate-900"
            initial={{ width: "20%" }}
            animate={active ? { width: ["25%", "70%", "35%", "60%", "25%"] } : { width: "30%" }}
            transition={{ duration: 2.6, ease, repeat, repeatType: "reverse", delay: i * 0.06 }}
          />
        </div>
      ))}
    </div>
  );
}

function BubblesPreview({ active, ease, repeat }: PreviewProps) {
  const chip =
    "absolute rounded-full px-3 py-1 text-[10px] font-medium bg-white/90 border border-slate-200 shadow whitespace-nowrap";
  return (
    <div className="absolute inset-0">
      <motion.div
        className={`${chip} left-5 bottom-4`}
        animate={active ? { y: [-2, -22], opacity: [1, 0.9, 1] } : { y: 0 }}
        transition={{ duration: 1.6, ease, repeat }}
      >
        Maintenance due
      </motion.div>
      <motion.div
        className={`${chip} left-24 bottom-6`}
        animate={active ? { y: [-2, -28], opacity: [1, 0.9, 1] } : { y: 0 }}
        transition={{ duration: 1.8, ease, repeat, delay: 0.2 }}
      >
        Asset transferred
      </motion.div>
      <motion.div
        className={`${chip} left-14 bottom-2`}
        animate={active ? { y: [-2, -18], opacity: [1, 0.9, 1] } : { y: 0 }}
        transition={{ duration: 1.4, ease, repeat, delay: 0.4 }}
      >
        Disposal queued
      </motion.div>
    </div>
  );
}

function LinkPreview({ active, ease, repeat }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-24 w-48">
        <motion.span
          className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-slate-200"
          animate={active ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.6 }}
          transition={{ duration: 1.6, ease, repeat }}
        />
        {["left-0", "left-1/2 -translate-x-1/2", "right-0"].map((pos, i) => (
          <motion.div
            key={i}
            className={`absolute ${pos} top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-slate-200 bg-white shadow`}
            animate={
              active
                ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(2,6,23,0.0)",
                      "0 0 0 8px rgba(15,23,42,0.05)",
                      "0 0 0 0 rgba(2,6,23,0.0)",
                    ],
                  }
                : { scale: 1, boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
            }
            transition={{ duration: 2, repeat, ease, delay: i * 0.15 }}
          />
        ))}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-slate-900"
          style={{ left: 0 }}
          animate={active ? { left: ["0%", "50%", "100%"] } : { left: "0%" }}
          transition={{ duration: 2.2, ease, repeat }}
        />
      </div>
    </div>
  );
}

function GearPreview({ active, ease, repeat }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="h-24 w-24 rounded-full border-2 border-slate-200"
        animate={active ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 6, ease: "linear", repeat }}
      />
      <motion.div
        className="absolute h-14 w-14 rounded-full border-2 border-slate-300"
        animate={active ? { rotate: -360 } : { rotate: 0 }}
        transition={{ duration: 5, ease: "linear", repeat }}
      />
      <motion.div
        className="absolute h-3 w-3 rounded-full bg-slate-900"
        animate={active ? { y: [-18, 18, -18] } : { y: 0 }}
        transition={{ duration: 2.2, ease, repeat }}
      />
    </div>
  );
}

function ScrollPreview({ active, ease, repeat }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-24 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <motion.div
          className="absolute inset-x-0 top-0 space-y-2 p-3"
          animate={active ? { y: ["0%", "-40%"] } : { y: "0%" }}
          transition={{ duration: 2.6, ease, repeat, repeatType: "mirror" }}
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-2 rounded bg-slate-200" />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------ NEW PREVIEWS ----------------------------- */

function RadarPreview({ active, ease, repeat }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-28 w-28 rounded-full border border-slate-200">
        <div className="absolute inset-3 rounded-full border border-slate-200/70" />
        <div className="absolute inset-6 rounded-full border border-slate-200/50" />
        <motion.span
          className="absolute left-1/2 top-1/2 h-[1px] w-[52%] origin-left bg-slate-300"
          animate={active ? { rotate: [0, 360] } : { rotate: 0 }}
          transition={{ duration: 3.5, ease: "linear", repeat }}
        />
        {[
          { x: -6, y: -10, d: 1.6 },
          { x: 8, y: -2, d: 1.9 },
          { x: -2, y: 10, d: 1.7 },
          { x: 12, y: 8, d: 2.2 },
        ].map((b, i) => (
          <motion.span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-slate-900"
            style={{ left: `calc(50% + ${b.x * 2}px)`, top: `calc(50% + ${b.y * 2}px)` }}
            animate={active ? { scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 0.8 }}
            transition={{ duration: b.d, ease, repeat }}
          />
        ))}
      </div>
    </div>
  );
}

function SparkPreview({ active, ease, repeat }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <svg viewBox="0 0 180 72" className="h-20 w-[180px]" fill="none">
        <motion.path
          d="M0 50 L20 44 L40 47 L60 32 L80 46 L100 36 L120 42 L140 28 L160 34 L180 30"
          stroke="currentColor"
          className="text-slate-900"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          initial={{ pathLength: 0.25 }}
          animate={active ? { pathLength: [0.25, 0.95, 0.6] } : { pathLength: 0.5 }}
          transition={{ duration: 2.4, ease, repeat }}
        />
      </svg>
    </div>
  );
}

function TilesPreview({ active, ease, repeat }: PreviewProps) {
  const rows = 3, cols = 5;
  const items = Array.from({ length: rows * cols });
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="grid grid-cols-5 gap-2">
        {items.map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const delay = (r + c) * 0.06;
          return (
            <motion.div
              key={i}
              className="h-4 w-6 rounded bg-slate-200"
              animate={active ? { opacity: [0.6, 1, 0.7], scale: [1, 1.06, 1] } : { opacity: 0.8, scale: 1 }}
              transition={{ duration: 1.6, ease, repeat, delay }}
            />
          );
        })}
      </div>
    </div>
  );
}

function InboxPreview({ active, ease, repeat }: PreviewProps) {
  const Row = ({ d = 0 }: { d?: number }) => (
    <div className="flex items-center gap-3">
      <motion.span
        className="h-3.5 w-3.5 rounded-full border border-slate-300"
        animate={active ? { boxShadow: ["0 0 0 0 rgba(15,23,42,0)", "0 0 0 8px rgba(15,23,42,0.06)", "0 0 0 0 rgba(15,23,42,0)"] } : {}}
        transition={{ duration: 1.8, ease, repeat, delay: d }}
      />
      <motion.div
        className="h-2.5 flex-1 rounded bg-slate-200"
        animate={active ? { x: [-8, 0], opacity: [0.6, 1] } : { x: 0, opacity: 0.85 }}
        transition={{ duration: 0.6, ease, delay: d }}
      />
    </div>
  );
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-44 space-y-3">
        <Row d={0.0} />
        <Row d={0.12} />
        <Row d={0.24} />
        <Row d={0.36} />
      </div>
    </div>
  );
}

function GaugePreview({ active, ease, repeat }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 100 55" className="w-44 h-24">
        <path d="M10 50 A40 40 0 0 1 90 50" stroke="#e5e7eb" strokeWidth="6" fill="none" />
        <motion.path
          d="M10 50 A40 40 0 0 1 90 50"
          stroke="#0f172a"
          strokeWidth="6"
          fill="none"
          pathLength={1}
          initial={{ pathLength: 0.35 }}
          animate={active ? { pathLength: [0.35, 0.85, 0.5] } : { pathLength: 0.5 }}
          transition={{ duration: 2.2, ease, repeat }}
        />
        <motion.line
          x1="50" y1="50" x2="50" y2="12"
          stroke="#0f172a" strokeWidth="2" strokeLinecap="round"
          transform-origin="50px 50px"
          animate={active ? { rotate: [-80, 0, -40] } : { rotate: -40 }}
          transition={{ duration: 2.2, ease, repeat }}
        />
      </svg>
    </div>
  );
}

function DonutPreview({ active, ease, repeat }: PreviewProps) {
  const segments = [
    { color: "#0f172a", value: 0.42 },
    { color: "#94a3b8", value: 0.25 },
    { color: "#cbd5e1", value: 0.15 },
  ];
  const R = 28, C = 2 * Math.PI * R, GAP = 6;
  let offset = 0;
  const parts = segments.map((s) => {
    const len = s.value * (C - GAP * segments.length);
    const arr = `${len} ${GAP}`;
    const start = offset;
    offset += len + GAP;
    return { ...s, dasharray: arr, dashoffset: start };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-24 w-24">
        <circle cx="60" cy="60" r={R} stroke="#e5e7eb" strokeWidth="10" fill="none" />
        {parts.map((p, i) => (
          <motion.circle
            key={i}
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={p.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={p.dasharray}
            strokeDashoffset={p.dashoffset}
            initial={{ pathLength: 0.2 }}
            animate={active ? { pathLength: [0.2, 1, 0.6] } : { pathLength: 0.6 }}
            transition={{ duration: 2.2 + i * 0.15, ease, repeat }}
          />
        ))}
        <motion.circle
          cx="60"
          cy="60"
          r="6"
          fill="#0f172a"
          animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1.6, ease, repeat }}
        />
      </svg>
    </div>
  );
}

function OrbitPreview({ active, ease, repeat }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-28 w-28">
        <div className="absolute inset-2 rounded-full border border-slate-200" />
        <div className="absolute inset-5 rounded-full border border-slate-200/70" />
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900" />
        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900"
            style={{ transformOrigin: "0 0" }}
            animate={active ? { rotate: [deg, deg + 360] } : { rotate: deg }}
            transition={{ duration: 6 + i, ease: "linear", repeat }}
          >
            <span className="block translate-x-12" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WavePreview({ active, ease, repeat }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <svg viewBox="0 0 200 80" className="h-20 w-[200px]" fill="none">
        <motion.path
          d="M0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50"
          stroke="currentColor"
          className="text-slate-900"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 10"
          initial={{ strokeDashoffset: 0 }}
          animate={active ? { strokeDashoffset: [0, -32] } : { strokeDashoffset: 0 }}
          transition={{ duration: 1.8, ease, repeat }}
        />
      </svg>
    </div>
  );
}

function TypingPreview({ active, ease, repeat }: PreviewProps) {
  const Line = ({ text, delay = 0 }: { text: string; delay?: number }) => (
    <div className="font-mono text-[11px] leading-5 text-slate-800">
      <motion.span
        className="inline-block overflow-hidden align-bottom"
        style={{ whiteSpace: "nowrap", width: "0ch" }}
        animate={active ? { width: [`0ch`, `${text.length}ch`] } : { width: "0ch" }}
        transition={{ duration: 0.8 + text.length * 0.02, ease, delay }}
      >
        {text}
      </motion.span>
      <motion.span
        className="ml-1 inline-block h-3 w-[2px] align-bottom bg-slate-900"
        animate={active ? { opacity: [1, 0, 1] } : { opacity: 0 }}
        transition={{ duration: 0.8, repeat }}
      />
    </div>
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-56 rounded-md border border-slate-200 bg-white/80 p-3 shadow-sm">
        <Line text={`POST /api/assets`} delay={0.0} />
        <Line text={`200 OK — 23ms`} delay={0.2} />
        <Line text={`depreciation=applied`} delay={0.4} />
      </div>
    </div>
  );
}

/* ------------------------------- Utilities ------------------------------ */

function SkeletonLines() {
  return (
    <div className="p-3 space-y-2">
      <div className="h-2 w-5/6 rounded bg-slate-200" />
      <div className="h-2 w-2/3 rounded bg-slate-200" />
      <div className="h-2 w-4/5 rounded bg-slate-200" />
    </div>
  );
}
