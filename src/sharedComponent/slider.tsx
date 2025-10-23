// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { motion, useAnimationFrame } from "framer-motion";

// /* --------------------------------- Types -------------------------------- */
// export type Metric = { label: string; value: string };
// export type ImageLike = string | { src: string };

// export type CaseItem = {
//   id: string | number;
//   brand: string;
//   /* Header */
//   logo?: ImageLike;
//   logoAlt?: string;
//   nameOverride?: string;
//   /* Body media */
//   image?: ImageLike; // optional
//   imageAlt?: string;
//   mediaAspect?: number; // e.g., 16/9 -> 1.777...
//   imageFit?: "contain" | "cover"; // default contain
//   /* Optional extras */
//   quote?: string;
//   person?: string;
//   role?: string;
//   metrics?: Metric[];
// };

// export type FixedCarouselProps = {
//   lanes?: 1 | 2 | 3; // stacked auto-scroll lanes
//   speed?: number; // pixels / second
//   pauseOnHover?: boolean;
//   gap?: number; // px between columns (each column = 2 cards)
//   pairGap?: number; // px between two cards in the same column
//   cardWidth?: number; // target card width in px (used for media sizing)
//   responsiveWidth?: boolean; // clamp the visual width responsively
//   edgeFade?: boolean; // fade edges to hint more content
//   direction?: "ltr" | "rtl"; // reverse direction for RTL
//   autoPauseOffscreen?: boolean; // auto-pause when the section is offscreen
//   className?: string;
// };

// /* ------------------------------- Utilities ------------------------------ */
// const toSrc = (img?: ImageLike) => (typeof img === "string" ? img : img?.src ?? undefined);
// const cx = (...cls: Array<string | undefined | false | null>) => cls.filter(Boolean).join(" ");

// const usePrefersReducedMotion = () => {
//   const [reduced, set] = useState(false);
//   useEffect(() => {
//     if (typeof window === "undefined" || !("matchMedia" in window)) return;
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     const update = () => set(mq.matches);
//     update();
//     mq.addEventListener?.("change", update);
//     return () => mq.removeEventListener?.("change", update);
//   }, []);
//   return reduced;
// };

// function chunkPairs<T>(arr: T[]): Array<[T, T | undefined]> {
//   const out: Array<[T, T | undefined]> = [];
//   for (let i = 0; i < arr.length; i += 2) out.push([arr[i], arr[i + 1]]);
//   if (arr.length % 2 === 1) out[out.length - 1][1] = arr[0];
//   return out;
// }

// /* ----------------------------- Remote assets ---------------------------- */
// /** Simple text-based logo (first letter) hosted by dummyimage */
// const brandLogo = (brand: string) =>
//   `https://dummyimage.com/96x96/0b0b0b/ffffff.png&text=${encodeURIComponent(brand?.[0] ?? "•")}`;

// /** A few tasteful Unsplash shots (stable IDs + 16:9 crops) */
// const IMG = {
//   analytics: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1280&q=60",
//   sales: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1280&q=60",
//   dashboard: "https://images.unsplash.com/photo-1551281044-8b94c1a1be6c?auto=format&fit=crop&w=1280&q=60",
//   hotel: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1280&q=60",
//   warehouse: "https://images.unsplash.com/photo-1581091870622-3a89c89f785d?auto=format&fit=crop&w=1280&q=60",
//   partsSquare: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=640&q=60",
//   chipSquare: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=60",
//   opsSquare: "https://images.unsplash.com/photo-1580894732444-8ecded3e7bff?auto=format&fit=crop&w=640&q=60",
// };

