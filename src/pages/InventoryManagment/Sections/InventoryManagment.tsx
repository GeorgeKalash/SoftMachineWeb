"use client";

import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { GoBackButton } from "@/sharedComponent/GoBackButton";

// Reuse your easing/variants
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

type ReferenceItem = {
  logo: string;         // url or import path
  name: string;
  industry: string;
  sector: string;
  description: string;
};

const REFERENCES: ReferenceItem[] = [
  {
    logo: "/logos/aabak-al-sahraa.png", 
    name: "Aabak Al Sahraa",
    industry: "Retail",
    sector: "Perfume and Fragrances",
    description:
      "Aabak Al Sahraa, a distinguished perfume manufacturer and trader in the UAE, specializes in traditional Arabic perfumes and Bakhoor. Despite their reputable standing, they faced significant operational inefficiencies due to fragmented sales, purchasing, and inventory systems. Seeking an ERP solution to manage these challenges, Aabak Al Sahraa partnered with Azkatech, an Odoo Gold Partner. Azkatech implemented a comprehensive Odoo ERP system tailored to their needs, developing an e-commerce website, automating sales and purchase procedures, and maintaining accurate financial records. This integration streamlined operations, enhanced efficiency, and enabled seamless management from a single platform—fostering business growth.",
  },
  {
    logo: "/logos/abp-contractors.png",
    name: "ABP Contractors",
    industry: "Construction & Distribution",
    sector: "Porcelain Trading and Aluminum Manufacturing",
    description:
      "Established in 2006 in Riyadh, Saudi Arabia, ABP Contractors is a leading mega-scope contracting corporation operating across the construction and contracting spectrum—covering interior and exterior designs, steel structural works, and cladding and finishes for various building types. Alongside, Louna Metal specializes in aluminum manufacturing and porcelain distribution for B2B and B2C clients. Previously relying on a local accounting system and Excel, they struggled with disjointed operations across Accounting, HR, Stock Management, Production, and CRM. Partnering with Azkatech, an Odoo Gold Partner, they implemented a unified Odoo ERP solution integrating these critical functions into a single platform—delivering accurate reporting, improved departmental collaboration, and the ability to operate efficiently and scale their business effectively.",
  },
];

export default function ReferencesPage() {
  // if you want to tweak order or filter later:
  const items = useMemo(() => REFERENCES, []);

  return (
      <section className="relative overflow-hidden z-0">

     
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="mb-6">
        <GoBackButton fallbackTo="/" />
      </div>
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8"
        >
          References
        </motion.h2>

        {/* List */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
          className="space-y-10"
        >
          {items.map((ref) => (
            <motion.article
              key={ref.name}
              variants={fadeUp}
              className="flex items-start gap-5"
            >
              {/* Logo */}
              <div className="w-20 h-20 rounded-md overflow-hidden border bg-muted shrink-0 flex items-center justify-center">
                {/* Replace with <Image /> if you prefer next/image in a Next project */}
                <img
                  src={ref.logo}
                  alt={`${ref.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text block */}
              <div className="flex-1 min-w-0">
                <a
                  href="#"
                  className="text-primary hover:underline font-medium"
                  onClick={(e) => e.preventDefault()}
                >
                  {ref.name}
                </a>

                <div className="text-sm text-muted-foreground mt-1">
                  <div>Industry: {ref.industry}</div>
                  <div>Sector: {ref.sector}</div>
                </div>

                <p className="mt-3 text-sm sm:text-base leading-7 text-foreground/90">
                  {ref.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
