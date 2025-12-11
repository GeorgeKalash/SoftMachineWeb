// src/sections/CaseStudyCarousel.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import siteData from "@/SiteData/SiteData.json";

/* ---- logos kept in code; JSON uses logoKey ---- */
import MGLogo from "@/assets/Clients/MGLogo.jpeg";
import MasagLogo from "@/assets/Clients/MasagLogo.jpeg";
import BYCLogo from "@/assets/Clients/BYCLogo.png";
import NEGLogo from "@/assets/Clients/NEGLogo.jpg";
import CILLogo from "@/assets/Clients/CILLogo.jpeg";
import HyundaiLogo from "@/assets/Clients/HyundaiLogo.png";
import TamkeenLogo from "@/assets/Clients/TamkeenLogo.png";
import KorristarLogo from "@/assets/Clients/KorristarLogo.jpeg";
import GDKLogo from "@/assets/Clients/GDKLogo.jpeg";

const LOGOS: Record<string, string> = {
  MGLogo,
  MasagLogo,
  BYCLogo,
  NEGLogo,
  CILLogo,
  HyundaiLogo,
  TamkeenLogo,
  KorristarLogo,
  GDKLogo,
};

export type Metric = { label: string; value: string };
export type ImageLike = string | { src: string };

export type CaseItem = {
  id: string | number;
  brand: string;
  logo?: ImageLike;
  logoAlt?: string;
  nameOverride?: string;
  image?: ImageLike;
  imageAlt?: string;
  mediaAspect?: number;
  imageFit?: "contain" | "cover";
  quote?: string;
  person?: string;
  role?: string;
  metrics?: Metric[];
};

export type FixedCarouselProps = {
  lanes?: 1 | 2 | 3;
  speed?: number;
  pauseOnHover?: boolean;
  gap?: number;
  pairGap?: number;
  cardWidth?: number;
  responsiveWidth?: boolean;
  edgeFade?: boolean;
  direction?: "ltr" | "rtl";
  autoPauseOffscreen?: boolean;
  className?: string;
};

const toSrc = (img?: ImageLike) =>
  typeof img === "string" ? img : img?.src ?? undefined;

const cx = (...cls: Array<string | undefined | false | null>) =>
  cls.filter(Boolean).join(" ");

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

function chunkPairs<T>(arr: T[]): Array<[T, T | undefined]> {
  const out: Array<[T, T | undefined]> = [];
  for (let i = 0; i < arr.length; i += 2) out.push([arr[i], arr[i + 1]]);
  if (arr.length % 2 === 1) out[out.length - 1][1] = arr[0];
  return out;
}

type ClientsJson = {
  header?: { title?: string; subtitle?: string };
  teaser?: { title?: string; subtitle?: string };
  items?: Array<{
    id?: string;
    company?: string;
    brand?: string;
    name?: string;
    logoSrc?: string;
    logo?: string | { src: string };
    logoKey?: string;
    quote?: string;
    person?: string;
    title?: string;
    testimonial?: { name?: string; role?: string; content?: string };
    metrics?: Metric[];
  }>;
};
type SiteData = {
  clients?: ClientsJson;
  assets?: Record<string, string>;
  testimonials?: unknown;
};

const SD = siteData as unknown as SiteData;
const CLIENTS_JSON = (SD.clients ?? {}) as ClientsJson;
const ASSETS = SD.assets ?? {};

/* ---------- resolve logo: prefer code imports via logoKey, then fallbacks ---------- */
const resolveLogo = (
  it: NonNullable<ClientsJson["items"]>[number]
): string | undefined => {
  if (!it) return undefined;

  // explicit URL/src wins
  const direct =
    (typeof it.logo === "string"
      ? it.logo
      : it.logo && "src" in it.logo
      ? it.logo.src
      : undefined) ?? it.logoSrc;
  if (direct) return direct;

  // prefer imported assets (same keys as TestimonialsTeaserCarousel)
  if (it.logoKey && LOGOS[it.logoKey]) return LOGOS[it.logoKey];

  // final fallback to assets mapping in data.json, if present
  if (it.logoKey && typeof ASSETS[it.logoKey] === "string")
    return ASSETS[it.logoKey];

  return undefined;
};

