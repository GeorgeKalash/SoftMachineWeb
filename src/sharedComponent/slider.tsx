"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";


export type Metric = { label: string; value: string };
export type CaseItem = {
  id: string | number;
  brand: string;
  logo?: string | { src: string } | React.ReactNode; // import, url, or node
  quote?: string;
  person?: string; // e.g., "Carlos Costa"
  role?: string;   // e.g., "Director, TAG Heuer"
  metrics?: Metric[]; // e.g., [{ value: "+625%", label: "User spend / month" }]
};

export type CaseStudyCarouselProps = {
  items: CaseItem[];
  /** number of horizontal lanes (rows). Auto‑clamped to 1–3. */
  lanes?: 1 | 2 | 3;
  /** pixels/second lane speed (constant regardless of content width) */
  speed?: number;
  /** pause scroll on hover */
  pauseOnHover?: boolean;
  /** optional custom renderer for each card */
  renderItem?: (item: CaseItem) => React.ReactNode;
  /** container className */
  className?: string;
};

/* ------------------------------ Helper utils ----------------------------- */
const toSrc = (img?: string | { src: string }) =>
  typeof img === "string" ? img : img?.src ?? undefined;

const usePrefersReducedMotion = () => {
  const [reduced, set] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => set(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
};

/* ------------------------------- Card (UI) ------------------------------- */
const DefaultCard: React.FC<{ item: CaseItem }> = ({ item }) => {
  const img = toSrc(item.logo as any);
  return (
    <div
      className={
        "group/card relative flex w-[320px] flex-col justify-between rounded-2xl  bg-white/90 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-colors dark:bg-zinc-900/80 dark:text-zinc-100 "
      }
      role="listitem"
    >
      <div className="flex items-center gap-3">
        {item.logo && typeof item.logo !== "object" && typeof item.logo !== "string" ? (
          <div className="shrink-0">{item.logo}</div>
        ) : img ? (
          <img
            src={img}
            alt={`${item.brand} logo`}
            className="h-7 w-auto shrink-0 object-contain"
            loading="lazy"
          />
        ) : (
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-zinc-100 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {item.brand[0]}
          </div>
        )}
        <div className="text-sm font-medium opacity-80">{item.brand}</div>
      </div>

      {item.quote && (
        <p className="mt-3 line-clamp-4 text-balance text-sm/6 text-zinc-700 dark:text-zinc-300">
          “{item.quote}”
        </p>
      )}

      {!!item.metrics?.length && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {item.metrics.map((m, idx) => (
            <div key={idx} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/70">
              <div className="text-lg font-bold tracking-tight">{m.value}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {(item.person || item.role) && (
        <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-800" />
          <div>
            {item.person && <div className="font-medium text-zinc-700 dark:text-zinc-200">{item.person}</div>}
            {item.role && <div>{item.role}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------------------- Lane (1 row) ------------------------------ */
const Lane: React.FC<{
  items: CaseItem[];
  speed: number; // px/s
  pauseOnHover: boolean;
  renderItem?: (item: CaseItem) => React.ReactNode;
}> = ({ items, speed, pauseOnHover, renderItem }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const reduced = usePrefersReducedMotion();
  const [contentWidth, setContentWidth] = useState(0);

  // Measure single‑copy width
  useEffect(() => {
    const measure = () => setContentWidth(contentRef.current?.scrollWidth ?? 0);
    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [items.length]);

  // Start/loop animation based on measured width
  useEffect(() => {
    if (reduced || !contentWidth) return;
    const duration = Math.max(6, contentWidth / speed); // seconds
    controls.start({
      x: -contentWidth,
      transition: { ease: "linear", duration, repeat: Infinity, repeatType: "loop" },
    });
  }, [contentWidth, speed, reduced, controls]);

  const handleEnter = () => {
    if (pauseOnHover) controls.stop();
  };
  const handleLeave = () => {
    if (pauseOnHover && !reduced && contentWidth) {
      const duration = Math.max(6, contentWidth / speed);
      controls.start({ x: -contentWidth, transition: { ease: "linear", duration, repeat: Infinity, repeatType: "loop" } });
    }
  };

  // Duplicate the content to make a continuous loop
  const duplicated = useMemo(() => (items.length < 6 ? [...items, ...items, ...items] : items), [items]);

  return (
    <div className="relative overflow-hidden" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <motion.div
        ref={trackRef}
        className="flex w-max gap-4 will-change-transform"
        animate={reduced ? undefined : controls}
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {/* one copy (measured) */}
        <div ref={contentRef} className="flex w-max gap-4" aria-hidden={false}>
          {duplicated.map((item, i) => (
            <div key={`a-${item.id}-${i}`}>{renderItem ? renderItem(item) : <DefaultCard item={item} />}</div>
          ))}
        </div>
        {/* second copy for seamless wrap */}
        <div className="flex w-max gap-4" aria-hidden>
          {duplicated.map((item, i) => (
            <div key={`b-${item.id}-${i}`}>{renderItem ? renderItem(item) : <DefaultCard item={item} />}</div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* ------------------------- Main carousel (multi‑lane) ------------------------- */
export const CaseStudyCarousel: React.FC<CaseStudyCarouselProps> = ({
  items,
  lanes = 3,
  speed = 70,
  pauseOnHover = true,
  renderItem,
  className,
}) => {
  const laneCount = Math.min(3, Math.max(1, lanes));

  // Distribute items into N lanes (round‑robin)
  const distributed = useMemo(() => {
    const arr: CaseItem[][] = Array.from({ length: laneCount }, () => []);
    items.forEach((it, i) => arr[i % laneCount].push(it));
    return arr;
  }, [items, laneCount]);

  return (
    <section className={"not-prose w-full " + (className ?? "")}
      aria-label="Customer results and testimonials carousel">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Loved by product and growth teams</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Auto‑scrolling case studies with real metrics.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {distributed.map((laneItems, idx) => (
            <Lane
              key={idx}
              items={laneItems}
              speed={speed * (1 + idx * 0.1)} // subtle parallax: lower rows a bit faster
              pauseOnHover={pauseOnHover}
              renderItem={renderItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudyCarousel;

/* --------------------------------- Demo ---------------------------------- */
// Remove this block in production. It helps you see the component quickly.
export const DemoSection: React.FC = () => {
  const DATA: CaseItem[] = [
    {
      id: "zenni",
      brand: "Zenni Optical",
      quote: "embraces data‑driven personalization and the results couldn't be more clear",
      metrics: [
        { value: "16%", label: "Surge in retention" },
        { value: "2x", label: "Increase in revenue" },
      ],
    },
    {
      id: "taptap",
      brand: "Taptap Send",
      quote: "We use the platform because it's simple to use and there's the possibility of scaling campaigns.",
      person: "Traci Trang",
      role: "CRM Specialist, Taptap Send",
    },
    {
      id: "bitcoin",
      brand: "Bitcoin.com",
      quote: "Turns messaging into a growth lever—engaging, educating, and launching features seamlessly.",
      metrics: [
        { value: "+15%", label: "Avg. daily transaction attempts" },
        { value: "+11%", label: "Avg. daily completed transactions" },
      ],
    },
    {
      id: "tag",
      brand: "TAG Heuer",
      quote: "The quality of the service is very good and the platform is easy to use—strong suits I'd recommend.",
      person: "Carlos Costa",
      role: "Product Group Director, TAG Heuer",
    },
    {
      id: "beachbum",
      brand: "Beach Bum Games",
      quote: "Uses journeys to re‑engage players and boost retention across their portfolio.",
      metrics: [
        { value: "+250%", label: "Click‑through rates" },
        { value: "+140%", label: "Paid user reactivation" },
      ],
    },
    {
      id: "rapchat",
      brand: "Rapchat",
      quote: "It's a game‑changer. It's an extension of our product with really good notifications set up.",
      person: "Seth Miller",
      role: "CEO, Rapchat",
    },
    {
      id: "betmate",
      brand: "Betmate",
      quote: "From onboarding to re‑engagement, journeys deliver the right message at every step.",
      metrics: [
        { value: "+600%", label: "MAU (unique, paying users)" },
        { value: "+625%", label: "User spending / month" },
      ],
    },
    {
      id: "cashea",
      brand: "Cashea",
      quote: "Very straightforward—you can come with limited experience and still understand the strategy.",
      person: "Marco Rosales",
      role: "Growth & Performance Lead, Cashea",
    },
  ];

  return (
    <div className="py-12">
      <CaseStudyCarousel items={DATA} lanes={3} speed={70} />
    </div>
  );
};
