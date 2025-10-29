// src/sharedComponent/FeatureCards.tsx
"use client";

import React, {
  useRef,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
  memo,
} from "react";
import {
  motion,
  Variants,
  useReducedMotion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

/* ------------------------------ Lottie assets --------------------------- */
import successful from "@/assets/lottee/successful.json";
import accounting from "@/assets/lottee/accounting_black.json";
import bagWithX from "@/assets/lottee/bagWithX.json";
import Box from "@/assets/lottee/Box.json";
import bill from "@/assets/lottee/bill.json";
import media from "@/assets/lottee/media.json";
import MovingTruck from "@/assets/lottee/MovingTruck.json";
import cart from "@/assets/lottee/cart.json";
import report from "@/assets/lottee/report.json";
import centralizedemployeeinfo from "@/assets/lottee/centralized_employee_info_lottie.json";
import setting from "@/assets/lottee/setting.json";
import criditCard from "@/assets/lottee/criditCard.json";
import money from "@/assets/lottee/money.json";
import money2 from "@/assets/lottee/money2.json";


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

/* ---------------------------- Lottie registry --------------------------- */
const LOTTIES = {
  successful,
  accounting,
  bagWithX,
  Box,
  bill,
  three: bill, // alias
  media,
  MovingTruck,
  cart,
  report,
  centralizedemployeeinfo,
  setting,
  criditCard,
  money,
  money2
} as const;

type LottieRegistry = Record<string, object>;
const REGISTRY = LOTTIES as unknown as LottieRegistry;
const DEFAULT_PREVIEWS: Array<keyof typeof LOTTIES> = [
  "accounting",
  "bagWithX",
  "Box",
  "bill",
  "media",
  "MovingTruck",
  "cart",
  "report",
  "centralizedemployeeinfo",
  "setting",
  "criditCard",
  "money",
  "money2"
];

/* --------------------------------- Types -------------------------------- */
export type FeatureItem = {
  title: string;
  desc: string;
  /** Name of the lottie in the registry (any string; validated internally) */
  preview?: string;
  icon?: ReactNode;
  /** Optional direct Lottie JSON override (takes precedence over preview) */
  lottie?: object;
  "data-testid"?: string;
};

export type FeatureGridProps = {
  items: FeatureItem[];
  className?: string;
  ease?: [number, number, number, number];
  containerVariants?: Variants;
  childVariants?: Variants;
  inViewOnce?: boolean;
  inViewAmount?: number;
  onActiveChange?: (active: boolean) => void;
  reducedMotionAware?: boolean;
  enableTilt?: boolean;
  tiltMaxDeg?: number;
  previewClassName?: string;
  previewScale?: number;
};

/* ------------------------------ Helpers --------------------------------- */
function resolveAnimationData(item: FeatureItem, index: number): object {
  if (item.lottie) return item.lottie;

  const key = typeof item.preview === "string" ? item.preview : "";
  if (key && REGISTRY[key]) return REGISTRY[key];

  const fallback = DEFAULT_PREVIEWS[index % DEFAULT_PREVIEWS.length];
  return (LOTTIES)[fallback] as object;
}

/* ------------------------------ Feature Grid ---------------------------- */
export function FeatureGrid({
  items,
  className = "",
  ease = DEFAULT_EASE,
  containerVariants = defaultContainer,
  childVariants = defaultFadeUp,
  inViewOnce = true,
  inViewAmount = 0.2,
  onActiveChange,
  reducedMotionAware = true,
  enableTilt = false,
  tiltMaxDeg = 6,
  previewClassName = "h-44 md:h-52",
  previewScale = 1,
}: FeatureGridProps) {
  const [hoverCount, setHoverCount] = useState(0);
  const featuresActive = hoverCount > 0;

  useEffect(() => {
    onActiveChange?.(featuresActive);
  }, [featuresActive, onActiveChange]);

  return (
    <div className={`relative ${className}`}>
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
            title={item.title}
            desc={item.desc}
            icon={item.icon}
            animationData={resolveAnimationData(item, i)}
            dataTestId={item["data-testid"]}
            ease={ease}
            variants={childVariants}
            onHoverStart={() => setHoverCount((c) => c + 1)}
            onHoverEnd={() => setHoverCount((c) => Math.max(0, c - 1))}
            reducedMotionAware={reducedMotionAware}
            enableTilt={enableTilt}
            tiltMaxDeg={tiltMaxDeg}
            previewClassName={previewClassName}
            previewScale={previewScale}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------------------- Feature Card UI --------------------------- */
type InternalCardProps = {
  title: string;
  desc: string;
  icon?: ReactNode;
  ease?: [number, number, number, number];
  variants?: Variants;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  reducedMotionAware?: boolean;
  enableTilt?: boolean;
  tiltMaxDeg?: number;
  animationData: object;
  dataTestId?: string;
  previewClassName?: string;
  previewScale?: number;
};

export const FeatureCard = memo(function FeatureCard({
  title,
  desc,
  icon,
  ease = DEFAULT_EASE,
  variants = defaultFadeUp,
  onHoverStart,
  onHoverEnd,
  reducedMotionAware = true,
  enableTilt = false,
  tiltMaxDeg = 6,
  animationData,
  dataTestId,
  previewClassName = "h-44 md:h-52",
  previewScale = 1,
}: InternalCardProps) {
  const [active, setActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const rm = reducedMotionAware && prefersReducedMotion;

  const ref = useRef<HTMLDivElement | null>(null);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const springCfg = { stiffness: 200, damping: 20, mass: 0.2 };

  const rotateX = useSpring(useTransform(ny, [-0.5, 0.5], [tiltMaxDeg, -tiltMaxDeg]), springCfg);
  const rotateY = useSpring(useTransform(nx, [-0.5, 0.5], [-tiltMaxDeg, tiltMaxDeg]), springCfg);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enableTilt || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      nx.set(px - 0.5);
      ny.set(py - 0.5);
    },
    [enableTilt, nx, ny]
  );

  const resetTilt = useCallback(() => {
    nx.set(0);
    ny.set(0);
  }, [nx, ny]);

  return (
    <motion.div
      ref={ref}
      data-testid={dataTestId}
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
      transition={{ type: "spring", stiffness: 260, damping: 20, ease }}
      style={
        enableTilt
          ? {
              transformStyle: "preserve-3d",
              transformPerspective: 1000,
              rotateX,
              rotateY,
            }
          : undefined
      }
      role="article"
      aria-label={title}
    >
      <div
        className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-white ring-1 ring-slate-100 flex items-center justify-center ${previewClassName}`}
      >
        <UnifiedLottiePreview active={active && !rm} animationData={animationData} sizePct={previewScale} />
      </div>

      <div className="mt-4 flex items-start gap-4">
        {icon && (
          <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center">
            {icon}
          </span>
        )}
        <div>
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <p className="mt-1 text-sm text-slate-600">{desc}</p>
        </div>
      </div>

      <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-slate-900 transition-all duration-300 group-hover:w-full" />
    </motion.div>
  );
});

/* ---------------------------- Unified Lottie ----------------------------- */
function UnifiedLottiePreview({
  active,
  animationData,
  sizePct = 1,
}: {
  active: boolean;
  animationData: object;
  sizePct?: number;
}) {
  const lref = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    const api = lref.current;
    if (!api) return;
    if (active) api.play();
    else api.pause();
  }, [active]);

  return (
    <div className="pointer-events-none flex items-center justify-center w-full h-full" aria-hidden>
      <Lottie
        lottieRef={lref}
        animationData={animationData}
        autoplay={false}
        loop
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
        style={{
          width: `${sizePct * 100}%`,
          height: `${sizePct * 100}%`,
          display: "block",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </div>
  );
}
