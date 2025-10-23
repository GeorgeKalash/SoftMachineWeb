"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
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
import CaseStudyCarousel, { type CaseItem } from "@/sharedComponent/slider";


const CASE_STUDIES: CaseItem[] = [
  {
    id: "zenni",
    brand: "Zenni Optical",
    quote: "Embraces data-driven personalization and the results couldn't be more clear.",
    metrics: [
      { value: "16%", label: "Surge in retention" },
      { value: "2x",  label: "Increase in revenue" },
    ],
  },
  {
    id: "taptap",
    brand: "Taptap Send",
    quote: "Simple to use with the possibility of scaling campaigns.",
    person: "Traci Trang",
    role: "CRM Specialist, Taptap Send",
  },
  {
    id: "bitcoin",
    brand: "Bitcoin.com",
    quote: "Turned messaging into a growth lever—engaging and launching seamlessly.",
    metrics: [
      { value: "+15%", label: "Avg. daily transaction attempts" },
      { value: "+11%", label: "Avg. daily completed transactions" },
    ],
  },
  {
    id: "tag",
    brand: "TAG Heuer",
    quote: "Great service quality and ease of use—highly recommended.",
    person: "Carlos Costa",
    role: "Product Group Director, TAG Heuer",
  },
  {
    id: "beachbum",
    brand: "Beach Bum Games",
    quote: "Re-engaged players and boosted retention portfolio-wide.",
    metrics: [
      { value: "+250%", label: "Click-through rates" },
      { value: "+140%", label: "Paid user reactivation" },
    ],
  },
  {
    id: "rapchat",
    brand: "Rapchat",
    quote: "A game-changer—really good notifications set up.",
    person: "Seth Miller",
    role: "CEO, Rapchat",
  },
  {
    id: "betmate",
    brand: "Betmate",
    quote: "Right message at every step from onboarding to re-engagement.",
    metrics: [
      { value: "+600%", label: "MAU (unique, paying users)" },
      { value: "+625%", label: "User spend / month" },
    ],
  },
  {
    id: "cashea",
    brand: "Cashea",
    quote: "Straightforward even with limited experience—easy to build strategy.",
    person: "Marco Rosales",
    role: "Growth & Performance Lead, Cashea",
  },
];


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
  { src: heroImage as unknown as string, alt: "Assets overview" },
  { src: hero as unknown as string, alt: "Argus platform visual" },
  { src: logo as unknown as string, alt: "Brand identity" },
];

/* --------------------------------- Page --------------------------------- */

export default function ReferencesPage() {
  const items = useMemo(() => REFERENCES, []);

  // Simple cross-fade carousel
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  // Build feature items for the reusable grid
  const featureItems: FeatureItem[] = [
    {
      title: "Asset Register",
      desc: "Maintain a complete database of all company assets with purchase details, serial numbers, and assigned locations.",
      preview: "cards",
      icon: <Database className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Depreciation Management",
      desc: "Automatically calculate depreciation using customizable methods and schedules.",
      preview: "timeline",
      icon: <Calculator className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Asset Lifecycle Tracking",
      desc: "Track each asset’s journey — from acquisition, maintenance, and transfer to final disposal.",
      preview: "bubbles",
      icon: <Layers className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Integration with Financials",
      desc: "Seamlessly link with Argus Financials for automatic journal entries, ensuring accounting accuracy.",
      preview: "link",
      icon: <Link2 className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Maintenance Scheduling",
      desc: "Plan preventive maintenance to extend asset life and minimize downtime.",
      preview: "gear",
      icon: <Wrench className="h-5 w-5 text-slate-900" />,
    },
    {
      title: "Reporting & Audit Support",
      desc: "Generate detailed asset valuation and depreciation reports to simplify audits and compliance.",
      preview: "scroll",
      icon: <FileText className="h-5 w-5 text-slate-900" />,
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
                Fixed Asset Management
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Track, Control, and Optimize Your Assets with Confidence
              </p>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Argus Fixed Asset Management enables businesses to maintain full visibility and control over their
                tangible assets — from acquisition to depreciation and disposal. The system automates every step of
                asset tracking and accounting, helping you reduce manual errors, improve compliance, and make smarter
                financial decisions.
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
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-xl backdrop-blur">
                {CAROUSEL.map((img, i) => (
                  <motion.img
                    key={img.alt}
                    src={img.src}
                    alt={img.alt}
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
      <div id="why" className="relative bg-black py-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:20px_20px]"
        />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">Why Argus Fixed Asset Management</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                By centralizing all asset data, Argus helps finance and operations teams save time, stay compliant,
                and make data-driven asset management decisions.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  "Single source of truth for every asset",
                  "Automatic, compliant depreciation postings",
                  "Stronger audit readiness with clean reporting",
                  "Lower downtime via planned maintenance",
                  "Seamless handoff to Argus Financials",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-400" />
                    <span className="text-slate-200">{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium bg-white text-black hover:bg-slate-100 transition"
                >
                  Talk to an Expert <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl">
                <motion.img
                  src={heroImage as unknown as string}
                  alt="Why Argus"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ scale: 1.02 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: EASE }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CONTACT / CTA */}
      <div id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10">
          <div className="grid md:grid-cols-2 items-center gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                Ready to simplify asset control & reporting?
              </h3>
              <p className="mt-2 text-slate-600">
                We can tailor Argus Fixed Asset Management to your workflows, chart of accounts, and reporting needs.
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
      </div>åç
      <div id="results" className="py-16">
  <CaseStudyCarousel
    items={CASE_STUDIES}
    lanes={3}
    speed={70}
    pauseOnHover
    className="bg-transparent"
  />
</div>
    </section>
  );
}
