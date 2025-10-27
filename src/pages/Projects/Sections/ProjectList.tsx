// src/pages/ProjectList.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Sparkles } from "lucide-react";
import siteData from "@/data.json";
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
type Testimonial = { name: string; role: string; content: string; image: string };
type ProjectItem = {
  id: string;
  sector: SectorKey;
  logoKey?: string;
  testimonial?: { name: string; role: string; content: string };
};

type ProjectsJSON = {
  sectorLabels?: Record<SectorKey, string>;
  items: ProjectItem[];
};

/* ------------------------------- card ui ------------------------------- */
function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
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
          <div className="text-sm text-muted-foreground">{t.role}</div>
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
  defaultTab?: "all" | SectorKey;
  initialCount?: number;
};

export default function ProjectList({
  id,
  variant = "teaser",
  defaultTab = "all",
  initialCount = 6,
}: ProjectListProps) {
  const { ref: blockRef, isVisible } = useScrollAnimation();

  // read once from JSON (no casting to any)
  const proj: ProjectsJSON | undefined = siteData?.projects as unknown as ProjectsJSON;

  // labels for tabs
  const sectorLabels: Record<SectorKey, string> = {
    finance: proj?.sectorLabels?.finance ?? "Finance & Services",
    manufacturing: proj?.sectorLabels?.manufacturing ?? "Manufacturing & Industry",
    auto_retail: proj?.sectorLabels?.auto_retail ?? "Automotive & Retail",
  };

  // build testimonial arrays by sector dynamically from JSON
  const allItems: ProjectItem[] = proj?.items ?? [];

  const toTestimonial = (p: ProjectItem): Testimonial | null => {
    const t = p.testimonial;
    if (!t) return null;
    const img = (p.logoKey && LOGOS[p.logoKey]) || "";
    return { name: t.name, role: t.role, content: t.content, image: img };
    // images stay in code; JSON only passes the logoKey
  };

  const lists = {
    all: allItems.map(toTestimonial).filter(Boolean) as Testimonial[],
    finance: allItems.filter((i) => i.sector === "finance").map(toTestimonial).filter(Boolean) as Testimonial[],
    manufacturing: allItems.filter((i) => i.sector === "manufacturing").map(toTestimonial).filter(Boolean) as Testimonial[],
    auto_retail: allItems.filter((i) => i.sector === "auto_retail").map(toTestimonial).filter(Boolean) as Testimonial[],
  };

  const tabs = useMemo(
    () => [
      { key: "all" as const, label: "All", data: lists.all },
      { key: "finance" as const, label: sectorLabels.finance, data: lists.finance },
      { key: "manufacturing" as const, label: sectorLabels.manufacturing, data: lists.manufacturing },
      { key: "auto_retail" as const, label: sectorLabels.auto_retail, data: lists.auto_retail },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [proj] // recompute if JSON changes at runtime (hot reload)
  );

  const [counts] = useState<Record<string, number>>(
    Object.fromEntries(
      tabs.map((t) => [
        t.key,
        variant === "full" || t.key === "all" ? t.data.length : Math.min(initialCount, t.data.length),
      ])
    )
  );

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
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Trusted by leading teams
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects & Testimonials
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Real feedback from finance, manufacturing, automotive, and retail partners.
            </p>
          </div>

          <Tabs defaultValue={defaultTab}>
            <div className="sticky top-0 z-10 -mx-4 mb-6 bg-background/70 px-4 py-3 backdrop-blur sm:static sm:bg-transparent sm:px-0 sm:py-0">
              <TabsList className="grid w-full grid-cols-4 overflow-auto sm:inline-flex sm:justify-center">
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
              const visible = counts[tab.key] ?? tab.data.length;
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
