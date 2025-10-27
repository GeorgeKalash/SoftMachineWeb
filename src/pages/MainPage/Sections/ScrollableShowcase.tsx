// src/sharedComponent/ScrollableShowcase.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, PlayCircle } from "lucide-react";
import siteData from "@/data.json";

/* ---------------- assets in code ---------------- */
import cat from "@/assets/cat.gif";
import giphy from "@/assets/giphy-1.gif";
import workcomputer from "@/assets/workcomputer.gif";
import path from "@/assets/path.gif";

/* ---------------- helpers for image src ---------------- */
type ImageLike = string | { src: string };
const toSrc = (img: ImageLike) => (typeof img === "string" ? img : img.src);

/* ---------------- types ---------------- */
type ShowcaseAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  icon?: React.ReactNode;
};

type ShowcaseItem = {
  key: string;
  title: string;
  body: string;
  image: ImageLike;
  imageAlt?: string;
  primary?: ShowcaseAction;
  secondary?: ShowcaseAction;
  tag?: string;
  anchorId: string;
};

type ScrollableShowcaseProps = {
  id?: string;
  className?: string;
  topOffsetPx?: number; // sticky offset override (navbar height)
};

/* ---------------- JSON → runtime maps ---------------- */
const IMAGE_MAP: Record<string, string> = {
  cat,
  giphy,
  workcomputer,
  path,
};

const ICON_MAP: Record<string, JSX.Element> = {
  sparkles: <Sparkles className="h-4 w-4" />,
  play: <PlayCircle className="h-4 w-4" />,
};

/* ---------------- hooks ---------------- */

function useActiveStepObserver(stepCount: number, rootMargin = "-25% 0px -55% 0px") {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const lastStable = useRef(0);

  useEffect(() => {
    const nodes = sectionsRef.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const visible = new Map<number, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = nodes.indexOf(e.target as HTMLElement);
          if (idx === -1) continue;
          if (e.isIntersecting) visible.set(idx, e.intersectionRatio ?? 0);
          else visible.delete(idx);
        }
        if (visible.size) {
          let bestIdx = lastStable.current;
          let bestRatio = -1;
          for (const [idx, ratio] of visible.entries()) {
            if (ratio > bestRatio) {
              bestIdx = idx;
              bestRatio = ratio;
            }
          }
          if (bestIdx !== lastStable.current && bestRatio > 0.12) {
            lastStable.current = bestIdx;
            setActive(bestIdx);
          }
        }
      },
      { root: null, rootMargin, threshold: [0, 0.12, 0.25, 0.5, 0.75, 1] }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [stepCount, rootMargin]);

  return { sectionsRef, active, setActive };
}

function usePreloadImages(urls: string[]) {
  useEffect(() => {
    const imgs = urls.map((u) => {
      const i = new Image();
      i.decoding = "async";
      i.loading = "eager";
      i.src = u;
      return i;
    });
    return () => void imgs;
  }, [urls]);
}

function useViewportStepHeight(offset: number) {
  const [h, setH] = useState(0);
  useEffect(() => {
    const calc = () => setH(Math.max(360, window.innerHeight - offset));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [offset]);
  return h;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia(query);
    const handler = () => setMatches(m.matches);
    handler();
    m.addEventListener?.("change", handler);
    return () => m.removeEventListener?.("change", handler);
  }, [query]);
  return matches;
}

/* ---------------- helpers ---------------- */
const smoothScrollToCenter = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const target = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
  window.scrollTo({ top: target, behavior: "smooth" });
};

const fireContactEvent = (phase: string, intent: string) => {
  window.dispatchEvent(new CustomEvent("open-contact", { detail: { phase, intent } }));
};

