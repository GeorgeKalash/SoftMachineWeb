"use client";

import * as React from "react";
import { motion } from "framer-motion";
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

import heroImage from "@/assets/hero-image.jpg";

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

const CLIENTS: ClientRef[] = [
  { company: "Mansour Group", person: "Sultan Bin Ghamiah", title: 'CEO, "Lebanon"', country: "Lebanon", quote: "Argus ERP has revolutionized the way we manage our 40 stores. From inventory to sales, it streamlined operations and visibility." },
  { company: "MASAGH", person: "Badr Al Amiri", title: 'CEO, "KSA"', country: "KSA", quote: "Save yourself a headache and go with a company that has your back." },
  { company: "Bin Yaala Exchange", person: "Khursan Bin Yaala", title: 'CEO, "KSA"', country: "KSA", quote: "Remittance processes are now accurate, fast, and fully traceable." },
  { company: "New Egypt Gold", person: "Tarek Tarouti", title: 'CEO, "Egypt"', country: "Egypt", quote: "Grateful for the continuous, practical value SoftMachine delivers." },
  { company: "CIL", person: "Khalil Ghassani", title: 'CEO, "Ivory Coast"', country: "Ivory Coast", quote: "Reliable, thorough, excellent communicators—highly recommended." },
  { company: "HYUNDAI", person: "Wissam Bazzoun", title: 'CIO, "Lebanon"', country: "Lebanon", quote: "They consistently deliver the exact solution our businesses need." },
  { company: "Tamkeen", person: "Yahya Tahan", title: '—, "KSA"', country: "KSA", quote: "Real-time production, inventory, and logistics insights—game changer." },
  { company: "Korristar", person: "Ali Korri", title: 'CEO, "Lebanon"', country: "Lebanon", quote: "Products, services, and support exceeded expectations." },
  { company: "GDK", person: "Elie Ferzli", title: 'CEO, "Ivory Coast"', country: "Ivory Coast", quote: "Seamless integration and robust reporting improved compliance." },
];

