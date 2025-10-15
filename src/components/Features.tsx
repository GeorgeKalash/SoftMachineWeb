import { type LucideIcon, Sparkles, Globe, Palette } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import React from "react";

type FeatureColor =
  | "feature-pink"
  | "feature-green"
  | "feature-orange"
  | string; // allow custom tokens too

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: FeatureColor; // maps to CSS var --{color}
};

const DEFAULT_ITEMS: FeatureItem[] = [
  {
    icon: Sparkles,
    title: "Cutting-edge Features",
    description: "Powerful building blocks to ship faster with confidence.",
    color: "feature-pink",
  },
  {
    icon: Globe,
    title: "10+ Useful Integrations",
    description: "Plug into auth, billing, analytics, and more in minutes.",
    color: "feature-green",
  },
  {
    icon: Palette,
    title: "High-quality Modern Design",
    description: "Clean, accessible UI that feels premium out of the box.",
    color: "feature-orange",
  },
];

type FeaturesProps = {
  items?: FeatureItem[];
  heading?: string;
  subheading?: string;
  className?: string;
};

const FeatureCard: React.FC<{ feature: FeatureItem; index: number }> = ({
  feature,
  index,
}) => {
  const { ref, isVisible } = useScrollAnimation();
  const Icon = feature.icon;

  // Inline HSL variables so tokens like --feature-pink work in both light/dark.
  const bg = `hsl(var(--${feature.color}) / 0.12)`;
  const fg = `hsl(var(--${feature.color}))`;

  return (
    <article
      ref={ref}
      role="listitem"
      aria-label={feature.title}
      className={[
        "group relative flex flex-col items-center text-center",
        "rounded-2xl p-8",
        "bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40",
        "border border-border/50",
        "transition-all duration-500",
        "hover:shadow-xl hover:-translate-y-1",
        "focus-within:shadow-xl focus-within:-translate-y-1",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
      style={{
        transitionDelay: `${index * 120}ms`,
        willChange: "transform, opacity",
      }}
      data-visible={isVisible}
    >
      {/* subtle gradient ring */}
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

      {/* Icon bubble */}
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
        {/* glow */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(60% 60% at 50% 40%, ${fg}22, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
      </div>

      <h3 className="text-xl font-semibold tracking-tight mb-2">{feature.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

      {/* focus target for keyboard users */}
      <button
        className="absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{ color: fg }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </article>
  );
};

const Features: React.FC<FeaturesProps> = ({
  items = DEFAULT_ITEMS,
  heading = "Everything you need to launch",
  subheading = "A thoughtfully curated kit of features, integrations, and patterns.",
  className,
}) => {
  return (
    <section className={["py-20 bg-background", className].filter(Boolean).join(" ")}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{heading}</h2>
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
