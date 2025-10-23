"use client";

import React from "react";
import { Check, Target, TrendingUp, Users } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import aboutDashboard from "@/assets/about-dashboard.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Decoration from "@/sharedComponent/Decoration";

/* ------------------------------- types ---------------------------------- */
type Stat = { icon: LucideIcon; value: string; label: string };
type AboutProps = {
  stats?: Stat[];
  benefits?: string[];

  // Section 1 (About)
  pill1?: string;
  heading1?: string;
  copy1a?: string;
  copy1b?: string;

  // Section 2 (Features/Capabilities)
  pill2?: string;
  heading2?: string;
  featureCards?: { title: string; copy: string }[];

  // CTA
  primaryCtaText?: string;
  onPrimaryCta?: () => void;
  secondaryCtaText?: string;
  onSecondaryCta?: () => void;
};

/* ------------------------------ defaults -------------------------------- */
// KEEPING the count-up stats exactly as-is
const DEFAULT_STATS: Stat[] = [
  { icon: Users, value: "40+", label: "Projects delivered" },
  { icon: Target, value: "10+", label: "Years building" },
  { icon: TrendingUp, value: "12+", label: "Industries served" },
];

// 6 benefits (same count), rewritten to reflect your VALUE + message
const DEFAULT_BENEFITS = [
  "SOP-driven delivery across industries",
  "Cloud-first with optional desktop access",
  "Remote, instant access to every record",
  "Security, reliability, and performance",
  "Integrates with POS, web, and tools",
  "30+ years of hands-on consulting",
];

// 3 feature cards (same count), focused on Argus + implementation
const DEFAULT_FEATURE_CARDS = [
  {
    title: "Cloud ERP, zero hardware",
    copy:
      "Run securely in the cloud with optional desktop clients. Access your data instantly—from the office or on the move.",
  },
  {
    title: "Scalable & industry-ready",
    copy:
      "Modular architecture and proven SOPs adapt to retail, distribution, manufacturing and more as you grow.",
  },
  {
    title: "Implementation that sticks",
    copy:
      "We build and maintain Argus ourselves, and partner with you on migration, training, and integrations so you hit your goals.",
  },
];

/* --------------------------------- ui ----------------------------------- */
const About: React.FC<AboutProps> = ({
  stats = DEFAULT_STATS,
  benefits = DEFAULT_BENEFITS,

  // WHO WE ARE
  pill1 = "Who We Are",
  heading1 = "3 decades of ERP—built, owned, and evolved by SoftMachine",
  copy1a = "We started over 30 years ago, shipping our first Windows ERP in 1995. With creativity and determination we grew into the cloud, delivering a product line that helps businesses run smoothly and scale confidently.",
  copy1b = "Our vision is global—one world-class product, real value for clients and teammates. Our mission: provide technological solutions that exceed expectations—Software Smart by Design.",

  // ABOUT ARGUS
  pill2 = "About Argus",
  heading2 = "Smart, cloud ERP—fast, flexible, and ready for the unexpected",
  featureCards = DEFAULT_FEATURE_CARDS,

  primaryCtaText = "Talk to us",
  onPrimaryCta,
  secondaryCtaText = "See work",
  onSecondaryCta,
}) => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { ref: content1Ref, isVisible: content1Visible } = useScrollAnimation();
  const { ref: image1Ref, isVisible: image1Visible } = useScrollAnimation();
  const { ref: image2Ref, isVisible: image2Visible } = useScrollAnimation();
  const { ref: content2Ref, isVisible: content2Visible } = useScrollAnimation();

  const StatCard = ({ stat, index }: { stat: Stat; index: number }) => {
    const Icon = stat.icon;
    return (
      <div
        className={`text-center p-8 rounded-2xl bg-background shadow-lg hover:shadow-xl transition-all duration-700 ${
          statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <Icon className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden />
        <div className="text-4xl font-bold mb-2">{stat.value}</div>
        <div className="text-muted-foreground">{stat.label}</div>
      </div>
    );
  };

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden py-20 bg-gradient-to-br from-background via-background to-primary/5"
      aria-label="About SoftMachine"
      role="region"
    >
      {/* Decorative layer to match the hero */}
      <Decoration
        minCount={5}
        maxCount={12}
        masked
        zIndex={0}
        className="z-10"
        avoidCenter={{ xPct: 50, yPct: 40, radiusPct: 22 }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Stats (unchanged) */}
        <div ref={statsRef} className="grid md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <StatCard key={`${stat.label}-${index}`} stat={stat} index={index} />
          ))}
        </div>

        {/* Section 1: Who We Are */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div
            ref={content1Ref}
            className={`space-y-6 transition-all duration-700 ${
              content1Visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              {pill1}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">{heading1}</h2>
            <p className="text-lg text-muted-foreground">{copy1a}</p>
            <p className="text-lg text-muted-foreground">{copy1b}</p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 transition-all duration-700 ${
                    content1Visible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <Check className="h-5 w-5 text-primary shrink-0 mt-1" aria-hidden />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            ref={image1Ref}
            className={`relative transition-all duration-700 delay-300 ${
              image1Visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              <img
                src={aboutTeam}
                alt="SoftMachine team collaborating"
                className="rounded-3xl shadow-2xl w-full"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>

        {/* Section 2: About Argus */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            ref={image2Ref}
            className={`relative order-2 lg:order-1 transition-all duration-700 ${
              image2Visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative">
              <img
                src={aboutDashboard}
                alt="Argus ERP dashboard interface"
                className="rounded-3xl shadow-2xl w-full"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>

          <div
            ref={content2Ref}
            className={`space-y-6 order-1 lg:order-2 transition-all duration-700 delay-300 ${
              content2Visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="inline-block px-4 py-2 bg-accent/20 text-accent-foreground rounded-full text-sm font-semibold">
              {pill2}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">{heading2}</h2>
            <p className="text-lg text-muted-foreground">
              Argus is our ERP that makes daily operations instant and intelligent. No hardware lock-in, work from anywhere, and stay ready for change.
            </p>

            <div className="space-y-4 pt-4">
              {featureCards.map((f, i) => (
                <div
                  key={`${f.title}-${i}`}
                  className="p-6 bg-background rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.copy}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={
                  onPrimaryCta ??
                  (() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" }))
                }
                aria-label={primaryCtaText}
              >
                {primaryCtaText}
              </button>
              <button
                className="inline-flex items-center rounded-md border px-5 py-3 text-sm font-medium hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={
                  onSecondaryCta ??
                  (() =>
                    document
                      .getElementById("work")
                      ?.scrollIntoView({ behavior: "smooth" }))
                }
                aria-label={secondaryCtaText}
              >
                {secondaryCtaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