/* ---------------------------- Map derivations --------------------------- */
type CityMarker = {
  name: string;
  coordinates: [number, number]; // [lon, lat]
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

const HIGHLIGHTED_COUNTRIES = clientCountriesIso3(CLIENTS);
const CITY_MARKERS = toMapCities(CLIENTS);
const ARCS = CITY_MARKERS
  .filter((c) => c.name !== "Beirut")
  .map((c) => ({ from: CITY_BY_COUNTRY.Lebanon.coordinates, to: c.coordinates }));

/* -------- Center/zoom tuned to dots (not fully zoomed-out world) -------- */
function computeCenter(markers: CityMarker[]): [number, number] {
  const lonAvg = markers.reduce((s, m) => s + m.coordinates[0], 0) / markers.length;
  const latAvg = markers.reduce((s, m) => s + m.coordinates[1], 0) / markers.length;
  return [lonAvg, latAvg];
}
const DEFAULT_CENTER: [number, number] = computeCenter(CITY_MARKERS);
const DEFAULT_ZOOM = 1.85;

/* -------------------------------- Props -------------------------------- */
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

/* --------------------------- Tooltip utilities -------------------------- */
type TooltipState = { x: number; y: number; name: string } | null;

function toLocalCoords(
  e: { clientX: number; clientY: number },
  container: HTMLElement
): { x: number; y: number } {
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
        onKeyDown={(e: React.KeyboardEvent<SVGGElement>) => {
          if (e.key === "Enter") onClick?.(city);
        }}
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

/* ----------------------------- Spotlight Panel -------------------------- */
function CitySpotlight({ active }: { active: CityMarker }) {
  const country = CITY_TO_COUNTRY[active.name] as CountryName | undefined;
  const cityClients = CLIENTS.filter((c) => (country ? c.country === country : false));
  const primaryQuote = cityClients[0]?.quote ?? "We deliver measurable results for every client.";
  const brands = cityClients.map((c) => c.company).slice(0, 4);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Header media */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img src={heroImage} alt="Client success" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-foreground backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
            {active.name} • {country ?? "—"} • {active.count} client{active.count > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{active.name} spotlight</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{primaryQuote}</p>

        {brands.length > 0 && (
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Notable brands</div>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-auto grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-xl font-semibold text-foreground">{CLIENTS.length}</div>
            <div className="text-[11px] text-muted-foreground">Total Clients</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="text-xl font-semibold text-foreground">
              {new Set(CLIENTS.map((c) => c.country)).size}
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

/* ------------------------------- Component ------------------------------- */
export default function ClientsWorldwideSection({
  title = "Our Clients Worldwide",
  subtitle = "Hover to spotlight; click highlighted countries or markers to explore.",
  highlightedCountries = HIGHLIGHTED_COUNTRIES,
  cities = CITY_MARKERS,
  arcs = ARCS,
  onCountryClick,
  onCityClick,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
}: Props) {
  const [tooltip, setTooltip] = React.useState<TooltipState>(null);
  const [activeCity, setActiveCity] = React.useState<CityMarker>(cities[0]);
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

      <div className="container mx-auto mb-8 px-4">
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
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-[minmax(0,420px),1fr]">
        <CitySpotlight active={activeCity} />

        <div
          ref={mapRef}
          className="relative w-full overflow-hidden rounded-2xl border border-border shadow-sm"
          style={{
            height: "clamp(380px, 58vw, 560px)",
            background: `radial-gradient(1100px 600px at 20% 10%, ${COLORS.oceanTo} 0%, transparent 45%),
                         linear-gradient(180deg, ${COLORS.oceanFrom}, ${COLORS.oceanTo})`,
          }}
          onMouseLeave={() => setTooltip(null)}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="h-full w-full">
            <ComposableMap projectionConfig={{ scale: 160 }} style={{ width: "100%", height: "100%" }}>
              {/* Focused view (not fully zoomed out) */}
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
                            onMouseMove={(e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
                              if (!mapRef.current || !name) return;
                              const { x, y } = toLocalCoords(e, mapRef.current);
                              setTooltip({ x: x + 12, y: y + 12, name });
                            }}
                            onMouseEnter={(e: React.MouseEvent<SVGPathElement, MouseEvent>) => {
                              if (!mapRef.current || !name) return;
                              const { x, y } = toLocalCoords(e, mapRef.current);
                              setTooltip({ x: x + 12, y: y + 12, name });
                            }}
                            onMouseLeave={() => setTooltip(null)}
                            onFocus={(e: React.FocusEvent<SVGPathElement>) => {
                              if (!mapRef.current || !name) return;
                              const rect = e.currentTarget.getBoundingClientRect();
                              const containerRect = mapRef.current.getBoundingClientRect();
                              const x = rect.left - containerRect.left + rect.width / 2;
                              const y = rect.top - containerRect.top + rect.height / 2;
                              setTooltip({ x, y, name });
                            }}
                            onBlur={() => setTooltip(null)}
                            onClick={() => active && onCountryClick?.(iso3!, name ?? iso3!)}
                            onKeyDown={(e: React.KeyboardEvent<SVGPathElement>) => {
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

                      {/* Keep arcs/markers only (no new map elements) */}
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

          {/* Tooltip (theme tokens) */}
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
    </section>
  );
}

/* ----------------------------- Testimonials ----------------------------- */
export type TestimonialItem = {
  id: string;
  brand: string;
  person: string;
  role?: string;
  country: string;
  quote: string;
};

export const TESTIMONIALS: TestimonialItem[] = CLIENTS.map((c, i) => ({
  id: `${c.company}-${i}`,
  brand: c.company,
  person: c.person,
  role: c.title,
  country: c.country,
  quote: c.quote,
}));
