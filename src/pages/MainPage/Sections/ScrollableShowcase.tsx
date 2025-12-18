// src/sharedComponent/ScrollableShowcase.tsx
"use client";

import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, PlayCircle } from "lucide-react";
import siteData from "@/SiteData/SiteData.json";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Lenis from "@studio-freight/lenis";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* assets */
import cat from "@/assets/cat.gif";
import giphy from "@/assets/giphy-1.gif";
import workcomputer from "@/assets/workcomputer.gif";
import path from "@/assets/path.gif";

type ImageLike = string | { src: string };
const toSrc = (img: ImageLike) => (typeof img === "string" ? img : img.src);

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
  topOffsetPx?: number;
  enableSmooth?: boolean;

  /** If you have modal state, pass it here (recommended). */
  paused?: boolean;

  /** Auto-pause when body/html are scroll-locked (Radix/shadcn etc.). */
  pauseWhenScrollLocked?: boolean;
};

const IMAGE_MAP: Record<string, string> = { cat, giphy, workcomputer, path };
const ICON_MAP: Record<string, JSX.Element> = {
  sparkles: <Sparkles className="h-4 w-4" />,
  play: <PlayCircle className="h-4 w-4" />,
};

const smoothScrollToCenter = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const target =
    window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
  gsap.to(window, { scrollTo: target, duration: 0.5, ease: "power1.inOut" });
};

const fireContactEvent = (phase: string, intent: string) => {
  window.dispatchEvent(new CustomEvent("open-contact", { detail: { phase, intent } }));
};