// /* ----------------------------- Fixed data set --------------------------- */
// const STATIC_ITEMS: CaseItem[] = [
//   {
//     id: "aurora-1",
//     brand: "Aurora Retail",
//     logo: brandLogo("Aurora Retail"),
//     image: IMG.dashboard,
//     imageAlt: "POS dashboard snapshot",
//     mediaAspect: 16 / 9,
//     imageFit: "contain",
//     quote: "We closed our monthly books 2 days faster. The daily view is a lifesaver.",
//     person: "Maya N.",
//     role: "Finance Manager",
//     metrics: [
//       { label: "Close time", value: "-38%" },
//       { label: "Manual entries", value: "-52%" },
//     ],
//   },
//   {
//     id: "cedar-2",
//     brand: "Cedar Foods",
//     logo: brandLogo("Cedar Foods"),
//     quote: "Inventory alerts are spot on. Out-of-stocks dropped without overstocking.",
//     person: "Rami K.",
//     role: "Supply Lead",
//     metrics: [
//       { label: "Stockouts", value: "-47%" },
//       { label: "Waste", value: "-29%" },
//     ],
//   },
//   {
//     id: "nimbus-3",
//     brand: "Nimbus Logistics",
//     logo: brandLogo("Nimbus Logistics"),
//     image: IMG.opsSquare,
//     imageAlt: "Operations badge",
//     mediaAspect: 1,
//     imageFit: "contain",
//     metrics: [
//       { label: "On-time delivery", value: "97.4%" },
//       { label: "Avg. handling time", value: "-31%" },
//     ],
//   },
//   {
//     id: "atlas-4",
//     brand: "Atlas Distributors",
//     logo: brandLogo("Atlas Distributors"),
//     image: IMG.sales,
//     imageAlt: "Sales pipeline view",
//     mediaAspect: 16 / 9,
//     imageFit: "contain",
//     quote: "Clean UI and clear permissions. Our reps finally love logging activities.",
//     person: "Aya Boutros",
//     role: "Sales Operations",
//   },
//   {
//     id: "marina-5",
//     brand: "Marina Boutique",
//     logo: brandLogo("Marina Boutique"),
//     quote: "The mobile approvals are clutch. I approve POs between meetings.",
//     person: "Samar T.",
//     role: "General Manager",
//   },
//   {
//     id: "zenhub-6",
//     brand: "ZenHub Pharmacy",
//     logo: brandLogo("ZenHub Pharmacy"),
//     image: IMG.chipSquare,
//     imageAlt: "Analytics chip close-up",
//     mediaAspect: 1,
//     imageFit: "contain",
//     metrics: [
//       { label: "Shrinkage", value: "-35%" },
//       { label: "Cycle count time", value: "-44%" },
//     ],
//   },
//   {
//     id: "orchard-7",
//     brand: "Orchard Markets",
//     logo: brandLogo("Orchard Markets"),
//     image: IMG.analytics,
//     imageAlt: "Cohorts & retention",
//     mediaAspect: 16 / 9,
//     imageFit: "contain",
//     quote: "Dashboards are actually readable. Our weekly standups are 15 minutes now.",
//     person: "Firas H.",
//     role: "Head of Ops",
//     metrics: [
//       { label: "Meeting time", value: "-40%" },
//       { label: "Report prep", value: "-61%" },
//     ],
//   },
//   {
//     id: "cedar-8",
//     brand: "Cedar Foods",
//     logo: brandLogo("Cedar Foods"),
//     metrics: [
//       { label: "PO lead time", value: "-22%" },
//       { label: "Supplier SLA", value: "+13%" },
//     ],
//   },
//   {
//     id: "lighthouse-9",
//     brand: "Lighthouse Hotels",
//     logo: brandLogo("Lighthouse Hotels"),
//     image: IMG.hotel,
//     imageAlt: "Reservations & billing",
//     mediaAspect: 16 / 9,
//     imageFit: "contain",
//     quote: "Front desk can do everything from one screen now. Night audits are painless.",
//     person: "Yara A.",
//     role: "Operations Supervisor",
//   },
//   {
//     id: "metro-10",
//     brand: "Metro Auto Parts",
//     logo: brandLogo("Metro Auto Parts"),
//     image: IMG.partsSquare,
//     imageAlt: "Parts matrix",
//     mediaAspect: 1,
//     imageFit: "contain",
//     metrics: [
//       { label: "Return rate", value: "-18%" },
//       { label: "Avg. ticket", value: "+21%" },
//     ],
//   },
//   {
//     id: "cedar-11",
//     brand: "Cedar Foods",
//     logo: brandLogo("Cedar Foods"),
//     quote: "Support replies with actual fixes, not templates. We ship features faster now.",
//     person: "Imad R.",
//     role: "Product Owner",
//   },
//   {
//     id: "aurora-12",
//     brand: "Aurora Retail",
//     logo: brandLogo("Aurora Retail"),
//     image: IMG.analytics,
//     imageAlt: "Store performance",
//     mediaAspect: 16 / 9,
//     imageFit: "contain",
//     metrics: [
//       { label: "Retention", value: "+14%" },
//       { label: "Revenue per store", value: "+9%" },
//     ],
//   },
//   {
//     id: "nimbus-13",
//     brand: "Nimbus Logistics",
//     logo: brandLogo("Nimbus Logistics"),
//     image: IMG.warehouse,
//     imageAlt: "Logistics icon",
//     mediaAspect: 16 / 9,
//     imageFit: "cover",
//   },
//   {
//     id: "atlas-14",
//     brand: "Atlas Distributors",
//     logo: brandLogo("Atlas Distributors"),
//     quote: "We finally killed the spreadsheet chaos. The team is visibly less stressed.",
//     person: "Hussein D.",
//     role: "Warehouse Lead",
//   },
// ];