const ITEMS_FROM_JSON: CaseItem[] =
  (CLIENTS_JSON.items ?? []).map((c, i) => ({
    id: c?.id ?? `${c?.company ?? c?.brand ?? "client"}-${i}`,
    brand: c?.company ?? c?.brand ?? c?.name ?? "Client",
    logo: resolveLogo(c!),
    logoAlt: c?.company ?? c?.brand ?? c?.name ?? "Client logo",
    person: c?.testimonial?.name ?? c?.person,
    role: c?.testimonial?.role ?? c?.title,
    quote: c?.testimonial?.content ?? c?.quote,
    metrics: c?.metrics,
  })) ?? [];

const Card: React.FC<{
  item: CaseItem;
  cardWidthPx: number;
  widthStyle: number | string;
}> = ({ item, cardWidthPx, widthStyle }) => {
  const fit = item.imageFit === "cover" ? "object-cover" : "object-contain";
  const aspect = item.mediaAspect ?? 16 / 9;

  const hasImage = Boolean(item.image);
  const hasText = Boolean(
    item.quote || item.metrics?.length || item.person || item.role
  );
  const hasBody = hasImage || hasText;

  const imageBoxW = Math.min(112, Math.max(84, Math.round(cardWidthPx * 0.34)));
  const cardBg = "bg-zinc-50/80 dark:bg-zinc-900/60";

  return (
    <article
      role="listitem"
      className={cx(
        "group relative flex flex-col rounded-2xl border border-zinc-200/70 p-4 backdrop-blur-lg transition-[opacity,transform,border-color] will-change-transform",
        "hover:opacity-95 active:scale-[0.995] focus-within:ring-2 focus-within:ring-zinc-400/40 dark:focus-within:ring-zinc-500/40",
        "dark:border-zinc-700/60",
        cardBg
      )}
      style={{ width: widthStyle, minWidth: widthStyle }}
    >
      <header className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-zinc-200/70 dark:ring-zinc-700/70 bg-white dark:bg-zinc-950">
          {item.logo ? (
            <img
              src={toSrc(item.logo)}
              alt={item.logoAlt ?? item.brand}
              className="h-full w-full object-contain object-center"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
            {item.nameOverride ?? item.brand}
          </div>
        </div>
      </header>

      {/* Body */}
      {hasBody && (
        <div
          className={cx(
            "mt-3 grid items-start gap-3",
            hasImage && hasText ? "grid-cols-[auto,1fr]" : "grid-cols-1"
          )}
        >
          {hasImage && (
            <div
              className="shrink-0 overflow-hidden rounded-xl bg-zinc-100/80 dark:bg-zinc-800/70"
              style={{ width: imageBoxW, aspectRatio: aspect }}
            >
              <img
                src={toSrc(item.image)}
                alt={item.imageAlt ?? item.brand}
                className={cx("h-full w-full object-center", fit)}
                draggable={false}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </div>
          )}

          {hasText && (
            <div className="min-w-0">
              {item.quote && (
                <p className="text-[13px]/6 text-zinc-700 dark:text-zinc-300">
                  “{item.quote}”
                </p>
              )}

              {!!item.metrics?.length && (
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  {item.metrics.map((m, i) => (
                    <div key={i}>
                      <dt className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        {m.label}
                      </dt>
                      <dd className="text-sm font-semibold leading-6 tracking-tight text-zinc-900 dark:text-zinc-100">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {(item.person || item.role) && (
                <div className="mt-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                  {item.person && (
                    <div className="truncate text-zinc-900 dark:text-zinc-100">
                      {item.person}
                    </div>
                  )}
                  {item.role && <div className="truncate">{item.role}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

/* ------------------------------ Pair column ----------------------------- */
const PairColumn: React.FC<{
  top: CaseItem;
  bottom?: CaseItem;
  pairGap: number;
  cardWidthPx: number;
  widthStyle: number | string;
}> = ({ top, bottom, pairGap, cardWidthPx, widthStyle }) => {
  return (
    <div className="flex shrink-0 select-none flex-col" style={{ gap: pairGap }}>
      <Card item={top} cardWidthPx={cardWidthPx} widthStyle={widthStyle} />
      {bottom && (
        <Card item={bottom} cardWidthPx={cardWidthPx} widthStyle={widthStyle} />
      )}
    </div>
  );
};

/* -------------------------------- Lane ---------------------------------- */
const Lane: React.FC<{
  items: CaseItem[];
  speed: number; // px/s
  gap: number; // px between columns
  pairGap: number; // px between the two cards in a column
  pauseOnHover: boolean;
  cardWidthPx: number;
  widthStyle: number | string;
  direction: "ltr" | "rtl";
  edgeFade: boolean;
  autoPauseOffscreen: boolean;
}> = ({
  items,
  speed,
  gap,
  pairGap,
  pauseOnHover,
  cardWidthPx,
  widthStyle,
  direction,
  edgeFade,
  autoPauseOffscreen,
}) => {
  const reduced = usePrefersReducedMotion();

  const columns = useMemo(() => chunkPairs(items), [items]);

  const baseCols = useMemo(
    () =>
      columns.length < 4
        ? [...columns, ...columns, ...columns]
        : columns,
    [columns]
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLDivElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [ready, setReady] = useState(false);
  const [onscreen, setOnscreen] = useState(true);

  const offsetRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);

  // --- drag state for swipe ---
  const dragState = useRef<{
    pointerId: number | null;
    isDragging: boolean;
    lastX: number;
  }>({
    pointerId: null,
    isDragging: false,
    lastX: 0,
  });

  useEffect(() => {
    if (!autoPauseOffscreen || typeof IntersectionObserver === "undefined")
      return;
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnscreen(entry.isIntersecting),
      {
        rootMargin: "200px",
      }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [autoPauseOffscreen]);

  useEffect(() => {
    const measure = () => {
      const full = firstCopyRef.current?.scrollWidth ?? 0;
      setCopyWidth(full);
      setReady(full > 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (firstCopyRef.current) ro.observe(firstCopyRef.current);
    return () => ro.disconnect();
  }, [baseCols.length, gap, cardWidthPx, pairGap]);

  const updateTransform = () => {
    if (!trackRef.current || !copyWidth) return;
    let off = offsetRef.current % copyWidth;
    if (off < 0) off += copyWidth;
    offsetRef.current = off;
    const x = direction === "rtl" ? off : -off;
    trackRef.current.style.transform = `translate3d(${x}px,0,0)`;
  };

  useAnimationFrame((ts) => {
    if (!ready || reduced || !copyWidth || paused || focused || !onscreen) {
      lastTsRef.current = ts;
      return;
    }
    if (lastTsRef.current == null) {
      lastTsRef.current = ts;
      return;
    }
    const dt = (ts - (lastTsRef.current ?? ts)) / 1000;
    lastTsRef.current = ts;

    const dirSign = direction === "rtl" ? -1 : 1;
    offsetRef.current += dirSign * speed * dt;

    updateTransform();
  });

  const onEnter = () => pauseOnHover && setPaused(true);
  const onLeave = () => pauseOnHover && setPaused(false);

  /* -------------------- DRAG / SWIPE HANDLERS -------------------- */

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragState.current.pointerId = e.pointerId;
    dragState.current.isDragging = true;
    dragState.current.lastX = e.clientX;

    // Pause auto-scroll while dragging
    setPaused(true);

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const drag = dragState.current;
    if (!drag.isDragging || drag.pointerId !== e.pointerId) return;
    if (!copyWidth) return;

    const dx = e.clientX - drag.lastX;
    drag.lastX = e.clientX;

    // Move in same direction as finger/mouse
    const sign = direction === "rtl" ? 1 : -1;
    offsetRef.current += sign * dx;

    updateTransform();
  };

  const handlePointerEnd: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const drag = dragState.current;
    if (!drag.isDragging || drag.pointerId !== e.pointerId) return;

    drag.isDragging = false;
    drag.pointerId = null;

    // Resume auto-scroll
    setPaused(false);

    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  /* -------------------- REDUCED MOTION (no auto) -------------------- */

  if (reduced) {
    return (
      <div
        className="relative overflow-x-auto overflow-y-hidden"
        ref={rootRef}
      >
        <div className="flex w-max items-stretch" style={{ gap }}>
          {baseCols.map(([a, b], idx) => (
            <PairColumn
              key={`rm-${a.id}-${b?.id ?? "x"}-${idx}`}
              top={a}
              bottom={b}
              pairGap={pairGap}
              cardWidthPx={cardWidthPx}
              widthStyle={widthStyle}
            />
          ))}
        </div>
      </div>
    );
  }

  const maskCSS = edgeFade
    ? {
        WebkitMaskImage:
          "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
      } as React.CSSProperties
    : undefined;

  const rootStyle: React.CSSProperties = {
    ...(maskCSS ?? {}),
    touchAction: "pan-y", // allow vertical scroll while we handle horizontal drag
  };

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      style={rootStyle}
    >
      {!ready && (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-zinc-200/40 to-transparent dark:via-zinc-700/30" />
      )}

      <motion.div
        ref={trackRef}
        className="flex w-max items-stretch will-change-transform"
        role="list"
        aria-roledescription="carousel lane"
        aria-label="Customer stories"
        style={{ gap, opacity: ready ? 1 : 0 }}
      >
        <div
          ref={firstCopyRef}
          className="flex w-max items-stretch"
          style={{ gap }}
          tabIndex={0}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Auto-scrolling content. Focus pauses motion."
        >
          {baseCols.map(([a, b], idx) => (
            <PairColumn
              key={`a-${a.id}-${b?.id ?? "x"}-${idx}`}
              top={a}
              bottom={b}
              pairGap={pairGap}
              cardWidthPx={cardWidthPx}
              widthStyle={widthStyle}
            />
          ))}
        </div>

        <div
          className="pointer-events-none flex w-max select-none items-stretch"
          style={{ gap }}
          aria-hidden
        >
          {baseCols.map(([a, b], idx) => (
            <PairColumn
              key={`b-${a.id}-${b?.id ?? "x"}-${idx}`}
              top={a}
              bottom={b}
              pairGap={pairGap}
              cardWidthPx={cardWidthPx}
              widthStyle={widthStyle}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* --------------------------------- Root --------------------------------- */
export const CaseStudyCarousel: React.FC<FixedCarouselProps> = ({
  lanes = 1,
  speed = 70,
  gap = 16,
  pairGap = 10,
  cardWidth = 300,
  pauseOnHover = true,
  responsiveWidth = true,
  edgeFade = true,
  direction: dirProp,
  autoPauseOffscreen = true,
  className,
}) => {
  const laneCount = Math.min(3, Math.max(1, lanes));

  const [direction, setDirection] = useState<"ltr" | "rtl">(dirProp ?? "ltr");
  useEffect(() => {
    if (dirProp) return setDirection(dirProp);
    if (typeof document !== "undefined") {
      const d = (document?.dir as "ltr" | "rtl" | undefined) ?? "ltr";
      setDirection(d);
    }
  }, [dirProp]);

  // Distribute strictly from data.json items
  const sourceItems = ITEMS_FROM_JSON;
  const distributed = useMemo(() => {
    const arr: CaseItem[][] = Array.from(
      { length: laneCount },
      () => []
    );
    sourceItems.forEach((it, i) => arr[i % laneCount].push(it));
    return arr;
  }, [laneCount, sourceItems]);

  const widthStyle: string | number = responsiveWidth
    ? `clamp(${Math.round(cardWidth * 0.72)}px, 28vw, ${cardWidth}px)`
    : cardWidth;

  const headerTitle =
    CLIENTS_JSON.header?.title ??
    CLIENTS_JSON.teaser?.title ??
    "What our clients say about us?";
  const headerSubtitle =
    CLIENTS_JSON.header?.subtitle ?? CLIENTS_JSON.teaser?.subtitle ?? undefined;

  return (
    <section
      className={["not-prose w-full", className ?? ""].join(" ")}
      aria-label="Customer stories carousel"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {headerTitle}
            </h2>
            {headerSubtitle && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {headerSubtitle}
              </p>
            )}
          </div>
        </div>

        {sourceItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300/60 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700/60 dark:text-zinc-400">
            No client items found in <code>data.json</code>.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {distributed.map((laneItems, idx) => (
              <Lane
                key={idx}
                items={laneItems}
                speed={speed * (1 + idx * 0.08)} // subtle parallax per lane
                gap={gap}
                pairGap={pairGap}
                pauseOnHover={pauseOnHover}
                cardWidthPx={cardWidth}
                widthStyle={widthStyle}
                direction={direction}
                edgeFade={edgeFade}
                autoPauseOffscreen={autoPauseOffscreen}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudyCarousel;
