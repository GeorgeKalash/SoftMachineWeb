// src/pages/ManufacturingManagementPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { GoBackButton } from "@/sharedComponent/GoBackButton";
import { ArrowRight, Database, FileText, Layers, Wrench, Calculator, Link2 } from "lucide-react";

// Images kept in code
import logo from "@/assets/logo.png";
import hero from "@/assets/hero.png";
import heroImage from "@/assets/hero-image.jpg";

// Reusable components
import SectionSplit from "@/sharedComponent/SectionSplit";
import { FeatureGrid, type FeatureItem } from "@/sharedComponent/FeatureCards";

import siteData from "@/data.json";

/* ---------------------------------- FX ---------------------------------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };

/* ----------------------------- Runtime maps ----------------------------- */
const IMG: Record<string, string> = {
  logo: logo as unknown as string,
  hero: hero as unknown as string,
  heroImage: heroImage as unknown as string,
};

const ICONS_NODE: Record<string, React.ReactNode> = {
  database: <Database className="h-5 w-5 text-slate-900" />,
  fileText: <FileText className="h-5 w-5 text-slate-900" />,
  layers: <Layers className="h-5 w-5 text-slate-900" />,
  wrench: <Wrench className="h-5 w-5 text-slate-900" />,
  calculator: <Calculator className="h-5 w-5 text-slate-900" />,
  link2: <Link2 className="h-5 w-5 text-slate-900" />,
};

/** Allowed previews your FeatureGrid supports */
const PREVIEWS = ["tiles", "pipeline", "spark", "gauge", "donut", "link"] as const;
type PreviewKey = (typeof PREVIEWS)[number];
const isPreview = (x: unknown): x is PreviewKey =>
  typeof x === "string" && (PREVIEWS as readonly string[]).includes(x);

