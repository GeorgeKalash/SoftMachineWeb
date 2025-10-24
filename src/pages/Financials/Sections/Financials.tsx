"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { GoBackButton } from "@/sharedComponent/GoBackButton";
import {
  ArrowRight,
  FileText,
  Wallet,
  Globe2,
  BarChart3,
  Percent,
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
  { src: heroImage as unknown as string, alt: "Financials overview 1" },
  { src: hero as unknown as string, alt: "Financials overview 2" },
  { src: logo as unknown as string, alt: "Brand identity" },
];

/* --------------------------------- Page --------------------------------- */

export default function FinancialsPage() {
  const items = useMemo(() => REFERENCES, []);

  // Simple cross-fade carousel (respects reduced motion)
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL.length);
    }, 3800);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  // Core Features (word-for-word)
  const featureItems: FeatureItem[] = [
    {
      title: "General Ledger & Journal Entries:",
      desc: "Keep track of every transaction and maintain a clear audit trail.",
      preview: "typing",
      icon: <FileText className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Accounts Payable & Receivable:",
      desc: "Manage supplier invoices, customer payments, and aging reports effortlessly.",
      preview: "inbox",
      icon: <Wallet className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Multi-Currency & Multi-Company Accounting:",
      desc: "Handle international operations with accurate currency conversions and consolidated reporting.",
      preview: "multicurrency",
      icon: <Globe2 className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Budgeting & Forecasting:",
      desc: "Plan and control expenses using dynamic budgets and predictive insights.",
      preview: "analytics",
      icon: <BarChart3 className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Tax Management:",
      desc: "Ensure compliance with local tax laws through automated tax computation and reporting.",
      preview: "donut",
      icon: <Percent className="h-5 w-5 text-slate-900" />,
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
                Financials (Accounting & Finance Management)
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Simplify Accounting and Strengthen Financial Decision-Making
              </p>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Argus Financials provides a unified, accurate, and compliant accounting solution that helps businesses maintain financial clarity and control. It automates complex accounting tasks, integrates with other modules, and offers real-time insights into your company’s financial performance — ensuring smarter, faster decision-making.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#features"
                  className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Explore Features <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#impact"
                  className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Business Impact
                </a>
              </div>
            </motion.div>

            {/* Visual / Carousel */}
            <motion.div variants={fadeUp} className="relative">
              <div
                className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-xl backdrop-blur"
                role="region"
                aria-roledescription="carousel"
                aria-label="Financials visuals"
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

      {/* CORE FEATURES — Reusable grid */}
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
              Core Features:
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

      {/* DARK SECTION — Business Impact */}
      <SectionSplit
        id="impact"
        navInk="light"
        tone="dark"
        title="Business Impact:"
        description="Argus Financials allows management to make informed decisions based on live financial data, helping businesses improve cash flow, reduce risks, and maintain financial stability."
        media={heroImage as unknown as string}
      />

      {/* CONTACT / CTA */}
      <div id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10">
          <div className="grid md:grid-cols-2 items-center gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                Ready to modernize your financial operations?
              </h3>
              <p className="mt-2 text-slate-600">
                We can tailor Argus Financials to your chart of accounts, approval flows, and reporting needs.
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
