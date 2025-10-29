// src/pages/ProjectList.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Sparkles } from "lucide-react";
import siteData from "@/SiteData/SiteData.json";
import { GoBackButton } from "@/sharedComponent/GoBackButton";
import ClientsWorldwideSection from "@/sharedComponent/WorldPresenceMap";

// logo imports kept in code (JSON only stores keys)
import MGLogo from "@/assets/Clients/MGLogo.jpeg";
import MasagLogo from "@/assets/Clients/MasagLogo.jpeg";
import BYCLogo from "@/assets/Clients/BYCLogo.png";
import NEGLogo from "@/assets/Clients/NEGLogo.jpg";
import CILLogo from "@/assets/Clients/CILLogo.jpeg";
import HyundaiLogo from "@/assets/Clients/HyundaiLogo.png";
import TamkeenLogo from "@/assets/Clients/TamkeenLogo.png";
import KorristarLogo from "@/assets/Clients/KorristarLogo.jpeg";
import GDKLogo from "@/assets/Clients/GDKLogo.jpeg";

/* --------------------------- logo key → src --------------------------- */
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

/* -------------------------------- types -------------------------------- */
type SectorKey = "finance" | "manufacturing" | "auto_retail";
type TabKey = "all" | SectorKey;

type ClientTestimonial = { name: string; role?: string; content: string };
type ClientItem = {
  id: string;
  sector: SectorKey;
  logoKey?: string;
  testimonial?: ClientTestimonial;
};

type ClientsJSON = {
  sectorLabels?: Partial<Record<SectorKey, string>>;
  items?: ClientItem[];
};

/* -------------------------- type guards/helpers ------------------------- */
function isSectorKey(v: string): v is SectorKey {
  return v === "finance" || v === "manufacturing" || v === "auto_retail";
}
function isTabKey(v: string): v is TabKey {
  return v === "all" || isSectorKey(v);
}

/* ------------------------------- card ui ------------------------------- */
type TestimonialCardModel = { name: string; role?: string; content: string; image: string };

function TestimonialCard({ t, index }: { t: TestimonialCardModel; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <Card
      ref={ref}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border/60",
        "bg-gradient-to-b from-background/70 to-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/40",
        "p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
      )}
      style={{
        transform: isVisible ? "translateY(0px)" : "translateY(10px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${Math.min(index, 6) * 40}ms`,
      }}
    >
      <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <p className="mb-8 text-base leading-relaxed text-foreground/90 line-clamp-4">“{t.content}”</p>

      <div className="mt-auto flex items-center gap-4 border-t border-border/70 pt-6">
        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-border/60 grid place-items-center">
          <img
            src={t.image}
            alt={t.name}
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
            loading="lazy"
          />
        </div>

        <div>
          <div className="font-semibold tracking-tight">{t.name}</div>
          {t.role ? <div className="text-sm text-muted-foreground">{t.role}</div> : null}
        </div>
      </div>

      <Sparkles className="absolute right-4 top-4 h-4 w-4 text-accent/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Card>
  );
}

/* ------------------------------ main cmp ------------------------------ */
type ProjectListProps = {
  id?: string;
  variant?: "teaser" | "full";
  defaultTab?: TabKey;
  initialCount?: number;
};

