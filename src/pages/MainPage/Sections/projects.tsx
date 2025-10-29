// src/pages/Projects.tsx
"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import siteData from "@/SiteData/SiteData.json";

// fallback/thumbnail helpers (keep images in code)
import heroFallback from "@/assets/hero.png";

// client logos (also usable as thumbnails if no project image is found)
import MGLogo from "@/assets/Clients/MGLogo.jpeg";
import MasagLogo from "@/assets/Clients/MasagLogo.jpeg";
import BYCLogo from "@/assets/Clients/BYCLogo.png";
import NEGLogo from "@/assets/Clients/NEGLogo.jpg";
import CILLogo from "@/assets/Clients/CILLogo.jpeg";
import HyundaiLogo from "@/assets/Clients/HyundaiLogo.png";
import TamkeenLogo from "@/assets/Clients/TamkeenLogo.png";
import KorristarLogo from "@/assets/Clients/KorristarLogo.jpeg";
import GDKLogo from "@/assets/Clients/GDKLogo.jpeg";

/* -------------------------------- Mappings ------------------------------- */
/** Map JSON `logoKey` → imported asset */
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

/** Optionally map JSON `imgKey` → dedicated project thumbnail if you add them later.
 *  Falls back to LOGOS[key] or to heroFallback.
 */
const PROJECT_IMAGES: Partial<Record<string, string>> = {
  // e.g. "mansour": MansourThumb,  // when you add a dedicated image import
};

function getProjectImage(imgKey?: string, logoKey?: string) {
  return (
    (imgKey && PROJECT_IMAGES[imgKey]) ||
    (logoKey && LOGOS[logoKey]) ||
    heroFallback
  );
}

/* ------------------------------ Masonry-ish ------------------------------ */
function hashToUnit(seed: string) {
  // simple deterministic hash -> [0,1)
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  const u = (h >>> 0) / 4294967295;
  return u;
}

function pickRowSpan(id: string): 1 | 2 | 3 {
  const u = hashToUnit(id);
  if (u < 0.18) return 3;
  if (u < 0.55) return 2;
  return 1;
}

/* --------------------------------- Types -------------------------------- */
type Category = { key: string; label: string };
type ProjectItem = {
  id: string;
  title: string;
  subtitle: string;
  href?: string;
  categories: string[];
  sector: "finance" | "manufacturing" | "auto_retail";
  imgKey?: string;
  logoKey?: string;
};

type ProjectsData = {
  header?: { title?: string; subtitle?: string };
  categories: Category[];
  sectorLabels?: Record<string, string>;
  items: ProjectItem[];
};

const ProjectsPage: React.FC = () => {
  const projectsData: ProjectsData = siteData.projects as ProjectsData;
  const categories = projectsData?.categories ?? [
    { key: "all", label: "All" },
  ];

  const [active, setActive] = useState<string>(categories[0]?.key ?? "all");

  const filtered = useMemo(() => {
    const items = projectsData?.items ?? [];
    if (active === "all") return items;
    return items.filter((p) => p.categories?.includes(active));
  }, [active, projectsData]);

  return (
    <section className="relative isolate py-20">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-32 w-[80%] rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {projectsData?.header?.title ?? "Our Latest Projects"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {projectsData?.header?.subtitle ??
              "Real work across finance, manufacturing, automotive, and retail."}
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-1.5 text-sm transition",
                "border-border bg-muted/40 hover:bg-muted",
                active === cat.key &&
                  "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className={cn(
            "mt-10 grid gap-6",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            "auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px]"
          )}
        >
          {filtered.map((p, idx) => {
            const rowSpan = pickRowSpan(p.id);
            const imgSrc = getProjectImage(p.imgKey, p.logoKey);

            return (
              <motion.a
                key={p.id}
                href={p.href || "#"}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border bg-card",
                  "shadow-sm ring-1 ring-black/5"
                )}
                style={{
                  gridRow: `span ${rowSpan} / span ${rowSpan}`,
                }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                  delay: Math.min(idx * 0.03, 0.25),
                }}
              >
                {/* image */}
                <img
                  src={imgSrc}
                  alt={p.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />

                {/* hover overlay */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 flex items-center justify-center",
                    "bg-background/0 backdrop-blur-0 opacity-0 transition duration-400",
                    "group-hover:pointer-events-auto group-hover:bg-background/30 group-hover:backdrop-blur-[3px] group-hover:opacity-100"
                  )}
                >
                  <div className="translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-center">
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.subtitle}</p>
                    <div className="mt-3 flex justify-center">
                      <Button size="sm" variant="secondary" className="gap-1">
                        View Project
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