export default function ScrollableShowcase({
  id,
  className,
  topOffsetPx = 96,
  enableSmooth = true,
  paused,
  pauseWhenScrollLocked = true,
}: ScrollableShowcaseProps) {
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

  const items: ShowcaseItem[] = useMemo(
    () =>
      rawItems.map((ri) => ({
        key: ri.key,
        tag: ri.tag,
        title: ri.title,
        body: ri.body,
        image: IMAGE_MAP[ri.imageKey as string] ?? cat,
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
          ? { label: ri.secondary.label, href: ri.secondary.href, variant: ri.secondary.variant }
          : undefined,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [siteData]
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const mediaPinRef = useRef<HTMLDivElement | null>(null);
  const mediaViewportRef = useRef<HTMLDivElement | null>(null);
  const mediaCardRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const [active, setActive] = useState(0);

  // ---- Auto-detect scroll lock (Radix/shadcn commonly sets this)
  const [scrollLocked, setScrollLocked] = useState(false);
  useEffect(() => {
    if (!pauseWhenScrollLocked) return;

    const body = document.body;
    const html = document.documentElement;

    const check = () => {
      const locked =
        body.hasAttribute("data-scroll-locked") ||
        html.hasAttribute("data-scroll-locked") ||
        body.classList.contains("overflow-hidden") ||
        html.classList.contains("overflow-hidden") ||
        body.style.overflow === "hidden" ||
        html.style.overflow === "hidden";
      setScrollLocked(locked);
    };

    check();

    const obs = new MutationObserver(check);
    obs.observe(body, { attributes: true, attributeFilter: ["style", "class", "data-scroll-locked"] });
    obs.observe(html, { attributes: true, attributeFilter: ["style", "class", "data-scroll-locked"] });

    return () => obs.disconnect();
  }, [pauseWhenScrollLocked]);

  const isPaused = !!paused || (pauseWhenScrollLocked && scrollLocked);

  // ---- Init Lenis + ScrollTriggers ONLY when not paused.
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // when paused, we intentionally do nothing (previous run cleanup already happened)
    if (isPaused) return;

    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    if (enableSmooth) {
      lenis = new Lenis({
        smoothWheel: true,
        // IMPORTANT: smoother touch can also hijack modal scroll; keep it false unless you really need it
        // smoothTouch: false,
      });

      const raf = (t: number) => {
        lenis?.raf(t);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const ctx = gsap.context(() => {
      const mm = ScrollTrigger.matchMedia;

      mm({
        "(min-width: 1024px)": () => {
          if (!leftColRef.current || !mediaPinRef.current || !mediaViewportRef.current || !mediaCardRef.current) return;

          const sections = sectionRefs.current.filter(Boolean);

          const setViewportHeight = () => {
            const h = Math.max(320, window.innerHeight);
            mediaViewportRef.current!.style.minHeight = `${h}px`;
            mediaViewportRef.current!.style.height = `${h}px`;
          };
          setViewportHeight();

          const pinEnd = () => {
            const leftH = leftColRef.current!.scrollHeight;
            const viewH = mediaViewportRef.current!.offsetHeight;
            return "+=" + Math.max(0, leftH - viewH);
          };

          ScrollTrigger.create({
            trigger: leftColRef.current,
            start: () => `top+=${topOffsetPx} top`,
            end: pinEnd,
            pin: mediaPinRef.current,
            pinSpacing: true,
            pinReparent: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });

          ScrollTrigger.create({
            trigger: leftColRef.current,
            start: "top top",
            end: pinEnd,
            snap: {
              snapTo: (value) => {
                const step = 1 / Math.max(1, sections.length - 1);
                return gsap.utils.snap(step, value);
              },
              duration: 0.5,
              ease: "power1.inOut",
              inertia: false,
            },
            invalidateOnRefresh: true,
          });

          sections.forEach((sec, i) => {
            ScrollTrigger.create({
              trigger: sec,
              start: "center center",
              end: "center center",
              onEnter: () => setActive(i),
              onEnterBack: () => setActive(i),
            });
          });

          const lastSection = sections[sections.length - 1];
          if (lastSection) {
            gsap.set(mediaCardRef.current, { transformOrigin: "50% 50%" });
            ScrollTrigger.create({
              trigger: lastSection,
              start: "center center",
              end: "bottom center",
              scrub: true,
              onUpdate: (self) => {
                const p = self.progress;
                gsap.to(mediaCardRef.current, {
                  opacity: 1 - p * 0.9,
                  scale: 1 - p * 0.03,
                  overwrite: "auto",
                  duration: 0.1,
                });
              },
            });
          }

          const onR = () => {
            setViewportHeight();
            ScrollTrigger.refresh();
          };
          window.addEventListener("resize", onR);
          window.addEventListener("load", onR);

          return () => {
            window.removeEventListener("resize", onR);
            window.removeEventListener("load", onR);
          };
        },

        "(max-width: 1023.98px)": () => {
          const sections = sectionRefs.current.filter(Boolean);
          sections.forEach((sec, i) => {
            ScrollTrigger.create({
              trigger: sec,
              start: "center center",
              end: "center center",
              onEnter: () => setActive(i),
              onEnterBack: () => setActive(i),
            });
          });
          ScrollTrigger.refresh();
        },
      });
    }, containerRef);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
      ctx.revert();
    };
  }, [enableSmooth, isPaused, topOffsetPx, items.length]);

  if (!items.length) return null;
  const activeItem = items[active];

  return (
    <section id={id} className={cn("bg-background py-20 md:py-24", className)}>
      <div className="container mx-auto max-w-6xl px-4" ref={containerRef}>
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[1.15fr_0.95fr] lg:gap-x-4 xl:gap-x-6">
          {/* LEFT */}
          <div ref={leftColRef}>
            <div className="rounded-2xl bg-card">
              {/* mobile dots */}
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
                        onClick={() => {
                          const target = sectionRefs.current[i];
                          if (!target) return;
                          const y = target.getBoundingClientRect().top + window.scrollY - (topOffsetPx + 16);
                          gsap.to(window, { scrollTo: y, duration: 0.5, ease: "power1.inOut" });
                        }}
                      />
                    ))}
                  </nav>
                </div>
              </div>

              <div className={cn("px-5 py-6 md:px-8 md:py-10", "lg:px-8 lg:py-12")}>
                <div className="space-y-8 md:space-y-12">
                  {items.map((item, idx) => (
                    <StepBlock
                      key={item.key}
                      refArticle={(el) => {
                        if (el) sectionRefs.current[idx] = el;
                      }}
                      item={item}
                      isActive={idx === active}
                      topOffsetPx={topOffsetPx}
                      isLast={idx === items.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT (pinned, centered) */}
          <div className="hidden lg:block">
            <div ref={mediaPinRef}>
              <div
                ref={mediaViewportRef}
                className="relative flex items-center justify-center"
                style={{ paddingTop: topOffsetPx }}
              >
                <div ref={mediaCardRef} className="w-full lg:max-w-md xl:max-w-lg 2xl:max-w-xl">
                  <div className="group relative overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg">
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10" />
                    <div className="rounded-xl bg-secondary p-4 md:p-6">
                      <div className="relative aspect-square w-full overflow-hidden">
                        <img
                          key={toSrc(activeItem.image)}
                          src={toSrc(activeItem.image)}
                          alt={activeItem.imageAlt ?? activeItem.title}
                          className="absolute inset-0 h-full w-full object-contain will-change-transform transition-opacity duration-300"
                          style={{ opacity: 1 }}
                          draggable={false}
                          decoding="async"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
                      <div
                        className="h-1 bg-primary/70 transition-all duration-500 ease-out"
                        style={{ width: `${((active + 1) / items.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* pinSpacing handles layout */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepBlock({
  refArticle,
  item,
  isActive,
  topOffsetPx,
  isLast = false,
}: {
  refArticle: (el: HTMLElement | null) => void;
  item: ShowcaseItem;
  isActive: boolean;
  topOffsetPx: number;
  isLast?: boolean;
}) {
  const onSecondary = (e?: React.MouseEvent) => {
    if (item.anchorId) {
      e?.preventDefault();
      const href = (item.secondary?.href as string | undefined)?.replace("#", "");
      smoothScrollToCenter(href || item.anchorId);
    }
  };

  return (
    <article
      id={item.anchorId ?? item.key}
      ref={refArticle}
      className={cn(
        "relative grid items-center transition-opacity duration-300",
        "min-h-[70vh] lg:min-h-[75vh]",
        isActive ? "opacity-100" : "opacity-90"
      )}
      style={{ scrollMarginTop: topOffsetPx + 16 }}
      aria-current={isActive ? "true" : undefined}
      aria-label={item.title}
    >
      <div className="h-px w-full" aria-hidden />

      <div className={cn("absolute -left-3 top-0 hidden h-full lg:block")} aria-hidden>
        <div className="mx-auto h-full w-px bg-border/60" />
        <div
          className={cn(
            "absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full border bg-background transition-all duration-300",
            isActive ? "border-primary ring-4 ring-primary/15" : "border-border"
          )}
        />
      </div>

      <div className={cn("max-w-[68ch] pl-0 lg:pl-6")}>
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

        {item.tag ? (
          <div className="mb-2.5">
            <div className="mb-4 inline-block rounded-full text-sm font-semibold tracking-wide text-primary">
              {item.tag}
            </div>
          </div>
        ) : null}

        <h2 className="text-2xl md:text-4xl xl:text-5xl font-semibold tracking-tight leading-[1.15] text-foreground">
          {item.title}
        </h2>

        <p className="mt-3 md:mt-4 text-[15px] md:text-lg leading-7 md:leading-8 text-muted-foreground/90">
          {item.body}
        </p>

        {!isLast && <div className="mt-8 md:mt-10 h-px w-full bg-border/70" />}
      </div>
    </article>
  );
}
