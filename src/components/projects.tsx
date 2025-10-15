
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Grab any images in /assets (jpg/png/jpeg/webp)
const allImages = Object.values(
  import.meta.glob("@/assets/*.{jpg,png,jpeg,webp}", { eager: true, as: "url" })
) as string[];

// simple stable PRNG so layout is deterministic
const prand = (seed: number) => {
  let t = seed + 1;
  return () => {
    t ^= t << 13;
    t ^= t >> 17;
    t ^= t << 5;
    return ((t >>> 0) % 1000) / 1000; // [0,1)
  };
};

type Project = {
  id: string;
  title: string;
  subtitle: string;
  href?: string;
  img: string;
  // Tailwind row-span for a “masonry-ish” look
  rowSpan?: 1 | 2 | 3;
};

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "branding", label: "Branding Strategy" },
  { key: "digital", label: "Digital Experiences" },
  { key: "ecom", label: "Ecommerce" },
] as const;
type CategoryKey = typeof CATEGORIES[number]["key"];

const buildProjects = (seedNum = 2025): Record<CategoryKey, Project[]> => {
  const rnd = prand(seedNum);
  const pick = (i: number) => allImages[i % Math.max(allImages.length, 1)] ?? "";

  // make a base pool first
  const base: Project[] = Array.from({ length: 6 }).map((_, i) => ({
    id: `p-${i}`,
    title:
      i % 4 === 0
        ? "Photo Retouching"
        : i % 4 === 1
        ? "Minimal Product Shot"
        : i % 4 === 2
        ? "Editorial Layout"
        : "Concept Branding",
    subtitle:
      i % 3 === 0 ? "Branded Ecommerce" : i % 3 === 1 ? "Creative Direction" : "UI/UX",
    href: "#",
    img: pick(i),
    rowSpan: (rnd() < 0.18 ? 3 : rnd() < 0.5 ? 2 : 1) as 1 | 2 | 3,
  }));

  // distribute to categories (overlap allowed)
  return {
    all: base,
    branding: base.filter((_, i) => i % 3 !== 1),
    digital: base.filter((_, i) => i % 3 !== 2),
    ecom: base.filter((_, i) => i % 3 !== 0),
  };
};

const Projects: React.FC = () => {
  const [active, setActive] = useState<CategoryKey>("all");
  const data = useMemo(() => buildProjects(), []);
  const projects = data[active];

  return (
    <section className="relative isolate py-20">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-32 w-[80%] rounded-full bg-primary/5 blur-3xl" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Latest Projects</h2>
          <p className="mt-3 text-muted-foreground">
            It is a long established fact that a reader will be distracted by the readable content
            of a page when looking at its layout.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
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
            // three columns on lg, two on md, one on mobile
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            // fake masonry via dense flow + row sizing
            "auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px]"
          )}
        >
          {projects.map((p, idx) => (
            <motion.a
              key={p.id}
              href={p.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card",
                "shadow-sm ring-1 ring-black/5"
              )}
              style={{
                gridRow: `span ${p.rowSpan ?? 1} / span ${p.rowSpan ?? 1}`,
              }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: Math.min(idx * 0.03, 0.25) }}
            >
              {/* image */}
              <img
                src={p.img}
                alt={p.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />

              {/* hover overlay -> blurred & pressable */}
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
