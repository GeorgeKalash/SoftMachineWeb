"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, PlayCircle } from "lucide-react";

// assets
import cat from "@/assets/cat.gif";
import giphy from "@/assets/giphy-1.gif"
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
  anchorId: string; // used to scroll
};

type ScrollableShowcaseProps = {
  id?: string;
  className?: string;
  topOffsetPx?: number; // sticky offset (e.g., navbar height)
};

/* ---------------- data (EXACT CONTENT) ---------------- */
const items: ShowcaseItem[] = [
  {
    key: "analysis",
    tag: "Segment",
    title: "Business Process Analysis & Requirement Gathering",
    body:
      "Every Argus ERP implementation begins with a deep dive into your business operations. Our consultants analyze workflows, challenges, and objectives to design a system that perfectly fits your organization. This stage ensures Argus ERP supports process optimization, data accuracy, and improved decision-making across all departments.",
    image: cat,
    imageAlt: "Business analysis and discovery",
    anchorId: "analysis",
    primary: {
      label: "Start Assessment",
      icon: <Sparkles className="h-4 w-4" />,
    },
    secondary: {
      label: "See methodology",
      variant: "outline",
      href: "#analysis",
    },
  },
  {
    key: "configuration",
    tag: "Deployment",
    title: "Tailored Configuration & Phased Deployment",
    body:
      "At SoftMachine, we follow a structured, phased approach to ERP deployment. We configure Argus ERP based on your industry-specific needs, integrating modules such as Accounting, Inventory, Sales, and HR. This phased rollout minimizes operational disruption, reduces risk, and ensures a smooth digital transformation journey.",
    image: workcomputer,
    imageAlt: "Configuration and deployment",
    anchorId: "configuration",
    primary: {
      label: "Explore Modules",
      icon: <PlayCircle className="h-4 w-4" />,
    },
    secondary: {
      label: "Implementation plan",
      variant: "outline",
      href: "#configuration",
    },
  },
  {
    key: "training",
    tag: "Adoption",
    title: "User Training & Change Management",
    body:
      "We believe that successful ERP projects depend on user adoption. Our experts deliver personalized training sessions to equip your team with the skills needed to fully leverage Argus ERP. Through effective change management and hands-on guidance, we help your employees adapt quickly and confidently to the new system.",
    image: giphy,
    imageAlt: "User training",
    anchorId: "training",
    primary: {
      label: "Schedule Training",
      icon: <Sparkles className="h-4 w-4" />,
    },
    secondary: {
      label: "Training overview",
      variant: "outline",
      href: "#training",
    },
  },
  {
    key: "support",
    tag: "Success",
    title: "Continuous Improvement & Ongoing Support",
    body:
      "After go-live, SoftMachine remains your trusted ERP partner. We provide continuous system monitoring, updates, and technical support to ensure Argus ERP evolves with your business. Our goal is to drive long-term success through scalability, efficiency, and continuous improvement of your digital operations.",
    image: path,
    imageAlt: "Ongoing support and optimization",
    anchorId: "support",
    primary: {
      label: "Contact Support",
      icon: <PlayCircle className="h-4 w-4" />,
    },
    secondary: {
      label: "Success roadmap",
      variant: "outline",
      href: "#support",
    },
  },
];

/* ---------------- hooks ---------------- */
function useActiveStep(
  stepCount: number,
  topOffsetPx: number,
  options?: IntersectionObserverInit
) {
  const sentinelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const opts = useMemo<IntersectionObserverInit>(
    () => ({
      root: null,
      rootMargin: `-${topOffsetPx}px 0px -25% 0px`,
      threshold: 0,
      ...options,
    }),
    [options, topOffsetPx]
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        const idx = sentinelsRef.current.findIndex((el) => el === visible[0].target);
        if (idx !== -1) setActive(idx);
      }
    }, opts);

    sentinelsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [opts, stepCount]);

  return { sentinelsRef, active, setActive };
}

function usePreloadImages(urls: string[]) {
  useEffect(() => {
    const imgs = urls.map((u) => {
      const i = new Image();
      i.src = u;
      return i;
    });
    return () => {};
  }, [urls]);
}