// /* ------------------------------ Card UI --------------------------------- */
// const Card: React.FC<{
//   item: CaseItem;
//   cardWidthPx: number;
//   widthStyle: number | string;
// }> = ({ item, cardWidthPx, widthStyle }) => {
//   const fit = item.imageFit === "cover" ? "object-cover" : "object-contain";
//   const aspect = item.mediaAspect ?? 16 / 9;

//   const hasImage = Boolean(item.image);
//   const hasText = Boolean(item.quote || item.metrics?.length || item.person || item.role);
//   const hasBody = hasImage || hasText;

//   const imageBoxW = Math.min(112, Math.max(84, Math.round(cardWidthPx * 0.34)));
//   const cardBg = "bg-zinc-50/80 dark:bg-zinc-900/60";

//   return (
//     <article
//       role="listitem"
//       className={cx(
//         "group relative flex flex-col rounded-2xl border border-zinc-200/70 p-4 backdrop-blur-lg transition-[opacity,transform,border-color] will-change-transform",
//         "hover:opacity-95 active:scale-[0.995] focus-within:ring-2 focus-within:ring-zinc-400/40 dark:focus-within:ring-zinc-500/40",
//         "dark:border-zinc-700/60",
//         cardBg
//       )}
//       style={{ width: widthStyle, minWidth: widthStyle }}
//     >
//       {/* Header: circular logo + brand (logo fills circle but uses contain to avoid cropping) */}
//       <header className="flex items-center gap-3">
//         <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-zinc-200/70 dark:ring-zinc-700/70 bg-white dark:bg-zinc-950">
//           {item.logo ? (
//             <img
//               src={toSrc(item.logo)}
//               alt={item.logoAlt ?? item.brand}
//               className="h-full w-full object-contain object-center"
//               draggable={false}
//               loading="lazy"
//               decoding="async"
//             />
//           ) : null}
//         </div>

