"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { GoBackButton } from "@/sharedComponent/GoBackButton";
import {
  CheckCircle2,
  Calculator,
  Database,
  Wrench,
  Layers,
  Link2,
  FileText,
  ArrowRight,
} from "lucide-react";

// Images (reuse as requested)
import logo from "@/assets/logo.png";
import hero from "@/assets/hero.png";
import heroImage from "@/assets/hero-image.jpg";

// ✅ Use the reusable grid (not the card)
import { FeatureGrid, type FeatureItem } from "@/sharedComponent/FeatureCards";
import SectionSplit from "@/sharedComponent/SectionSplit";

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

/* ------------------------------- Types/Data ------------------------------ */
type ReferenceItem = {
  logo: string;
  name: string;
  industry: string;
  sector: string;
  description: string;
};

type CarouselItem = {
  src: string;
  alt: string;
};

const REFERENCES: ReferenceItem[] = [
  {
    logo: (logo as unknown as string),
    name: "SoftMachine",
    industry: "Software",
    sector: "ERP",
    description: "Trusted ERP partner with 30+ years of experience.",
  },
];

const CAROUSEL: CarouselItem[] = [
  { src: heroImage as unknown as string, alt: "Sales overview" },
  { src: hero as unknown as string, alt: "Argus platform visual" },
  { src: logo as unknown as string, alt: "Brand identity" },
];

/* --------------------------------- Page --------------------------------- */

export default function ReferencesPage() {
  const items = useMemo(() => REFERENCES, []);

  // Simple cross-fade carousel with reduced-motion respect
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL.length);
    }, 3800);
    return () => clearInterval(id);
  }, [prefersReducedMotion, paused]);

  // Sales features → previews (word-for-word content)
const featureItems: FeatureItem[] = [
  {
    title: "Quotation & Order Management",
    desc: "Create professional quotations in seconds, manage approvals, and convert them directly into sales orders without duplication.",
    preview: "quote2order",
    icon: <FileText className="h-5 w-5 text-slate-900" />,
  },
  {
    title: "Price Lists & Discount Rules",
    desc: "Set up flexible pricing strategies, volume discounts, and customer-specific rates to stay competitive.",
    preview: "pricing",
    icon: <Calculator className="h-5 w-5 text-slate-900" />,
  },
  {
    title: "Sales Workflow Automation",
    desc: "Standardize your sales cycle with predefined steps, approval limits, and document generation to minimize manual errors.",
    preview: "pipeline",
    icon: <Layers className="h-5 w-5 text-slate-900" />,
  },
  {
    title: "Customer Database",
    desc: "Maintain detailed customer profiles, including contact details, payment terms, and transaction history — all in one place.",
    preview: "crm",
    icon: <Database className="h-5 w-5 text-slate-900" />,
  },
  {
    title: "Invoice Integration",
    desc: "Automatically generate invoices from confirmed sales orders, ensuring accurate billing and faster payments.",
    preview: "invoice",
    icon: <Link2 className="h-5 w-5 text-slate-900" />,
  },
  {
    title: "Reporting & Analytics",
    desc: "Access real-time sales data, product performance insights, and profitability reports to support data-driven decision-making.",
    preview: "analytics",
    icon: <FileText className="h-5 w-5 text-slate-900" />,
  },
  {
    title: "Multi-Currency & Multi-Branch Support",
    desc: "Manage sales operations across branches or countries with unified control and accurate reporting.",
    preview: "multicurrency", // or "branches" if you prefer that visual
    icon: <Layers className="h-5 w-5 text-slate-900" />,
  },
];


  return (
    <section className="relative">
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
            {/* Copy */}
            <motion.div variants={fadeUp} className="relative">
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight text-slate-900">
                Sales Order Processing
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Streamline Your Sales Cycle and Empower Your Team
              </p>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Argus Sales Management helps businesses automate and control their entire sales process — from quotation to invoice — in one seamless platform. Designed for efficiency, it enables sales teams to respond faster to customer requests, improve order accuracy, and enhance overall sales performance.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#features"
                  className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Explore Capabilities <ArrowRight className="ml-2 h-4 w-4" />
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
                aria-label="Product visuals"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {CAROUSEL.map((img, i) => (
                  <motion.img
                    key={img.alt}
                    src={img.src}
                    alt={index === i ? img.alt : ""}
                    aria-hidden={index !== i}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: index === i ? 1 : 0, scale: index === i ? 1 : 1.02 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    style={{ willChange: "opacity, transform" }}
                  />
                ))}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {CAROUSEL.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-2 w-2 rounded-full transition ${
                        i === index ? "bg-slate-900" : "bg-slate-300"
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* FEATURES — Reusable grid with built-in hover ambient sweep */}
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
              Key Features
            </motion.h2>

            <FeatureGrid
              items={featureItems}
              ambient
              ease={EASE}
              containerVariants={container}
              childVariants={fadeUp}
              inViewOnce
              inViewAmount={0.2}
            />
          </motion.div>
        </div>
      </div>

      {/* DARK SECTION — Why Argus */}


      <SectionSplit
  id="why"
  navInk="light"
  tone="dark"
  title="Why Argus Fixed Asset Management"
  description="By centralizing all asset data, Argus helps finance and operations teams save time, stay compliant, and make data-driven asset management decisions."
  bullets={[
    "Single source of truth for every asset",
    "Automatic, compliant depreciation postings",
    "Stronger audit readiness with clean reporting",
    "Lower downtime via planned maintenance",
    "Seamless handoff to Argus Financials",
  ]}
  ctas={[{ label: "Talk to an Expert", href: "#contact" }]}

  /* 👇 two images = carousel */
  mediaItems={[
    {
      src: heroImage as unknown as string,
      alt: "Product visual 1",
      caption: <>Centralized fixed-asset register.</>,
    },
    {
      src: hero as unknown as string,
      alt: "Product visual 2",
      caption: <>Automated depreciation & audit-ready reports.</>,
    },
  ]}
  
/>


      {/* CONTACT / CTA */}
      <div id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10">
          <div className="grid md:grid-cols-2 items-center gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                Ready to streamline your sales cycle?
              </h3>
              <p className="mt-2 text-slate-600">
                We can tailor Argus Sales Management to your workflows, approvals, and reporting needs.
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