/** Step height = viewport - sticky offset (keeps left & right in sync) */
function useViewportStepHeight(offset: number) {
  const [h, setH] = useState(0);
  useEffect(() => {
    const calc = () => setH(Math.max(320, window.innerHeight - offset));
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
const smoothScrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const fireContactEvent = (phase: string, intent: string) => {
  window.dispatchEvent(
    new CustomEvent("open-contact", {
      detail: { phase, intent },
    })
  );
};

/* ---------------- component ---------------- */
export default function ScrollableShowcase({
  id,
  className,
  topOffsetPx = 96,
}: ScrollableShowcaseProps) {
  const { sentinelsRef, active, setActive } = useActiveStep(items.length, topOffsetPx);
  usePreloadImages(items.map((i) => toSrc(i.image)));

  const stepHeight = useViewportStepHeight(topOffsetPx);
  const isLg = useMediaQuery("(min-width: 1024px)");

  const jumpTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    const el = sentinelsRef.current[clamped];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(clamped);
  };

  const activeItem = items[active];

  return (
    <section id={id} className={cn("bg-background py-24", className)}>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[1.3fr_0.9fr] lg:gap-x-6">
          {/* TEXT COLUMN (left) */}
          <div className="lg:order-1">
            <div className="rounded-2xl bg-card">
              <div className="px-5 py-8 md:px-8 md:py-10">
                <div className="space-y-12 md:space-y-16">
                  {items.map((item, idx) => (
                    <StepBlock
                      key={item.key}
                      refFn={(el) => (sentinelsRef.current[idx] = el)}
                      item={item}
                      isActive={idx === active}
                      topOffsetPx={topOffsetPx}
                      matchHeight={stepHeight}
                      isLast={idx === items.length - 1}
                      isLg={isLg}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STICKY MEDIA (right) — desktop only */}
<div className="lg:order-2">
  <div className="lg:sticky" style={{ top: topOffsetPx }}>
    <div
      className="hidden lg:flex items-center justify-center"
      style={{ minHeight: stepHeight }}
    >
      {/* wider on big screens */}
      <div className="w-full lg:max-w-md xl:max-w-lg 2xl:max-w-xl">
        <div className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg">
          {/* faint ring on the outer card */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10" />

          {/* framed media area with padding so the whole img shows */}
          <div className="w-full">
            <div className="rounded-xl border bg-secondary p-4 md:p-6">
              {/* choose an aspect; 4/3 feels roomy. square also works */}
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  key={toSrc(activeItem.image)}
                  src={toSrc(activeItem.image)}
                  alt={activeItem.imageAlt ?? activeItem.title}
                  className="h-full w-full object-contain transition-all duration-500 ease-out"
                />
              </div>
            </div>
          </div>

          {/* progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
            <div
              className="h-1 bg-primary/70 transition-all duration-500 ease-out"
              style={{ width: `${((active + 1) / items.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Hide on mobile/tablet to avoid duplicate media */}
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
  refFn,
  item,
  isActive,
  topOffsetPx,
  matchHeight,
  isLast = false,
  isLg,
}: {
  refFn: (el: HTMLDivElement | null) => void;
  item: ShowcaseItem;
  isActive: boolean;
  topOffsetPx: number;
  matchHeight: number | null;
  isLast?: boolean;
  isLg: boolean;
}) {
  const onPrimary = () => {
    fireContactEvent(item.key, "cta");
  };

  const onSecondary = (e?: React.MouseEvent) => {
    if (item.anchorId) {
      e?.preventDefault();
      smoothScrollTo(item.anchorId);
    }
  };

  return (
    <article
      id={item.anchorId}
      className={cn(
        "relative grid items-center transition-all duration-400",
        isActive ? "opacity-100" : "opacity-90"
      )}
      // Only enforce tall matched heights on large screens to keep mobile compact
      style={isLg ? { minHeight: matchHeight ?? 620 } : undefined}
    >
      {/* sentinel */}
      <div
        ref={refFn}
        style={{ scrollMarginTop: topOffsetPx + 16 }}
        className="h-px w-full"
        aria-hidden
      />

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

      {/* content box */}
      <div
        className={cn(
          "max-w-[68ch] pl-0 lg:pl-6",
          "transform-gpu transition-all duration-400",
          isActive ? "translate-y-0" : "translate-y-0.5"
        )}
      >
        {/* tag */}
        {item.tag ? (
          <div className="mb-2.5">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1",
                "text-[11px] font-medium tracking-wide text-muted-foreground",
                isActive ? "border-primary/30 bg-primary/5" : "border-border/60 bg-transparent"
              )}
            >
              {item.tag}
            </span>
          </div>
        ) : null}

        {/* MOBILE IMAGE (per section) */}
        <div className="lg:hidden mb-4">
          <div className="overflow-hidden rounded-xl border bg-card/50">
            <img
              src={toSrc(item.image)}
              alt={item.imageAlt ?? item.title}
              loading="lazy"
              className="block w-full h-56 object-cover"
            />
          </div>
        </div>

        {/* headline */}
        <h3
          className={cn(
            "text-2xl md:text-4xl font-semibold tracking-tight leading-[1.15]",
            "text-foreground"
          )}
        >
          {item.title}
        </h3>

        {/* body */}
        <p
          className={cn(
            "mt-3 md:mt-4",
            "text-[15px] md:text-lg leading-7 md:leading-8",
            "text-muted-foreground/90"
          )}
        >
          {item.body}
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {item.primary ? (
            <Button
              onClick={onPrimary}
              variant={item.primary.variant ?? "default"}
              className="h-10 md:h-11 rounded-xl px-5 md:px-6 text-sm md:text-base shadow-sm"
            >
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
                onClick={() => smoothScrollTo(item.anchorId)}
              >
                {item.secondary.label}
              </Button>
            )
          ) : null}
        </div>

        {/* divider between steps (not after last) */}
        {!isLast && (
          <div className="mt-8 md:mt-10">
            <div className="h-px w-full bg-border/70" />
          </div>
        )}
      </div>
    </article>
  );
}
