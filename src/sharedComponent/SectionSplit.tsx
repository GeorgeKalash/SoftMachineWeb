"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Ease = [number, number, number, number];

export type CTA = { label: string; href: string; variant?: "primary" | "secondary" | "ghost" };
export type BulletStyle = "check" | "dot" | "none";

export type MediaItem = {
  src: string;
  alt?: string;
  caption?: React.ReactNode; // per-image description
};

export type SectionSplitProps = {
  id?: string;
  /** For your nav ink hook */
  navInk?: "light" | "dark";

  /** Content */
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  bullets?: string[];
  bulletStyle?: BulletStyle;
  ctas?: CTA[];

  /** Media (choose ONE path): */
  media?: React.ReactNode | string;     // single image src or custom ReactNode
  mediaCaption?: React.ReactNode;       // caption when using single media
  mediaItems?: MediaItem[];             // if provided & length >= 2 => carousel
  mediaAlt?: string;                    // fallback alt for single string media
  mediaAspect?: string;                 // e.g. "aspect-[16/10]"

  /** Carousel behavior (when mediaItems is used) */
  autoPlay?: boolean;
  intervalMs?: number;

  /** Layout & style */
  tone?: "dark" | "light";
  mirror?: boolean;
  className?: string;
  containerClassName?: string;
  showOverlays?: boolean;

  /** Motion overrides */
  ease?: Ease;
  containerVariants?: Variants;
  childVariants?: Variants;
};

const DEFAULT_EASE: Ease = [0.22, 1, 0.36, 1];

const defaultContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const defaultFadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: DEFAULT_EASE } },
};

