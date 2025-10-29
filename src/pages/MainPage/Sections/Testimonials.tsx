// src/sections/TestimonialsTeaserCarousel.tsx
"use client";

import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useNavigate } from "react-router-dom";
import SharedButton from "@/sharedComponent/Button";
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

/* ---------------- carousel utils ---------------- */
function useCarousel() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
    const child = el.querySelector<HTMLElement>("[data-slide]");
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "24");
    const step = child ? child.offsetWidth + gap : el.clientWidth * 0.9;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };
  return { ref, scrollBy };
}

function Carousel<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (t: T, idx: number) => React.ReactNode;
}) {
  const { ref, scrollBy } = useCarousel();
  return (
    <div className="relative">
      <div
        ref={ref}
        className={cn("flex snap-x snap-mandatory overflow-x-auto pb-2", "gap-6 scroll-pl-4 pr-4 pl-4", "no-scrollbar")}
        onWheel={(e) => {
          const el = ref.current;
          if (!el) return;
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
          el.scrollLeft += e.deltaY;
        }}
      >
        {items.map((t, i) => (
          <div key={i} data-slide className={cn("snap-start shrink-0", "w-[88%] sm:w-[60%] md:w-[48%] lg:w-[32%]")}>
            {renderItem(t, i)}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollBy("prev")}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10",
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur",
          "shadow-sm hover:bg-muted transition"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollBy("next")}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10",
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur",
          "shadow-sm hover:bg-muted transition"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <style>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

/* ---------------- card ---------------- */
function TestimonialCard({
  quote,
  name,
  role,
  company,
  logoSrc,
  index,
}: {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  logoSrc?: string;
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <Card
      ref={ref}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-background/70 to-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/40",
        "p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
      )}
      style={{
        transform: isVisible ? "translateY(0px)" : "translateY(10px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${Math.min(index, 6) * 40}ms`,
      }}
    >
      <p className="mb-8 text-base leading-relaxed text-foreground/90">“{quote}”</p>

      <div className="mt-auto flex items-center gap-4 border-t border-border/70 pt-6">
        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-border/60 grid place-items-center">
          {logoSrc ? (
            <img src={logoSrc} alt={company || name} className="h-16 w-16 sm:h-20 sm:w-20 object-contain" loading="lazy" />
          ) : (
            <div className="text-xs text-muted-foreground">Logo</div>
          )}
        </div>
        <div>
          <div className="font-semibold tracking-tight">{name}</div>
          <div className="text-sm text-muted-foreground">
            {role ? `${role} · ` : ""}{company}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- page/section ---------------- */
type ClientsItem = {
  id: string;
  company: string;
  locations?: string[];
  logoKey?: string;
  testimonial?: { name: string; role?: string; content: string };
};

type ClientsData = {
  teaser?: {
    badgeLabel?: string;
    title?: string;
    subtitle?: string;
    teaserIds?: string[];
    viewAllCta?: string;
    viewAllHref?: string;
  };
  items?: ClientsItem[];
};

/** Fisher–Yates shuffle + take N */
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

const TestimonialsTeaserCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  // Prefer new unified clients data; fallback to legacy testimonials if needed
  const cData = siteData.clients as ClientsData | undefined;
  const legacyT = siteData.testimonials;

  const items = cData?.items ?? [];
  const teaser = cData?.teaser ?? legacyT?.teaser;

  // --- RANDOM 5 each visit/mount ---
  const selected = useMemo(() => {
    if (!items.length) return [];

    const byId = (id: string) => items.find((x) => x.id === id);
    const ids: string[] = Array.isArray(teaser?.teaserIds) ? (teaser?.teaserIds as string[]) : [];

    const pool = (ids.length ? ids.map(byId).filter(Boolean) : items)
      .filter((t): t is ClientsItem => !!t && !!t.testimonial);

    // pick 5 random from pool on each mount (stable until deps change)
    const chosen = pickRandom(pool, 5);

    return chosen.map((t) => ({
      quote: t.testimonial!.content,
      name: t.testimonial!.name,
      role: t.testimonial!.role,
      company: [t.company, t.locations?.[0]].filter(Boolean).join(" — "),
      logoSrc: (t.logoKey && LOGOS[t.logoKey]) || undefined,
    }));
  }, [items, teaser]);

  const badge = teaser?.badgeLabel;
  const title = teaser?.title;
  const subtitle = teaser?.subtitle;
  const viewAllCta = teaser?.viewAllCta;
  const viewAllHref = teaser?.viewAllHref || "/clients";

  return (
    <section className="bg-muted/30 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div
          ref={headerRef}
          className={cn(
            "mb-12 text-center transition-all duration-700",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {badge && (
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {badge}
            </div>
          )}
          {title && <h2 className="text-4xl font-bold lg:text-5xl">{title}</h2>}
          {subtitle && <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        {/* carousel */}
        <Carousel
          items={selected}
          renderItem={(p, i) => (
            <TestimonialCard
              key={`${p.name}-${i}`}
              quote={p.quote}
              name={p.name}
              role={p.role}
              company={p.company}
              logoSrc={p.logoSrc}
              index={i}
            />
          )}
        />

        {/* view all */}
        {viewAllCta && (
          <div className="mt-10 text-center">
            <SharedButton title={viewAllCta} onClick={() => navigate(viewAllHref)} color="primary" />
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsTeaserCarousel;
