"use client";

import { useEffect, useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { GoBackButton } from "@/sharedComponent/GoBackButton";
import {
  ArrowRight,
  Database,
  FileText,
  Layers,
  Wrench,
  Calculator,
  Link2,
} from "lucide-react";

// Images (reuse)
import logo from "@/assets/logo.png";
import hero from "@/assets/hero.png";
import heroImage from "@/assets/hero-image.jpg";

// Reusable components
import SectionSplit from "@/sharedComponent/SectionSplit";
import { FeatureGrid, type FeatureItem } from "@/sharedComponent/FeatureCards";

/* ---------------------------------- FX ---------------------------------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* --------------------------------- Page --------------------------------- */

export default function ManufacturingManagementPage() {
  // Simple cross-fade carousel (respects reduced motion)
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const CAROUSEL = [
    { src: heroImage as unknown as string, alt: "Manufacturing overview 1" },
    { src: hero as unknown as string, alt: "Manufacturing overview 2" },
    { src: logo as unknown as string, alt: "Brand identity" },
  ];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL.length);
    }, 3800);
    return () => clearInterval(id);
  }, [prefersReducedMotion, CAROUSEL.length]);

  // Key Features (word-for-word titles + descriptions)
  const featureItems: FeatureItem[] = [
    {
      title: "Bill of Materials (BOM):",
      desc: "Define components, quantities, and production steps for every finished product.",
      preview: "tiles",
      icon: <Database className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Production Orders:",
      desc: "Create and manage work orders with live status updates and material availability checks.",
      preview: "pipeline",
      icon: <FileText className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Material Requirement Planning (MRP):",
      desc: "Automate material demand calculations based on production forecasts and stock levels.",
      preview: "spark",
      icon: <Layers className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Work Center Management:",
      desc: "Monitor production performance, track downtime, and optimize capacity utilization.",
      preview: "gauge",
      icon: <Wrench className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Costing & Analysis:",
      desc: "Capture labor, overhead, and material costs for precise production cost reporting.",
      preview: "donut",
      icon: <Calculator className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Integration with Inventory & Purchase:",
      desc: "Ensure raw materials are always available through real-time links with stock and procurement data.",
      preview: "link",
      icon: <Link2 className="h-5 w-5 text-slate-900" />,
    },
  ];

  return (
    <section className="relative overflow-hidden z-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back */}
        <div className="mb-6">
          <GoBackButton fallbackTo="/" />
        </div>
      </div>

      {/* HERO — light section */}
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
            {/* Copy (word-for-word) */}
            <motion.div variants={fadeUp} className="relative">
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight text-slate-900">
                Manufacturing Management
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Optimize Production Efficiency and Resource Planning
              </p>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Argus Manufacturing provides a complete solution for managing production operations — from planning and scheduling to cost tracking and reporting. Whether you manage discrete or batch manufacturing, Argus ensures visibility, control, and efficiency across your shop floor.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#features"
                  className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Explore Key Features <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#why"
                  className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Why Argus?
                </a>
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
                    key={img.alt}
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

      {/* FEATURES — Reusable grid */}
      <div id="features" className="relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-10"
          >
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

      {/* DARK SECTION — Why Argus Manufacturing */}
      <SectionSplit
        id="why"
        navInk="light"
        tone="dark"
        title="Why Argus Manufacturing:"
        description="Argus connects planning, production, and inventory into one unified workflow — reducing delays, minimizing waste, and boosting overall production efficiency."
        mediaItems={[
          { src: heroImage as unknown as string, alt: "Production planning" },
          { src: hero as unknown as string, alt: "Shop floor tracking" },
        ]}
        bullets={[
          "reducing delays",
          "minimizing waste",
          "boosting overall production efficiency."
        ]}      />

      {/* CONTACT / CTA (generic) */}
      <div id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10">
          <div className="grid md:grid-cols-2 items-center gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                Ready to optimize production?
              </h3>
              <p className="mt-2 text-slate-600">
                We can tailor Argus Manufacturing to your BOMs, routing, and costing requirements.
              </p>
            </div>
            <div className="flex md:justify-end gap-3">
              <a
                href="/#demo"
                className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Schedule a Demo
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