/* ---------------- media panel with cross-fade ---------------- */
function MediaPanel({ src, alt, progress }: { src: string; alt: string; progress: number }) {
  const [baseSrc, setBaseSrc] = useState(src);
  const [overlaySrc, setOverlaySrc] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);
  const fadeTokenRef = useRef(0);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (src === baseSrc) return;
    const token = ++fadeTokenRef.current;

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (fadeTokenRef.current !== token) return;
      if (reduceMotion) {
        setBaseSrc(src);
        setOverlaySrc(null);
        setIsFading(false);
        return;
      }
      setOverlaySrc(src);
      requestAnimationFrame(() => setIsFading(true));
    };
    img.src = src;
  }, [src, baseSrc, reduceMotion]);

  const handleFadeEnd = () => {
    if (!overlaySrc) return;
    setBaseSrc(overlaySrc);
    setOverlaySrc(null);
    setIsFading(false);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg">
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10" />
      <div className="rounded-xl bg-secondary p-4 md:p-6">
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={baseSrc}
            alt={alt}
            className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
            style={{ willChange: "opacity, transform", backfaceVisibility: "hidden", transform: "translateZ(0)", opacity: 1 }}
            loading="eager"
            decoding="async"
            draggable={false}
          />
          {overlaySrc && (
            <img
              src={overlaySrc}
              alt={alt}
              onTransitionEnd={handleFadeEnd}
              className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none"
              style={{
                willChange: "opacity, transform",
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
                transition: "opacity 220ms ease",
                opacity: isFading ? 1 : 0,
              }}
              decoding="async"
              draggable={false}
            />
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
        <div className="h-1 bg-primary/70 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/* ---------------- component ---------------- */
export default function ScrollableShowcase({
  id,
  className,
  topOffsetPx = 96,
}: ScrollableShowcaseProps) {
  // pull from JSON (no casts)
  const showcase = siteData.showcase;
  const rawItems = (showcase?.items ?? []) as Array<{
    key: string;
    tag?: string;
    title: string;
    body: string;
    imageKey: keyof typeof IMAGE_MAP | string;
    imageAlt?: string;
    anchorId: string;
    primary?: { label: string; icon?: keyof typeof ICON_MAP | string; variant?: ShowcaseAction["variant"]; href?: string };
    secondary?: { label: string; variant?: ShowcaseAction["variant"]; href?: string };
  }>;

  // map JSON -> runtime items
  const items: ShowcaseItem[] = useMemo(
    () =>
      rawItems.map((ri) => ({
        key: ri.key,
        tag: ri.tag,
        title: ri.title,
        body: ri.body,
        image: IMAGE_MAP[ri.imageKey as string] ?? cat, // fallback
        imageAlt: ri.imageAlt,
        anchorId: ri.anchorId,
        primary: ri.primary
          ? {
              label: ri.primary.label,
              icon: ri.primary.icon ? ICON_MAP[ri.primary.icon as string] : undefined,
              href: ri.primary.href,
              variant: ri.primary.variant,
            }
          : undefined,
        secondary: ri.secondary
          ? {
              label: ri.secondary.label,
              href: ri.secondary.href,
              variant: ri.secondary.variant,
            }
          : undefined,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [siteData]
  );

  const offset = showcase?.topOffsetPx ?? topOffsetPx;

  const { sectionsRef, active, setActive } = useActiveStepObserver(items.length);
  usePreloadImages(items.map((i) => toSrc(i.image)));

  const stepHeight = useViewportStepHeight(offset);
  const isLg = useMediaQuery("(min-width: 1024px)");
  const activeItem = items[active];

  // Keyboard nav + hash sync
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        const next = Math.min(items.length - 1, active + 1);
        jumpTo(next);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        const prev = Math.max(0, active - 1);
        jumpTo(prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, items.length]);

  useEffect(() => {
    if (!items.length) return;
    const hash = `#${items[active].anchorId}`;
    if (history.replaceState) history.replaceState(null, "", hash);
  }, [active, items]);

  const jumpTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    const el = sectionsRef.current[clamped];
    if (el) {
      const rect = el.getBoundingClientRect();
      const target = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
      window.scrollTo({ top: target, behavior: "smooth" });
    }
    setActive(clamped);
  };

  if (!items.length) return null;

  return (
    <section id={id} className={cn("bg-background py-20 md:py-24", className)}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[1.15fr_0.95fr] lg:gap-x-4 xl:gap-x-6">
          {/* TEXT COLUMN (left) */}
          <div className="lg:order-1">
            <div className="rounded-2xl bg-card">
              {/* Mobile dots */}
              <div className="lg:hidden sticky top-0 z-10 -mt-4 mb-2 flex justify-center">
                <div className="rounded-full bg-background/80 backdrop-blur px-3 py-1">
                  <nav aria-label="Progress" className="flex gap-1.5">
                    {items.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to step ${i + 1}`}
                        aria-current={i === active ? "step" : undefined}
                        className={cn(
                          "h-2.5 rounded-full transition-all",
                          i === active ? "w-5 bg-primary" : "w-2.5 bg-muted-foreground/40"
                        )}
                        onClick={() => jumpTo(i)}
                      />
                    ))}
                  </nav>
                </div>
              </div>

              <div className={cn("px-5 py-6 md:px-8 md:py-10", "lg:px-8 lg:py-12", "snap-y snap-mandatory lg:snap-none")}>
                <div className="space-y-8 md:space-y-12">
                  {items.map((item, idx) => (
                    <StepBlock
                      key={item.key}
                      refArticle={(el) => (sectionsRef.current[idx] = el)}
                      item={item}
                      isActive={idx === active}
                      topOffsetPx={offset}
                      matchHeight={stepHeight}
                      isLast={idx === items.length - 1}
                      isLg={isLg}
                      onJumpNext={() => jumpTo(Math.min(items.length - 1, idx + 1))}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STICKY MEDIA (right) — desktop only */}
          <div className="lg:order-2">
            <div className="lg:sticky" style={{ top: offset }}>
              <div className="hidden lg:flex items-center justify-center" style={{ minHeight: stepHeight }}>
                <div className="w-full lg:max-w-md xl:max-w-lg 2xl:max-w-xl">
                  <MediaPanel
                    src={toSrc(activeItem.image)}
                    alt={activeItem.imageAlt ?? activeItem.title}
                    progress={((active + 1) / items.length) * 100}
                  />
                </div>
              </div>
              <div className="lg:hidden" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- child ---------------- */
function StepBlock({
  refArticle,
  item,
  isActive,
  topOffsetPx,
  matchHeight,
  isLast = false,
  isLg,
  onJumpNext,
}: {
  refArticle: (el: HTMLElement | null) => void;
  item: ShowcaseItem;
  isActive: boolean;
  topOffsetPx: number;
  matchHeight: number | null;
  isLast?: boolean;
  isLg: boolean;
  onJumpNext: () => void;
}) {
  const onPrimary = () => fireContactEvent(item.key, "cta");

  const onSecondary = (e?: React.MouseEvent) => {
    if (item.anchorId) {
      e?.preventDefault();
      const href = item.secondary?.href as string | undefined;
      smoothScrollToCenter(href?.replace("#", "") || item.anchorId);
    }
  };

  return (
    <article
      id={item.anchorId}
      ref={refArticle}
      className={cn("relative grid items-center transition-all duration-300 snap-start", isActive ? "opacity-100" : "opacity-90")}
      style={isLg ? { minHeight: Math.max(360, Math.round((matchHeight ?? 620) * 0.7)) } : undefined}
      aria-current={isActive ? "true" : undefined}
      aria-label={item.title}
    >
      <div style={{ scrollMarginTop: topOffsetPx + 16 }} className="h-px w-full" aria-hidden />

      {/* vertical rail + active pip (desktop only) */}
      <div className={cn("absolute -left-3 top-0 hidden h-full lg:block")} aria-hidden>
        <div className="mx-auto h-full w-px bg-border/60" />
        <div
          className={cn(
            "absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full border bg-background transition-all duration-300",
            isActive ? "border-primary ring-4 ring-primary/15" : "border-border"
          )}
        />
      </div>

      <div className={cn("max-w-[68ch] pl-0 lg:pl-6", "transform-gpu transition-all duration-300", isActive ? "translate-y-0" : "translate-y-0.5")}>
        {item.tag ? (
          <div className="mb-2.5">
            <div className="mb-4 inline-block rounded-full text-sm font-semibold tracking-wide text-primary">{item.tag}</div>
          </div>
        ) : null}

        {/* MOBILE IMAGE (per section) */}
        <div className="lg:hidden mb-4">
          <div className="overflow-hidden rounded-xl bg-card/50">
            <img
              src={toSrc(item.image)}
              alt={item.imageAlt ?? item.title}
              loading="lazy"
              decoding="async"
              className="block w-full h-56 object-cover"
              draggable={false}
            />
          </div>
        </div>

        <h2 className="text-2xl md:text-4xl xl:text-5xl font-semibold tracking-tight leading-[1.15] text-foreground">
          {item.title}
        </h2>

        <p className="mt-3 md:mt-4 text-[15px] md:text-lg leading-7 md:leading-8 text-muted-foreground/90">{item.body}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {item.primary ? (
            <Button onClick={onPrimary} variant={item.primary.variant ?? "default"} className="h-10 md:h-11 rounded-xl px-5 md:px-6 text-sm md:text-base shadow-sm">
              {item.primary.icon}
              <span className={cn(item.primary.icon && "ml-2")}>{item.primary.label}</span>
            </Button>
          ) : null}

          {item.secondary ? (
            item.secondary.href ? (
              <Button
                variant={item.secondary.variant ?? "outline"}
                asChild
                className="h-10 md:h-11 rounded-xl px-5 md:px-6 text-sm md:text-base"
                onClick={(e) => onSecondary(e)}
              >
                <a href={item.secondary.href}>{item.secondary.label}</a>
              </Button>
            ) : (
              <Button
                variant={item.secondary.variant ?? "outline"}
                className="h-10 md:h-11 rounded-xl px-5 md:px-6 text-sm md:text-base"
                onClick={() => smoothScrollToCenter(item.anchorId)}
              >
                {item.secondary.label}
              </Button>
            )
          ) : null}

          <Button variant="ghost" className="ml-auto h-10 px-3 text-sm text-muted-foreground lg:hidden" onClick={onJumpNext} aria-label="Next section">
            Next →
          </Button>
        </div>

        {!isLast && <div className="mt-8 md:mt-10 h-px w-full bg-border/70" />}
      </div>
    </article>
  );
}
