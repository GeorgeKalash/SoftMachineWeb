// src/sections/ClientsWorldwideSection.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Graticule,
  Sphere,
  Line,
} from "react-simple-maps";
import siteData from "@/data.json";
import heroImage from "@/assets/hero-image.jpg";

/* ---------------------------- Logos Registry ---------------------------- */
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

/* -------------------------------- Theme -------------------------------- */
const COLORS = {
  oceanFrom: "#0b1220",
  oceanTo: "#141e30",
  land: "hsl(220 15% 16%)",
  landStroke: "hsl(220 12% 24%)",
  hover: "hsl(210 10% 35%)",
  highlight: "hsl(200 85% 58%)",
  highlightMuted: "hsl(200 90% 40% / 0.55)",
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/* -------------------------------- Data --------------------------------- */
type CountryName = "Lebanon" | "KSA" | "Egypt" | "Ivory Coast";

export type ClientRef = {
  company: string;
  person: string;
  title?: string;
  country: CountryName;
  city?: string;
  quote: string;
  logoSrc?: string;
};

type ClientsJSONItem = {
  company: string;
  locations?: string[];
  testimonial?: { name: string; role?: string; content: string };
  logoKey?: string;
};

type ClientsJSON = {
  items?: ClientsJSONItem[];
};

const asCountryName = (s?: string): CountryName | undefined => {
  if (!s) return undefined;
  if (s === "Lebanon" || s === "KSA" || s === "Egypt" || s === "Ivory Coast") return s;
  return undefined;
};

const RAW_CLIENTS: ClientRef[] = ((siteData?.clients as unknown as ClientsJSON)?.items ?? [])
  .map((c) => {
    const country = asCountryName(c.locations?.[0]);
    const t = c.testimonial;
    if (!country || !t) return null;
    return {
      company: c.company,
      person: t.name,
      title: t.role,
      country,
      quote: t.content,
      logoSrc: c.logoKey ? LOGOS[c.logoKey] : undefined,
    } satisfies ClientRef;
  })
  .filter(Boolean) as ClientRef[];

/* ---------------------------- Map derivations --------------------------- */
type CityMarker = {
  name: string;
  coordinates: [number, number];
  count: number;
  pulse?: boolean;
  kind?: "hub" | "client";
};

const CITY_BY_COUNTRY: Record<CountryName, { name: string; coordinates: [number, number] }> = {
  Lebanon: { name: "Beirut", coordinates: [35.5018, 33.8938] },
  KSA: { name: "Riyadh", coordinates: [46.6753, 24.7136] },
  Egypt: { name: "Cairo", coordinates: [31.2357, 30.0444] },
  "Ivory Coast": { name: "Abidjan", coordinates: [-4.0083, 5.35996] },
};

const CITY_TO_COUNTRY = Object.fromEntries(
  Object.entries(CITY_BY_COUNTRY).map(([country, v]) => [v.name, country as CountryName])
);

const ISO3_BY_COUNTRY: Record<CountryName, string> = {
  Lebanon: "LBN",
  KSA: "SAU",
  Egypt: "EGY",
  "Ivory Coast": "CIV",
};

function toMapCities(clients: ClientRef[]): CityMarker[] {
  const buckets = new Map<string, CityMarker>();
  for (const c of clients) {
    const base = CITY_BY_COUNTRY[c.country];
    const key = (c.city ?? base.name) + "|" + c.country;
    if (!buckets.has(key)) {
      buckets.set(key, {
        name: c.city ?? base.name,
        coordinates: base.coordinates,
        count: 0,
        pulse: true,
      });
    }
    buckets.get(key)!.count += 1;
  }
  const arr = Array.from(buckets.values());
  for (const m of arr) if (m.name.toLowerCase() === "beirut") m.kind = "hub";
  arr.sort((a, b) => (a.kind === "hub" ? -1 : b.kind === "hub" ? 1 : b.count - a.count));
  return arr;
}

function clientCountriesIso3(clients: ClientRef[]): string[] {
  return Array.from(new Set(clients.map((c) => ISO3_BY_COUNTRY[c.country])));
}

const CITY_MARKERS = toMapCities(RAW_CLIENTS);
const HIGHLIGHTED_COUNTRIES = clientCountriesIso3(RAW_CLIENTS);
const ARCS =
  CITY_MARKERS.length > 0
    ? CITY_MARKERS.filter((c) => c.name !== "Beirut").map((c) => ({
        from: CITY_BY_COUNTRY.Lebanon.coordinates,
        to: c.coordinates,
      }))
    : [];

/* -------- Center/zoom tuned to dots (not fully zoomed-out world) -------- */
function computeCenter(markers: CityMarker[]): [number, number] {
  if (!markers.length) return [20, 20];
  const lonAvg = markers.reduce((s, m) => s + m.coordinates[0], 0) / markers.length;
  const latAvg = markers.reduce((s, m) => s + m.coordinates[1], 0) / markers.length;
  return [lonAvg, latAvg];
}
const DEFAULT_CENTER: [number, number] = computeCenter(CITY_MARKERS);
const DEFAULT_ZOOM = 1.85;

/* --------------------------- Tooltip utilities -------------------------- */
type TooltipState = { x: number; y: number; name: string } | null;
function toLocalCoords(e: { clientX: number; clientY: number }, container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

/* ------------------------------ MarkerBadge ----------------------------- */
function MarkerBadge({ city, onClick }: { city: CityMarker; onClick?: (c: CityMarker) => void }) {
  const isHub = city.kind === "hub";
  const pulse = city.pulse ?? true;

  return (
    <Marker coordinates={city.coordinates}>
      <g
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(city)}
        onKeyDown={(e: React.KeyboardEvent<SVGGElement>) => e.key === "Enter" && onClick?.(city)}
        style={{ cursor: "pointer" }}
      >
        {pulse && (
          <motion.circle
            r={isHub ? 10 : 8}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.7, 1.25, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            fill="none"
            stroke="hsl(var(--foreground))"
            style={{ opacity: 0.35 }}
            strokeWidth={isHub ? 1.6 : 1.2}
          />
        )}
        <motion.circle
          r={isHub ? 3.6 : 3}
          initial={{ scale: 0.92 }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 0.15 }}
          fill={COLORS.highlight}
          style={{ filter: "drop-shadow(0 0 6px rgba(56,189,248,0.65))" }}
        />
      </g>
    </Marker>
  );
}