//         <div className="min-w-0">
//           <div className="truncate text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
//             {item.nameOverride ?? item.brand}
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       {hasBody && (
//         <div
//           className={cx(
//             "mt-3 grid items-start gap-3",
//             hasImage && hasText ? "grid-cols-[auto,1fr]" : "grid-cols-1"
//           )}
//         >
//           {hasImage && (
//             <div
//               className="shrink-0 overflow-hidden rounded-xl bg-zinc-100/80 dark:bg-zinc-800/70"
//               style={{ width: imageBoxW, aspectRatio: aspect }}
//             >
//               <img
//                 src={toSrc(item.image)}
//                 alt={item.imageAlt ?? item.brand}
//                 className={cx("h-full w-full object-center", fit)}
//                 draggable={false}
//                 loading="lazy"
//                 decoding="async"
//                 fetchPriority="low"
//               />
//             </div>
//           )}

//           {hasText && (
//             <div className="min-w-0">
//               {item.quote && (
//                 <p className="text-[13px]/6 text-zinc-700 dark:text-zinc-300 line-clamp-3">“{item.quote}”</p>
//               )}

//               {!!item.metrics?.length && (
//                 <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
//                   {item.metrics.map((m, i) => (
//                     <div key={i}>
//                       <dt className="text-[10px] text-zinc-500 dark:text-zinc-400">{m.label}</dt>
//                       <dd className="text-sm font-semibold leading-6 tracking-tight text-zinc-900 dark:text-zinc-100">
//                         {m.value}
//                       </dd>
//                     </div>
//                   ))}
//                 </dl>
//               )}

//               {(item.person || item.role) && (
//                 <div className="mt-2 text-[11px] text-zinc-600 dark:text-zinc-400">
//                   {item.person && <div className="truncate text-zinc-900 dark:text-zinc-100">{item.person}</div>}
//                   {item.role && <div className="truncate">{item.role}</div>}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </article>
//   );
// };

// /* ------------------------------ Pair column ----------------------------- */
// const PairColumn: React.FC<{
//   top: CaseItem;
//   bottom?: CaseItem;
//   pairGap: number;
//   cardWidthPx: number;
//   widthStyle: number | string;
// }> = ({ top, bottom, pairGap, cardWidthPx, widthStyle }) => {
//   return (
//     <div className="flex shrink-0 select-none flex-col" style={{ gap: pairGap }}>
//       <Card item={top} cardWidthPx={cardWidthPx} widthStyle={widthStyle} />
//       {bottom && <Card item={bottom} cardWidthPx={cardWidthPx} widthStyle={widthStyle} />}
//     </div>
//   );
// };

// /* -------------------------------- Lane ---------------------------------- */
// const Lane: React.FC<{
//   items: CaseItem[];
//   speed: number; // px/s
//   gap: number; // px between columns
//   pairGap: number; // px between the two cards in a column
//   pauseOnHover: boolean;
//   cardWidthPx: number;
//   widthStyle: number | string;
//   direction: "ltr" | "rtl";
//   edgeFade: boolean;
//   autoPauseOffscreen: boolean;
// }> = ({
//   items,
//   speed,
//   gap,
//   pairGap,
//   pauseOnHover,
//   cardWidthPx,
//   widthStyle,
//   direction,
//   edgeFade,
//   autoPauseOffscreen,
// }) => {
//   const reduced = usePrefersReducedMotion();

//   const columns = useMemo(() => chunkPairs(items), [items]);

//   const baseCols = useMemo(
//     () => (columns.length < 4 ? [...columns, ...columns, ...columns] : columns),
//     [columns]
//   );

//   const rootRef = useRef<HTMLDivElement>(null);
//   const trackRef = useRef<HTMLDivElement>(null);
//   const firstCopyRef = useRef<HTMLDivElement>(null);
//   const [copyWidth, setCopyWidth] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [focused, setFocused] = useState(false);
//   const [ready, setReady] = useState(false);
//   const [onscreen, setOnscreen] = useState(true);

//   const offsetRef = useRef(0);
//   const lastTsRef = useRef<number | null>(null);

//   useEffect(() => {
//     if (!autoPauseOffscreen || typeof IntersectionObserver === "undefined") return;
//     const node = rootRef.current;
//     if (!node) return;
//     const io = new IntersectionObserver(([entry]) => setOnscreen(entry.isIntersecting), {
//       rootMargin: "200px",
//     });
//     io.observe(node);
//     return () => io.disconnect();
//   }, [autoPauseOffscreen]);

//   useEffect(() => {
//     const measure = () => {
//       const full = firstCopyRef.current?.scrollWidth ?? 0;
//       setCopyWidth(full);
//       setReady(full > 0);
//     };
//     measure();
//     const ro = new ResizeObserver(measure);
//     if (firstCopyRef.current) ro.observe(firstCopyRef.current);
//     return () => ro.disconnect();
//   }, [baseCols.length, gap, cardWidthPx, pairGap]);

//   useAnimationFrame((ts) => {
//     if (!ready || reduced || !copyWidth || paused || focused || !onscreen) {
//       lastTsRef.current = ts;
//       return;
//     }
//     if (lastTsRef.current == null) {
//       lastTsRef.current = ts;
//       return;
//     }
//     const dt = (ts - (lastTsRef.current ?? ts)) / 1000;
//     lastTsRef.current = ts;

//     const dir = direction === "rtl" ? -1 : 1;
//     offsetRef.current += dir * speed * dt;

//     let off = offsetRef.current % copyWidth;
//     if (off < 0) off += copyWidth;
//     offsetRef.current = off;

//     if (trackRef.current) {
//       const x = direction === "rtl" ? off : -off;
//       trackRef.current.style.transform = `translate3d(${x}px,0,0)`;
//     }
//   });

//   const onEnter = () => pauseOnHover && setPaused(true);
//   const onLeave = () => pauseOnHover && setPaused(false);

//   if (reduced) {
//     return (
//       <div className="relative overflow-x-auto overflow-y-hidden" ref={rootRef}>
//         <div className="flex w-max items-stretch" style={{ gap }}>
//           {baseCols.map(([a, b], idx) => (
//             <PairColumn
//               key={`rm-${a.id}-${b?.id ?? "x"}-${idx}`}
//               top={a}
//               bottom={b}
//               pairGap={pairGap}
//               cardWidthPx={cardWidthPx}
//               widthStyle={widthStyle}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const maskCSS = edgeFade
//     ? {
//         WebkitMaskImage:
//           "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
//         maskImage:
//           "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%)",
//       } as React.CSSProperties
//     : undefined;

//   return (
//     <div
//       ref={rootRef}
//       className="relative overflow-hidden"
//       onMouseEnter={onEnter}
//       onMouseLeave={onLeave}
//       style={maskCSS}
//     >
//       {!ready && (
//         <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-zinc-200/40 to-transparent dark:via-zinc-700/30" />
//       )}

//       <motion.div
//         ref={trackRef}
//         className="flex w-max items-stretch will-change-transform"
//         role="list"
//         aria-roledescription="carousel lane"
//         aria-label="Customer stories"
//         style={{ gap, opacity: ready ? 1 : 0 }}
//       >
//         <div
//           ref={firstCopyRef}
//           className="flex w-max items-stretch"
//           style={{ gap }}
//           tabIndex={0}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           aria-label="Auto-scrolling content. Focus pauses motion."
//         >
//           {baseCols.map(([a, b], idx) => (
//             <PairColumn
//               key={`a-${a.id}-${b?.id ?? "x"}-${idx}`}
//               top={a}
//               bottom={b}
//               pairGap={pairGap}
//               cardWidthPx={cardWidthPx}
//               widthStyle={widthStyle}
//             />
//           ))}
//         </div>

//         <div className="pointer-events-none flex w-max select-none items-stretch" style={{ gap }} aria-hidden>
//           {baseCols.map(([a, b], idx) => (
//             <PairColumn
//               key={`b-${a.id}-${b?.id ?? "x"}-${idx}`}
//               top={a}
//               bottom={b}
//               pairGap={pairGap}
//               cardWidthPx={cardWidthPx}
//               widthStyle={widthStyle}
//             />
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// /* --------------------------------- Root --------------------------------- */
// export const CaseStudyCarousel: React.FC<FixedCarouselProps> = ({
//   lanes = 1,
//   speed = 70,
//   gap = 16,
//   pairGap = 10,
//   cardWidth = 300,
//   pauseOnHover = true,
//   responsiveWidth = true,
//   edgeFade = true,
//   direction: dirProp,
//   autoPauseOffscreen = true,
//   className,
// }) => {
//   const laneCount = Math.min(3, Math.max(1, lanes));

//   const [direction, setDirection] = useState<"ltr" | "rtl">(dirProp ?? "ltr");
//   useEffect(() => {
//     if (dirProp) return setDirection(dirProp);
//     if (typeof document !== "undefined") {
//       const d = (document?.dir as "ltr" | "rtl" | undefined) ?? "ltr";
//       setDirection(d);
//     }
//   }, [dirProp]);

//   const distributed = useMemo(() => {
//     const arr: CaseItem[][] = Array.from({ length: laneCount }, () => []);
//     STATIC_ITEMS.forEach((it, i) => arr[i % laneCount].push(it));
//     return arr;
//   }, [laneCount]);

//   const widthStyle: string | number = responsiveWidth
//     ? `clamp(${Math.round(cardWidth * 0.72)}px, 28vw, ${cardWidth}px)`
//     : cardWidth;

//   return (
//     <section className={["not-prose w-full", className ?? ""].join(" ")} aria-label="Customer stories carousel">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="mb-3 flex items-end justify-between gap-3">
//           <div>
//             <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
//               Customer stories
//             </h2>
//             <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
//               Compact, image-friendly pairs. Seamless loop. Constant speed. Accessible.
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-col gap-6">
//           {distributed.map((laneItems, idx) => (
//             <Lane
//               key={idx}
//               items={laneItems}
//               speed={speed * (1 + idx * 0.08)} // subtle parallax per lane
//               gap={gap}
//               pairGap={pairGap}
//               pauseOnHover={pauseOnHover}
//               cardWidthPx={cardWidth}
//               widthStyle={widthStyle}
//               direction={direction}
//               edgeFade={edgeFade}
//               autoPauseOffscreen={autoPauseOffscreen}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CaseStudyCarousel;


"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame } from "framer-motion";

/* ----------------------------- Client logos ----------------------------- */
import BYCLogo from "@/assets/Clients/BYCLogo.png";
import CILLogo from "@/assets/Clients/CILLogo.jpeg";
import GDKLogo from "@/assets/Clients/GDKLogo.jpeg";
import HyundaiLogo from "@/assets/Clients/HyundaiLogo.png";
import KorristarLogo from "@/assets/Clients/KorristarLogo.jpeg";
import MasgaLogo from "@/assets/Clients/MasagLogo.jpeg";
import MGLogo from "@/assets/Clients/MGLogo.jpeg";
import NELogo from "@/assets/Clients/NEGLogo.jpg";
import TamkeenLogo from "@/assets/Clients/TamkeenLogo.png";

/* --------------------------------- Types -------------------------------- */
export type Metric = { label: string; value: string };
export type ImageLike = string | { src: string };

export type CaseItem = {
  id: string | number;
  brand: string;
  /* Header */
  logo?: ImageLike;
  logoAlt?: string;
  nameOverride?: string;
  /* Body media (optional) */
  image?: ImageLike;
  imageAlt?: string;
  mediaAspect?: number; // e.g., 16/9 -> 1.777...
  imageFit?: "contain" | "cover"; // default contain
  /* Body text */
  quote?: string;
  person?: string;
  role?: string;
  metrics?: Metric[];
};

export type FixedCarouselProps = {
  lanes?: 1 | 2 | 3; // stacked auto-scroll lanes
  speed?: number; // pixels / second
  pauseOnHover?: boolean;
  gap?: number; // px between columns (each column = 2 cards)
  pairGap?: number; // px between two cards in the same column
  cardWidth?: number; // target card width in px (used for media sizing)
  responsiveWidth?: boolean; // clamp the visual width responsively
  edgeFade?: boolean; // fade edges to hint more content
  direction?: "ltr" | "rtl"; // reverse direction for RTL
  autoPauseOffscreen?: boolean; // auto-pause when the section is offscreen
  className?: string;
};

/* ------------------------------- Utilities ------------------------------ */
const toSrc = (img?: ImageLike) => (typeof img === "string" ? img : img?.src ?? undefined);
const cx = (...cls: Array<string | undefined | false | null>) => cls.filter(Boolean).join(" ");

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

/* ----------------------------- Fixed data set --------------------------- */
/** Real client testimonials + logos (no body images needed). */
const STATIC_ITEMS: CaseItem[] = [
  {
    id: "mansour",
    brand: "Mansour Group",
    logo: MGLogo,
    logoAlt: "Mansour Group",
    person: "Sultan Bin Ghamiah",
    role: 'Mansour Group "Lebanon" C.E.O',
    quote:
      "Argus ERP has revolutionized the way we manage our 40 stores. From inventory tracking to sales management, the software has streamlined operations, giving us better control and insights across all locations.",
  },
  {
    id: "masagh",
    brand: "Masagh",
    logo: MasgaLogo,
    logoAlt: "MASAGH",
    person: "Badr Al Amiri",
    role: 'MASAGH "KSA" C.E.O',
    quote:
      "Without SoftMachine, our company would not be the same! Save yourself a headache and go with a company that has your back!",
  },
  {
    id: "bin-yaala",
    brand: "Bin Yaala Exchange",
    logo: BYCLogo, // BYC asset used for Bin Yaala Exchange
    logoAlt: "Bin Yaala Exchange",
    person: "Khursan Bin Yaala",
    role: 'Bin Yaala Exchange "KSA" C.E.O',
    quote:
      "Argus ERP has significantly streamlined our remittance processes, allowing us to manage transactions with greater accuracy and efficiency. The customizable features have transformed our day-to-day operations",
  },
  {
    id: "neg",
    brand: "New Egypt Gold",
    logo: NELogo,
    logoAlt: "New Egypt Gold",
    person: "Tarek Tarouti",
    role: 'New Egypt Gold "Egypt" C.E.O',
    quote:
      "Words cannot adequatly express how grateful we are for what SoftMachine has done for our company and how it has helped and is still helping! Definitly recommended!",
  },
  {
    id: "cil",
    brand: "CIL",
    logo: CILLogo,
    logoAlt: "CIL",
    person: "Khalil Ghassani",
    role: 'CIL "Ivory Coast" C.E.O',
    quote:
      "SoftMachine has been assisting our company for quite some time. They are reliable, thorough, intelligent, approachable, excellent communicators, and extremely pleasant! We would recommend SoftMachine to anyone looking for a high-performing company dedicated to providing the best business solutions!",
  },
  {
    id: "hyundai",
    brand: "Hyundai",
    logo: HyundaiLogo,
    logoAlt: "HYUNDAI",
    person: "Wissam Bazzoun",
    role: 'HYUNDAI "LEBANON" C.I.O',
    quote:
      "SoftMachine has always come through when we've needed them. Not only with their product but also with their incredibly precise services that perfectly match what our businesses need.",
  },
  {
    id: "tamkeen",
    brand: "Tamkeen",
    logo: TamkeenLogo,
    logoAlt: "Tamkeen",
    person: "Yahya Tahan",
    role: 'Tamkeen "KSA"',
    quote:
      "Argus ERP is a game changer for our pipes manufacturing business. The software’s real-time insights into production, inventory, and logistics have allowed us to optimize processes and meet customer demands more effectively",
  },
  {
    id: "korristar",
    brand: "Korristar",
    logo: KorristarLogo,
    logoAlt: "Korristar",
    person: "Ali Korri",
    role: 'Korristar "Lebanon" C.E.O',
    quote:
      "SoftMachine and its team exceeded my expectations in every way, including the products, services and more!",
  },
  {
    id: "gdk",
    brand: "GDK",
    logo: GDKLogo,
    logoAlt: "GDK",
    person: "Elie Ferzli",
    role: 'GDK "Ivory Coast" C.E.O',
    quote:
      "Implementing Argus ERP was a game changer for our business. The software's seamless integration and robust reporting tools have helped us improve compliance and transparency across all operations",
  },
];

/* ------------------------------ Card UI --------------------------------- */
const Card: React.FC<{
  item: CaseItem;
  cardWidthPx: number;
  widthStyle: number | string;
}> = ({ item, cardWidthPx, widthStyle }) => {
  const fit = item.imageFit === "cover" ? "object-cover" : "object-contain";
  const aspect = item.mediaAspect ?? 16 / 9;

  const hasImage = Boolean(item.image);
  const hasText = Boolean(item.quote || item.metrics?.length || item.person || item.role);
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
      {/* Header: circular logo + brand */}
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
                <p className="text-[13px]/6 text-zinc-700 dark:text-zinc-300">“{item.quote}”</p>
              )}

              {!!item.metrics?.length && (
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  {item.metrics.map((m, i) => (
                    <div key={i}>
                      <dt className="text-[10px] text-zinc-500 dark:text-zinc-400">{m.label}</dt>
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
                    <div className="truncate text-zinc-900 dark:text-zinc-100">{item.person}</div>
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
      {bottom && <Card item={bottom} cardWidthPx={cardWidthPx} widthStyle={widthStyle} />}
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
    () => (columns.length < 4 ? [...columns, ...columns, ...columns] : columns),
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

  useEffect(() => {
    if (!autoPauseOffscreen || typeof IntersectionObserver === "undefined") return;
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setOnscreen(entry.isIntersecting), {
      rootMargin: "200px",
    });
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

    const dir = direction === "rtl" ? -1 : 1;
    offsetRef.current += dir * speed * dt;

    let off = offsetRef.current % copyWidth;
    if (off < 0) off += copyWidth;
    offsetRef.current = off;

    if (trackRef.current) {
      const x = direction === "rtl" ? off : -off;
      trackRef.current.style.transform = `translate3d(${x}px,0,0)`;
    }
  });

  const onEnter = () => pauseOnHover && setPaused(true);
  const onLeave = () => pauseOnHover && setPaused(false);

  if (reduced) {
    return (
      <div className="relative overflow-x-auto overflow-y-hidden" ref={rootRef}>
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

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={maskCSS}
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

        <div className="pointer-events-none flex w-max select-none items-stretch" style={{ gap }} aria-hidden>
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

  const distributed = useMemo(() => {
    const arr: CaseItem[][] = Array.from({ length: laneCount }, () => []);
    STATIC_ITEMS.forEach((it, i) => arr[i % laneCount].push(it));
    return arr;
  }, [laneCount]);

  const widthStyle: string | number = responsiveWidth
    ? `clamp(${Math.round(cardWidth * 0.72)}px, 28vw, ${cardWidth}px)`
    : cardWidth;

  return (
    <section className={["not-prose w-full", className ?? ""].join(" ")} aria-label="Customer stories carousel">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            What our clients say about us?
            </h2>
       
          </div>
        </div>

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
      </div>
    </section>
  );
};

export default CaseStudyCarousel;