export default function SectionSplit({
  id,
  navInk = "light",
  eyebrow,
  title,
  description,
  bullets,
  bulletStyle = "check",
  ctas,
  media,
  mediaCaption,
  mediaItems,
  mediaAlt = "Illustration",
  mediaAspect = "aspect-[16/10]",
  autoPlay = true,
  intervalMs = 3800,
  tone = "dark",
  mirror = false,
  className = "",
  containerClassName = "",
  showOverlays = true,
  ease = DEFAULT_EASE,
  containerVariants = defaultContainer,
  childVariants = defaultFadeUp,
}: SectionSplitProps) {
  const isDark = tone === "dark";
  const prefersReducedMotion = useReducedMotion();

  const items = useMemo(() => (mediaItems && mediaItems.length > 0 ? mediaItems : undefined), [mediaItems]);
  const isCarousel = !!items && items.length >= 2;

  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % (items?.length ?? 1));
  const prev = () => setIndex((i) => (i - 1 + (items?.length ?? 1)) % (items?.length ?? 1));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!isCarousel) return;
    if (prefersReducedMotion) return;
    if (!autoPlay) return;
    if (paused) return;
    const id = setInterval(next, Math.max(1800, intervalMs));
    return () => clearInterval(id);
  }, [isCarousel, prefersReducedMotion, autoPlay, paused, intervalMs]);

  const wrap = (...cls: (string | false | null | undefined)[]) => cls.filter(Boolean).join(" ");

  const ctaClass = (variant: CTA["variant"] = "primary") => {
    if (isDark) {
      if (variant === "secondary") return "ring-1 ring-white/20 text-white hover:bg-white/10";
      if (variant === "ghost") return "text-white/80 hover:text-white";
      return "bg-white text-black hover:bg-slate-100";
    }
    if (variant === "secondary") return "ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50";
    if (variant === "ghost") return "text-slate-700 hover:text-slate-900";
    return "bg-slate-900 text-white hover:bg-slate-800";
  };

  const BulletIcon = () =>
    bulletStyle === "check" ? (
      <CheckCircle2 className={wrap("mt-0.5 h-5 w-5 flex-none", isDark ? "text-emerald-400" : "text-emerald-600")} />
    ) : bulletStyle === "dot" ? (
      <span className={wrap("mt-2 h-2 w-2 rounded-full", isDark ? "bg-white/80" : "bg-slate-500")} />
    ) : null;

  return (
    <section
      id={id}
      data-nav-ink={navInk}
      className={wrap(
        "relative py-16 md:py-20",
        isDark ? "bg-gradient-to-br from-black via-slate-900 to-slate-800" : "bg-gradient-to-b from-white to-slate-50",
        className
      )}
    >
      {/* Overlays (optional for dark tone) */}
      {isDark && showOverlays && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.20),transparent_60%)] mix-blend-screen"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(80%_60%_at_50%_0%,#000_35%,transparent_100%)] opacity-90"
          />
        </>
      )}

      <div className={wrap("container relative mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={wrap("grid items-center gap-10 lg:gap-16", mirror ? "lg:grid-cols-[1.1fr_1fr]" : "lg:grid-cols-2")}
        >
          {/* Text */}
          <motion.div variants={childVariants} className={mirror ? "order-2 lg:order-1" : ""}>
            {eyebrow ? (
              <p className={wrap("text-sm font-medium tracking-wide uppercase", isDark ? "text-white/70" : "text-slate-500")}>
                {eyebrow}
              </p>
            ) : null}

            <h2 className={wrap("text-2xl md:text-3xl font-semibold", isDark ? "text-white" : "text-slate-900")}>{title}</h2>

            {description ? (
              <div className={wrap("mt-4 leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>{description}</div>
            ) : null}

            {bullets?.length ? (
              <ul className="mt-6 space-y-3">
                {bullets.map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {bulletStyle !== "none" ? <BulletIcon /> : null}
                    <span className={isDark ? "text-slate-200" : "text-slate-700"}>{line}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {ctas?.length ? (
              <div className="mt-7 flex flex-wrap gap-3">
                {ctas.map((c, i) => (
                  <a
                    key={`${c.label}-${i}`}
                    href={c.href}
                    className={wrap("inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition", ctaClass(c.variant))}
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            ) : null}
          </motion.div>

          {/* Media area (single / carousel) */}
          {(media || items) && (
            <motion.div variants={childVariants} className={mirror ? "order-1 lg:order-2" : ""}>
              <div
                className={wrap(
                  "relative overflow-hidden rounded-2xl",
                  isDark ? "ring-1 ring-white/10 shadow-2xl" : "border border-slate-200 shadow-xl",
                  mediaAspect
                )}
                {...(isCarousel
                  ? {
                      role: "region",
                      "aria-roledescription": "carousel",
                      "aria-label": title ? `${title} media carousel` : "media carousel",
                      onMouseEnter: () => setPaused(true),
                      onMouseLeave: () => setPaused(false),
                    }
                  : {})}
              >
                {/* CAROUSEL MODE */}
                {isCarousel ? (
                  <>
                    {items!.map((it, i) => (
                      <motion.img
                        key={it.src + i}
                        src={it.src}
                        alt={index === i ? it.alt ?? "" : ""}
                        aria-hidden={index !== i}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: index === i ? 1 : 0, scale: index === i ? 1 : 1.02 }}
                        transition={{ duration: 0.8, ease }}
                        loading={i === 0 ? "eager" : "lazy"}
                        style={{ willChange: "opacity, transform" }}
                      />
                    ))}

                    {/* Controls */}
                    <button
                      type="button"
                      aria-label="Previous slide"
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white/60"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Next slide"
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-white/60"
                    >
                      ›
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {items!.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setIndex(i)}
                          aria-label={`Slide ${i + 1}`}
                          aria-current={index === i}
                          className={wrap(
                            "h-2 w-2 rounded-full transition",
                            index === i ? "bg-white" : "bg-white/60 hover:bg-white/80"
                          )}
                        />
                      ))}
                    </div>
                  </>
                ) : // SINGLE MEDIA
                typeof media === "string" ? (
                  <motion.img
                    src={media}
                    alt={mediaAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ scale: 1.02 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.2, ease }}
                    loading="eager"
                  />
                ) : (
                  <div className="absolute inset-0">{media}</div>
                )}
              </div>

              {/* CAPTIONS (below media) */}
              {isCarousel ? (
                items![index]?.caption ? (
                  <div className={wrap("mt-3 text-sm", isDark ? "text-slate-200" : "text-slate-600")}>
                    {items![index].caption}
                  </div>
                ) : null
              ) : mediaCaption ? (
                <div className={wrap("mt-3 text-sm", isDark ? "text-slate-200" : "text-slate-600")}>{mediaCaption}</div>
              ) : null}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