/* --------------------------------- Page --------------------------------- */
export default function ManufacturingManagementPage() {
  const data = siteData.manufacturing;

  // Hero copy
  const heroTitle = data?.hero?.title ?? "Manufacturing Management";
  const heroSubtitle = data?.hero?.subtitle ?? "Optimize Production Efficiency and Resource Planning";
  const heroBody =
    data?.hero?.body ??
    "Argus Manufacturing provides a complete solution for managing production operations — from planning and scheduling to cost tracking and reporting.";
  const heroPrimary = data?.hero?.primaryCta;
  const heroSecondary = data?.hero?.secondaryCta;

  // Carousel from JSON → imported images
  const CAROUSEL = useMemo(
    () =>
      (data?.carousel ?? []).map((c: { imageKey?: string; alt?: string }) => ({
        src: (c?.imageKey && IMG[c.imageKey]) || IMG.heroImage,
        alt: c?.alt ?? "",
      })),
    [data?.carousel]
  );

  // Cross-fade carousel (respect reduced motion)
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion || CAROUSEL.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % CAROUSEL.length), 3800);
    return () => clearInterval(id);
  }, [prefersReducedMotion, CAROUSEL.length]);

  // Features (JSON → FeatureGrid items)
  type JSONFeature = { title: string; desc: string; preview?: unknown; iconKey?: string };
  const featureItems = useMemo<FeatureItem[]>(() => {
    const src = (data?.features ?? []) as JSONFeature[];
    return src.map((f) => {
      const preview = isPreview(f.preview) ? f.preview : "tiles";
      const icon = (f.iconKey && (ICONS_NODE[f.iconKey] ?? ICONS_NODE.database)) || ICONS_NODE.database;
      return { title: f.title, desc: f.desc, preview, icon: icon as FeatureItem["icon"] };
    });
  }, [data?.features]);

  // Why section
  const whyTitle = data?.why?.title ?? "Why Argus Manufacturing:";
  const whyDesc =
    data?.why?.description ??
    "Argus connects planning, production, and inventory into one unified workflow.";
  const whyBullets: string[] = Array.isArray(data?.why?.bullets) ? data!.why!.bullets : [];
  const whyMediaItems =
    Array.isArray(data?.why?.mediaItems)
      ? data!.why!.mediaItems.map((m: { imageKey?: string; alt?: string }) => ({
          src: (m?.imageKey && IMG[m.imageKey]) || IMG.heroImage,
          alt: m?.alt ?? "",
        }))
      : undefined;

  // CTA
  const ctaTitle = data?.cta?.title ?? "Ready to optimize production?";
  const ctaBody =
    data?.cta?.body ?? "We can tailor Argus Manufacturing to your BOMs, routing, and costing requirements.";
  const ctaPrimary = data?.cta?.primary ?? { label: "Schedule a Demo", href: "/#demo" };
  const ctaSecondary = data?.cta?.secondary ?? { label: "Contact Sales", href: "/#contact" };

  return (
    <section className="relative overflow-hidden z-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <GoBackButton fallbackTo="/" />
        </div>
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,.15),transparent_60%)]"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          >
            {/* Copy */}
            <motion.div variants={fadeUp} className="relative">
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight text-slate-900">{heroTitle}</h1>
              <p className="mt-4 text-lg text-slate-600">{heroSubtitle}</p>
              <p className="mt-3 text-slate-600 leading-relaxed">{heroBody}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {heroPrimary?.href && (
                  <a
                    href={heroPrimary.href}
                    className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition"
                    aria-label={heroPrimary.label}
                  >
                    {heroPrimary.label} <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                )}
                {heroSecondary?.href && (
                  <a
                    href={heroSecondary.href}
                    className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 transition"
                    aria-label={heroSecondary.label}
                  >
                    {heroSecondary.label}
                  </a>
                )}
              </div>
            </motion.div>

            {/* Visual / Carousel */}
            <motion.div variants={fadeUp} className="relative">
              <div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-xl backdrop-blur"
                role="region"
                aria-roledescription="carousel"
                aria-label="Manufacturing visuals"
              >
                {CAROUSEL.map((img, i) => (
                  <motion.img
                    key={`${img.src}-${i}`}
                    src={img.src}
                    alt={index === i ? img.alt : ""}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: index === i ? 1 : 0, scale: index === i ? 1 : 1.02 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    style={{ willChange: "opacity, transform" }}
                    loading={i === 0 ? "eager" : "lazy"}
                    aria-hidden={index !== i}
                  />
                ))}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {CAROUSEL.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-2 w-2 rounded-full transition ${i === index ? "bg-slate-900" : "bg-slate-300"}`}
                      aria-label={`Slide ${i + 1}`}
                      aria-current={i === index}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="space-y-10">
            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-semibold text-slate-900">
              Key Features:
            </motion.h2>

            <FeatureGrid
              items={featureItems}
              ambient
              ease={EASE}
              containerVariants={container}
              childVariants={fadeUp}
              inViewOnce
              inViewAmount={0.2}
              enableTilt
            />
          </motion.div>
        </div>
      </div>

      {/* WHY (dark) */}
      <SectionSplit
        id="why"
        navInk="light"
        tone="dark"
        title={whyTitle}
        description={whyDesc}
        bullets={whyBullets}
        mediaItems={whyMediaItems}
      />

      {/* CONTACT / CTA */}
      <div id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10">
          <div className="grid md:grid-cols-2 items-center gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900">{data?.cta?.title ?? ctaTitle}</h3>
              <p className="mt-2 text-slate-600">{data?.cta?.body ?? ctaBody}</p>
            </div>
            <div className="flex md:justify-end gap-3">
              <a
                href={data?.cta?.primary?.href ?? ctaPrimary.href}
                className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                {data?.cta?.primary?.label ?? ctaPrimary.label}
              </a>
              <a
                href={data?.cta?.secondary?.href ?? ctaSecondary.href}
                className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                {data?.cta?.secondary?.label ?? ctaSecondary.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