/* ------------------------- Single-slide Logo Slider --------------------- */
function SingleLogoSlider({
  logos,
  autoPlayMs = 3500,
}: {
  logos: string[];
  autoPlayMs?: number;
}) {
  const [idx, setIdx] = React.useState(0);
  const [dir, setDir] = React.useState<1 | -1>(1);
  const count = logos.length;

  React.useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      setDir(1);
      setIdx((p) => (p + 1) % count);
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [count, autoPlayMs]);

  const goPrev = () => {
    if (count <= 1) return;
    setDir(-1);
    setIdx((p) => (p - 1 + count) % count);
  };
  const goNext = () => {
    if (count <= 1) return;
    setDir(1);
    setIdx((p) => (p + 1) % count);
  };

  if (!count) return null;

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent pointer-events-none" />
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={idx}
          className="absolute inset-0 grid place-items-center p-6 md:p-8"
          custom={dir}
          initial={{ x: dir === 1 ? 40 : -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: dir === 1 ? -40 : 40, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-6 md:p-10 shadow-sm">
            <img
              src={logos[idx]}
              alt="Client logo"
              className="h-24 w-[48vw] max-w-xl md:h-28 md:w-[42vw] object-contain"
              loading="lazy"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <button
            aria-label="Previous logo"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur text-foreground/80 hover:bg-muted"
          >
            ‹
          </button>
          <button
            aria-label="Next logo"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur text-foreground/80 hover:bg-muted"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {logos.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-foreground/80" : "w-2 bg-foreground/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------- Spotlight Panel -------------------------- */
const CITY_TO_COUNTRY_SAFE = CITY_TO_COUNTRY as Record<string, CountryName>;

function CitySpotlight({ active }: { active: CityMarker }) {
  const country = CITY_TO_COUNTRY_SAFE[active.name];
  const cityClients = React.useMemo(
    () => RAW_CLIENTS.filter((c) => (country ? c.country === country : false)),
    [country]
  );

  const primaryQuote = cityClients[0]?.quote ?? "We deliver measurable results for every client.";

  const logos = React.useMemo(
    () => Array.from(new Set(cityClients.map((c) => c.logoSrc).filter(Boolean) as string[])),
    [cityClients]
  );

  const brands = React.useMemo(
    () => Array.from(new Set(cityClients.map((c) => c.company))).slice(0, 6),
    [cityClients]
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Wider, hero-like header; single logo per slide */}
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        {logos.length ? (
          <SingleLogoSlider logos={logos} />
        ) : (
          <img src={heroImage} alt="Client success" className="h-full w-full object-cover" loading="lazy" />
        )}

        <div className="pointer-events-none absolute bottom-3 left-3 right-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-foreground backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
            {active.name} • {country ?? "—"} • {active.count} client{active.count > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{active.name} spotlight</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{primaryQuote}</p>

        {brands.length > 0 && (
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Notable brands</div>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <span key={b} className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-auto grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-xl font-semibold text-foreground">{RAW_CLIENTS.length}</div>
            <div className="text-[11px] text-muted-foreground">Total Clients</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-xl font-semibold text-foreground">
              {new Set(RAW_CLIENTS.map((c) => c.country)).size}
            </div>
            <div className="text-[11px] text-muted-foreground">Countries</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-xl font-semibold text-foreground">
              {CITY_MARKERS.reduce((s, m) => s + m.count, 0)}
            </div>
            <div className="text-[11px] text-muted-foreground">Deployments</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Main --------------------------------- */
type Props = {
  title?: string;
  subtitle?: string;
  highlightedCountries?: string[];
  cities?: CityMarker[];
  arcs?: { from: [number, number]; to: [number, number] }[];
  onCountryClick?: (iso3: string, name: string) => void;
  onCityClick?: (city: CityMarker) => void;
  center?: [number, number];
  zoom?: number;
};

export default function ClientsWorldwideSection({
  title = "Our Clients Worldwide",
  subtitle = "Click a city marker to see its clients; highlighted countries are active.",
  highlightedCountries = HIGHLIGHTED_COUNTRIES,
  cities = CITY_MARKERS,
  arcs = ARCS,
  onCountryClick,
  onCityClick,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
}: Props) {
  const [tooltip, setTooltip] = React.useState<TooltipState>(null);
  const [activeCity, setActiveCity] = React.useState<CityMarker>(
    cities[0] ?? { name: "Beirut", coordinates: CITY_BY_COUNTRY.Lebanon.coordinates, count: 0, kind: "hub" }
  );
  const mapRef = React.useRef<HTMLDivElement>(null);

  const isHighlighted = React.useCallback(
    (iso3?: string) => (iso3 ? highlightedCountries.includes(iso3) : false),
    [highlightedCountries]
  );

  const handleCityClick = (c: CityMarker) => {
    setActiveCity(c);
    onCityClick?.(c);
  };

  return (
    <section id="worldwide" className="scroll-mt-24 py-16">
      <style>{`
        .geo { transition: transform 200ms ease, fill 200ms ease; transform-box: fill-box; transform-origin: center; }
        .geo:hover { transform: scale(1.06); }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        .arc { stroke-dasharray: 3 6; stroke-dashoffset: 120; animation: dash 6s linear infinite; }
      `}</style>

      {/* Wider container: make the whole section breathe more */}
      <div className="mx-auto mb-8 w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Spotlight (left) + Map (right) */}
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,640px),1fr] lg:grid-cols-[minmax(0,720px),1fr]">
          <CitySpotlight active={activeCity} />

          <div
            ref={mapRef}
            className="relative w-full overflow-hidden rounded-2xl border border-border shadow-sm"
            style={{
              height: "clamp(420px, 58vw, 600px)",
              background: `radial-gradient(1100px 600px at 20% 10%, ${COLORS.oceanTo} 0%, transparent 45%),
                           linear-gradient(180deg, ${COLORS.oceanFrom}, ${COLORS.oceanTo})`,
            }}
            onMouseLeave={() => setTooltip(null)}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="h-full w-full">
              <ComposableMap projectionConfig={{ scale: 160 }} style={{ width: "100%", height: "100%" }}>
                <ZoomableGroup center={center} zoom={zoom} minZoom={1.4} maxZoom={5}>
                  <Sphere stroke="rgba(255,255,255,0.06)" fill="transparent" strokeWidth={0.6} />
                  <Graticule stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />

                  <Geographies geography={geoUrl}>
                    {({ geographies }) => (
                      <>
                        {geographies.map((geo) => {
                          const iso3 = geo.properties?.ISO_A3 as string | undefined;
                          const name = geo.properties?.NAME as string | undefined;
                          const active = isHighlighted(iso3);

                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              className="geo"
                              aria-label={name ?? "Country"}
                              tabIndex={0}
                              onMouseMove={(e) => {
                                if (!mapRef.current || !name) return;
                                const { x, y } = toLocalCoords(e, mapRef.current);
                                setTooltip({ x: x + 12, y: y + 12, name });
                              }}
                              onMouseEnter={(e) => {
                                if (!mapRef.current || !name) return;
                                const { x, y } = toLocalCoords(e, mapRef.current);
                                setTooltip({ x: x + 12, y: y + 12, name });
                              }}
                              onMouseLeave={() => setTooltip(null)}
                              onFocus={(e) => {
                                if (!mapRef.current || !name) return;
                                const rect = e.currentTarget.getBoundingClientRect();
                                const containerRect = mapRef.current.getBoundingClientRect();
                                const x = rect.left - containerRect.left + rect.width / 2;
                                const y = rect.top - containerRect.top + rect.height / 2;
                                setTooltip({ x, y, name });
                              }}
                              onBlur={() => setTooltip(null)}
                              onClick={() => active && onCountryClick?.(iso3!, name ?? iso3!)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && active) onCountryClick?.(iso3!, name ?? iso3!);
                              }}
                              style={{
                                default: {
                                  fill: active ? COLORS.highlightMuted : COLORS.land,
                                  outline: "none",
                                  stroke: COLORS.landStroke,
                                  strokeWidth: 0.6,
                                },
                                hover: {
                                  fill: active ? "hsl(200 85% 58%)" : COLORS.hover,
                                  outline: "none",
                                  cursor: active ? "pointer" : "default",
                                },
                                pressed: {
                                  fill: active ? "hsl(200 85% 58%)" : COLORS.hover,
                                  outline: "none",
                                },
                              }}
                            />
                          );
                        })}

                        {arcs.map((a, i) => (
                          <Line
                            key={`arc-${i}`}
                            from={a.from}
                            to={a.to}
                            className="arc"
                            stroke="hsl(200 85% 58%)"
                            strokeWidth={1.2}
                            strokeOpacity={0.55}
                            fill="none"
                          />
                        ))}

                        {cities.map((city, i) => (
                          <MarkerBadge key={`${city.name}-${i}`} city={city} onClick={(c) => {
                            setActiveCity(c);
                            onCityClick?.(c);
                          }} />
                        ))}
                      </>
                    )}
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </motion.div>

            {tooltip && (
              <div
                className="pointer-events-none absolute z-10 rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground backdrop-blur"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                {tooltip.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
