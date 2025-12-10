"use client";

import React, { useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useNavigate } from "react-router-dom";
import SharedButton from "@/sharedComponent/Button";
import siteData from "@/SiteData/SiteData.json";
import useEmblaCarousel from "embla-carousel-react";

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

/* ------------------------------------------------------------------ */
/*                             LOGO MAP                               */
/* ------------------------------------------------------------------ */

type LogoAsset = string | { src: string };

const LOGOS: Record<string, LogoAsset> = {
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

const resolveLogoSrc = (key?: string): string | undefined => {
  if (!key) return undefined;
  const value = LOGOS[key];
  if (!value) return undefined;
  return typeof value === "string" ? value : value.src;
};

/* ------------------------------------------------------------------ */
/*                         CAROUSEL (SLIDER)                          */
/* ------------------------------------------------------------------ */

function Carousel<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (t: T, idx: number) => React.ReactNode;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      {/* viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* track */}
        <div className="flex gap-6">
          {items.map((t, i) => (
            <div
              key={i}
              className={cn(
                "shrink-0 grow-0",
                // responsive “slides per view”
                "basis-[88%] sm:basis-[60%] md:basis-[48%] lg:basis-[32%]"
              )}
              data-slide
            >
              {renderItem(t, i)}
            </div>
          ))}
        </div>
      </div>

      {/* arrows */}
      <button
        type="button"
        aria-label="Previous"
        onClick={scrollPrev}
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
        onClick={scrollNext}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10",
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur",
          "shadow-sm hover:bg-muted transition"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                        TESTIMONIAL CARD                            */
/* ------------------------------------------------------------------ */

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
      <p className="mb-8 text-base leading-relaxed text-foreground/90">
        “{quote}”
      </p>

      <div className="mt-auto flex items-center gap-4 border-t border-border/70 pt-6">
        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-border/60 grid place-items-center">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={company || name}
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
              loading="lazy"
            />
          ) : (
            <div className="text-xs text-muted-foreground">Logo</div>
          )}
        </div>
        <div>
          <div className="font-semibold tracking-tight">{name}</div>
          <div className="text-sm text-muted-foreground">
            {role ? `${role} · ` : ""}
            {company}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*                           DATA TYPES                               */
/* ------------------------------------------------------------------ */

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

type SelectedTestimonial = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  logoSrc?: string;
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

/* ------------------------------------------------------------------ */
/*                        MAIN SECTION COMPONENT                      */
/* ------------------------------------------------------------------ */

const TestimonialsTeaserCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  // Prefer new unified clients data; fallback to legacy testimonials if needed
  const cData = siteData.clients as ClientsData | undefined;
  const legacyT = siteData.testimonials as ClientsData | undefined;

  const items = cData?.items ?? [];
  const teaser = cData?.teaser ?? legacyT?.teaser;

  const selected: SelectedTestimonial[] = useMemo(() => {
    if (!items.length) return [];

    const byId = (id: string) => items.find((x) => x.id === id);
    const ids: string[] = Array.isArray(teaser?.teaserIds)
      ? (teaser?.teaserIds as string[])
      : [];

    const pool = (ids.length ? ids.map(byId).filter(Boolean) : items).filter(
      (t): t is ClientsItem => !!t && !!t.testimonial
    );

    const chosen = pickRandom(pool, 5);

    return chosen.map((t) => ({
      quote: t.testimonial!.content,
      name: t.testimonial!.name,
      role: t.testimonial!.role,
      company: [t.company, t.locations?.[0]].filter(Boolean).join(" — "),
      logoSrc: resolveLogoSrc(t.logoKey),
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
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          {badge && (
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {badge}
            </div>
          )}
          {title && (
            <h2 className="text-4xl font-bold lg:text-5xl">{title}</h2>
          )}
          {subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* carousel */}
        <Carousel
          items={selected}
          renderItem={(p, i) => (
            <TestimonialCard
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
            <SharedButton
              title={viewAllCta}
              onClick={() => navigate(viewAllHref)}
              color="primary"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsTeaserCarousel;