export default function ProjectList({
  id,
  variant = "teaser",
  defaultTab = "all",
  initialCount = 6,
}: ProjectListProps) {
  const { ref: blockRef, isVisible } = useScrollAnimation();

  // unified clients
  const clientsData: ClientsJSON = (siteData?.clients as ClientsJSON) ?? {};
  const allClients: ClientItem[] = clientsData.items ?? [];

  // labels for tabs with fallbacks
  const sectorLabels: Record<SectorKey, string> = {
    finance: clientsData.sectorLabels?.finance ?? "Finance",
    manufacturing: clientsData.sectorLabels?.manufacturing ?? "Manufacturing",
    auto_retail: clientsData.sectorLabels?.auto_retail ?? "Auto Retail",
  };

  // map client → testimonial card model (skip if no testimonial)
  const toTestimonial = (c: ClientItem): TestimonialCardModel | null => {
    const t = c.testimonial;
    if (!t) return null;
    const img = (c.logoKey && LOGOS[c.logoKey]) || "";
    return {
      name: t.name,
      role: t.role,
      content: t.content,
      image: img,
    };
  };

  const lists = useMemo(() => {
    const all = allClients.map(toTestimonial).filter(Boolean) as TestimonialCardModel[];
    const finance = allClients.filter((i) => i.sector === "finance").map(toTestimonial).filter(Boolean) as TestimonialCardModel[];
    const manufacturing = allClients.filter((i) => i.sector === "manufacturing").map(toTestimonial).filter(Boolean) as TestimonialCardModel[];
    const auto_retail = allClients.filter((i) => i.sector === "auto_retail").map(toTestimonial).filter(Boolean) as TestimonialCardModel[];
    return { all, finance, manufacturing, auto_retail };
  }, [allClients]);

  const tabs: Array<{ key: TabKey; label: string; data: TestimonialCardModel[] }> = useMemo(
    () => [
      { key: "all", label: "All", data: lists.all },
      { key: "finance", label: sectorLabels.finance, data: lists.finance },
      { key: "manufacturing", label: sectorLabels.manufacturing, data: lists.manufacturing },
      { key: "auto_retail", label: sectorLabels.auto_retail, data: lists.auto_retail },
    ],
    [lists, sectorLabels.finance, sectorLabels.manufacturing, sectorLabels.auto_retail]
  );

  const counts = useMemo(() => {
    const initial: Record<TabKey, number> = {
      all: 0,
      finance: 0,
      manufacturing: 0,
      auto_retail: 0,
    };
    return tabs.reduce<Record<TabKey, number>>((acc, t) => {
      const v = variant === "full" || t.key === "all" ? t.data.length : Math.min(initialCount, t.data.length);
      acc[t.key] = v;
      return acc;
    }, initial);
  }, [tabs, variant, initialCount]);

  // controlled value so mobile dropdown + desktop tabs stay in sync
  const [tabValue, setTabValue] = useState<TabKey>(defaultTab);

  const handleTabChange = (value: string) => {
    if (isTabKey(value)) setTabValue(value);
  };
  const handleSelectChange = (value: string) => {
    if (isSectorKey(value)) setTabValue(value);
  };

  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-24",
        "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_60%)]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_31px,rgba(120,119,198,0.08)_32px),linear-gradient(to_bottom,transparent_0,transparent_31px,rgba(120,119,198,0.08)_32px)] bg-[length:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_80%)]" />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <GoBackButton fallbackTo="/" />
        </div>

        <div
          ref={blockRef}
          className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
        >
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects
            </h2>
          </div>

          <Tabs value={tabValue} onValueChange={handleTabChange}>
          {/* Mobile: All chip + dropdown */}
<div className="sm:hidden -mx-4 mb-4 px-4">
  <div className="flex items-center gap-2">
    <button
      type="button"
      aria-label="Show all projects"
      data-active={tabValue === "all"}
      onClick={() => setTabValue("all")}
      className={cn(
        "px-3 py-2 rounded-md border text-sm",
        "data-[active=true]:bg-accent/15 data-[active=true]:text-foreground"
      )}
    >
      All
    </button>

    <Select
      /* Remount to clear selection when switching to All */
      key={tabValue === "all" ? "reset" : tabValue}
      /* When All is active, show placeholder (no value) */
      value={isSectorKey(tabValue) ? tabValue : undefined}
      onValueChange={handleSelectChange}
    >
      <SelectTrigger className="w-full" aria-label="Filter">
        {/* <- shows "Filter" when All is selected */}
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        {tabs
          .filter((t) => t.key !== "all")
          .map((t) => (
            <SelectItem key={t.key} value={t.key}>
              {t.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  </div>
</div>


            {/* Desktop: horizontal tabs */}
            <div className="hidden sm:block sticky top-0 z-20 -mx-4 mb-6 bg-background/70 px-4 py-3 backdrop-blur">
              <TabsList className="inline-flex max-w-full overflow-x-auto whitespace-nowrap gap-2">
                {tabs.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.key}
                    className="data-[state=active]:bg-accent/15 data-[state=active]:text-foreground"
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map((tab) => {
              const visible = counts[tab.key];
              return (
                <TabsContent key={tab.key} value={tab.key} className="animate-in fade-in-50">
                  <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tab.data.slice(0, visible).map((t, i) => (
                      <TestimonialCard key={`${t.name}-${i}`} t={t} index={i} />
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>

      <ClientsWorldwideSection />
    </section>
  );
}
