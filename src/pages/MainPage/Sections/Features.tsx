"use client";

import React from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
  type LucideIcon,
  Code2,
  MonitorSmartphone,
  Workflow,
  PlugZap,
  ShieldCheck,
  LifeBuoy,
} from "lucide-react";
import siteData from "@/SiteData/SiteData.json";

/* ----------------------------- types & tokens ---------------------------- */

type FeatureColor =
  | "feature-pink"
  | "feature-green"
  | "feature-orange"
  | "feature-blue"
  | "feature-purple"
  | string;

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: FeatureColor;
  href?: string;
  ariaLabel?: string;
};

type FeaturesProps = {
  items?: FeatureItem[];
  heading?: string;
  subheading?: string;
  className?: string;
};

/* Auto color cycle */
const COLOR_CYCLE: FeatureColor[] = [
  "feature-pink",
  "feature-green",
  "feature-orange",
  "feature-blue",
  "feature-purple",
];

/* ----------------------------- JSON → UI map ----------------------------- */

/** Map string icon names from JSON to Lucide components */
const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  MonitorSmartphone,
  Workflow,
  PlugZap,
  ShieldCheck,
  LifeBuoy,
};

const itemsFromJson: FeatureItem[] =
  (siteData.features?.items ?? []).map((it, i) => ({
    icon: ICON_MAP[it.icon as keyof typeof ICON_MAP] ?? Code2,
    title: it.title,
    description: it.description,
    color: COLOR_CYCLE[i % COLOR_CYCLE.length],
    href:"",
    ariaLabel: "",
  })) ?? [];

/* ------------------------------- components ------------------------------ */

const FeatureCard: React.FC<{ feature: FeatureItem; index: number }> = ({
  feature,
  index,
}) => {
  const { ref, isVisible } = useScrollAnimation();
  const Icon = feature.icon;

  const colorToken =
    feature.color ?? COLOR_CYCLE[index % COLOR_CYCLE.length];

  const bg = `hsl(var(--${colorToken}) / 0.12)`;
  const fg = `hsl(var(--${colorToken}))`;

  const CardInner = (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 0%, rgba(255,255,255,0.08), transparent 70%)",
          maskImage:
            "radial-gradient(80% 70% at 50% -10%, #000 50%, transparent 70%)",
        }}
      />
      <div
        className={[
          "relative mb-6 grid place-items-center",
          "size-20 rounded-full",
          "transition-transform duration-500",
          "group-hover:scale-105 group-focus-within:scale-105",
          "ring-1 ring-inset",
        ].join(" ")}
        style={{
          backgroundColor: bg,
          color: fg,
          boxShadow: `0 10px 30px -10px ${fg}22`,
        }}
      >
        <Icon className="size-10" />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(60% 60% at 50% 40%, ${fg}22, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
      </div>

      <h3 className="text-xl font-semibold tracking-tight mb-2">
        {feature.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </>
  );

  const baseClasses = [
    "group relative flex flex-col items-center text-center",
    "rounded-2xl p-8",
    "bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40",
    "border border-border/50",
    "transition-all duration-500",
    "hover:shadow-xl hover:-translate-y-1",
    "focus-within:shadow-xl focus-within:-translate-y-1",
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
  ].join(" ");

  return (
    <article
      ref={ref}
      role="listitem"
      aria-label={feature.title}
      className={baseClasses}
      style={{
        transitionDelay: `${index * 120}ms`,
        willChange: "transform, opacity",
      }}
      data-visible={isVisible}
    >
      {feature.href ? (
        <a
          href={feature.href}
          className="absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label={feature.ariaLabel ?? feature.title}
        />
      ) : (
        <span className="absolute inset-0 rounded-2xl" aria-hidden="true" tabIndex={-1} />
      )}
      {CardInner}
    </article>
  );
};

const Features: React.FC<FeaturesProps> = ({
  items = itemsFromJson,
  heading = siteData.features?.heading ?? "What we do",
  subheading = siteData.features?.subheading ?? "Design & build custom software with the right architecture, integrations, and support.",
  className,
}) => {
  return (
    <section className={["py-20 bg-background", className].filter(Boolean).join(" ")}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {heading}
          </h2>
          <p className="mt-3 text-muted-foreground">{subheading}</p>
        </div>

        {/* Grid */}
        <div
          role="list"
          aria-label="Feature list"
          className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((feature, i) => (
            <FeatureCard key={`${feature.title}-${i}`} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
