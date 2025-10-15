import React, { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { motion, Variants, useReducedMotion } from "framer-motion";

// ——— motion presets (match your blog/hero feel) ———
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: EASE } },
};

// ——— tiny deterministic PRNG so shape positions stay stable ———
const prand = (seed: number) => {
  let t = seed + 1;
  return () => {
    t ^= t << 13;
    t ^= t >> 17;
    t ^= t << 5;
    return ((t >>> 0) % 1000) / 1000; // [0,1)
  };
};

type ShapeKind = "circle" | "square" | "triangle" | "ring" | "diamond";
type ShapeConfig = {
  id: string;
  kind: ShapeKind;
  size: number;
  opacity: number;
  hueVar: string; // css var name like --primary / --accent / --muted-foreground
  topPct: number;
  leftPct: number;
  driftX: number;
  driftY: number;
  rotate: number;
  duration: number;
  delay: number;
  z?: number;
};

type Plan = {
  name: string;
  description: string;
  price: { monthly: number; annually: number };
  features: { text: string; included: boolean }[];
  highlighted?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    description: "Perfect for individuals and small projects",
    price: { monthly: 29, annually: 290 },
    features: [
      { text: "Up to 5 team members", included: true },
      { text: "10 GB storage", included: true },
      { text: "Basic analytics", included: true },
      { text: "Email support", included: true },
      { text: "Custom integrations", included: false },
      { text: "Advanced security", included: false },
      { text: "Priority support", included: false },
      { text: "Custom branding", included: false },
    ],
  },
  {
    name: "Professional",
    description: "Ideal for growing teams and businesses",
    price: { monthly: 79, annually: 790 },
    features: [
      { text: "Up to 20 team members", included: true },
      { text: "100 GB storage", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority email support", included: true },
      { text: "Custom integrations", included: true },
      { text: "Advanced security", included: true },
      { text: "24/7 priority support", included: false },
      { text: "Custom branding", included: false },
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    price: { monthly: 199, annually: 1990 },
    features: [
      { text: "Unlimited team members", included: true },
      { text: "Unlimited storage", included: true },
      { text: "Enterprise analytics", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations", included: true },
      { text: "Enterprise security", included: true },
      { text: "24/7 priority support", included: true },
      { text: "Custom branding", included: true },
    ],
  },
];

// ——— decorative shapes builder (biased around header & left side) ———
function usePricingShapes() {
  const prefersReducedMotion = useReducedMotion();
  const shapes = useMemo<ShapeConfig[]>(() => {
    const rnd = prand(137); // change seed to shift layout deterministically
    const kinds: ShapeKind[] = ["circle", "square", "triangle", "ring", "diamond"];
    const items: ShapeConfig[] = [];
    const COUNT = 16;
    for (let i = 0; i < COUNT; i++) {
      const kind = kinds[i % kinds.length];
      const size = 22 + Math.floor(rnd() * 54); // 22..76
      const opacity = 0.10 + rnd() * 0.18; // 0.10..0.28
      const hueVar =
        kind === "circle"
          ? "--primary"
          : kind === "triangle"
          ? "--accent"
          : kind === "ring"
          ? "--foreground"
          : "--muted-foreground";
      // bias top-half + slightly left to live behind header + first card
      const topPct = 4 + rnd() * 70; // 4..74
      const leftPct = rnd() < 0.65 ? 4 + rnd() * 46 : 50 + rnd() * 46;
      const driftX = 10 + rnd() * 26;
      const driftY = 10 + rnd() * 26;
      const rotate = Math.floor(rnd() * 360);
      const duration = 6 + rnd() * 6;
      const delay = rnd() * 2.2;
      items.push({
        id: `pshape-${i}`,
        kind,
        size,
        opacity,
        hueVar,
        topPct,
        leftPct,
        driftX,
        driftY,
        rotate,
        duration,
        delay,
        z: 10,
      });
    }
    return items;
  }, []);

  const renderShape = (s: ShapeConfig) => {
    const baseStyle: React.CSSProperties = {
      top: `${s.topPct}%`,
      left: `${s.leftPct}%`,
      width: s.kind === "triangle" ? 0 : s.size,
      height: s.kind === "triangle" ? 0 : s.size,
      opacity: s.opacity,
      zIndex: s.z ?? 10,
    };

    const animate = prefersReducedMotion
      ? {}
      : {
          x: [0, s.driftX, -s.driftX * 0.6, 0],
          y: [0, -s.driftY, s.driftY * 0.5, 0],
          rotate: [s.rotate, s.rotate + 8, s.rotate - 6, s.rotate],
          transition: {
            duration: s.duration,
            ease: "easeInOut" as const,
            delay: s.delay,
            repeat: Infinity,
          },
        };

    switch (s.kind) {
      case "circle":
        return (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              ...baseStyle,
              background: `hsl(var(${s.hueVar}))`,
              filter: "blur(0.2px)",
            }}
            animate={animate}
          />
        );
      case "square":
        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{
              ...baseStyle,
              background: `hsl(var(${s.hueVar}))`,
              borderRadius: 10,
            }}
            animate={animate}
          />
        );
      case "diamond":
        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{
              ...baseStyle,
              width: s.size * 0.9,
              height: s.size * 0.9,
              background: `hsl(var(${s.hueVar}))`,
              transform: `rotate(45deg)`,
              borderRadius: 8,
            }}
            animate={animate}
          />
        );
      case "ring":
        return (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              ...baseStyle,
              background: "transparent",
              border: `${Math.max(2, Math.floor(s.size / 12))}px solid hsl(var(--primary)/0.25)`,
              boxShadow: "0 0 0 1px hsl(var(--background)/0.6) inset",
            }}
            animate={animate}
          />
        );
      case "triangle":
        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{
              ...baseStyle,
              borderLeft: `${s.size * 0.45}px solid transparent`,
              borderRight: `${s.size * 0.45}px solid transparent`,
              borderBottom: `${s.size * 0.75}px solid hsl(var(${s.hueVar}))`,
              filter: "blur(0.2px)",
              width: 0,
              height: 0,
            }}
            animate={animate}
          />
        );
    }
  };

  return { shapes, renderShape };
}

export default function PricingWithToggleDecor() {
  const [billPlan, setBillPlan] = useState<"monthly" | "annually">("monthly");
  const isAnnual = billPlan === "annually";
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: footerRef, isVisible: footerVisible } = useScrollAnimation();
  const { shapes, renderShape } = usePricingShapes();

  return (
    <motion.section
      className="relative isolate overflow-hidden py-24 bg-gradient-to-br from-background via-background to-primary/5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
    >
      {/* decorative wandering shapes (masked so edges don’t clip) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          maskImage:
            "radial-gradient(120% 120% at 36% 32%, black 62%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 36% 32%, black 62%, transparent 100%)",
        }}
      >
        {shapes.map(renderShape)}
      </div>

      {/* subtle static blobs */}
      <div className="pointer-events-none absolute -left-14 top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-56 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + segmented toggle */}
        <motion.div
          ref={headerRef}
          className={cn(
            "text-center mb-10 transition-all duration-700",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          variants={fadeUp}
        >
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Flexible Billing
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-3">Pay Monthly or Annually</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Switch anytime. Annual billing typically saves you two months.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-sm font-medium">Bill Monthly</span>
            <BillingToggle
              checked={isAnnual}
              onToggle={() => setBillPlan((p) => (p === "monthly" ? "annually" : "monthly"))}
              onMonthly={() => setBillPlan("monthly")}
              onAnnual={() => setBillPlan("annually")}
            />
            <span className="text-sm font-medium">Bill Annually</span>

            <span
              className={cn(
                "ml-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold transition-opacity",
                isAnnual ? "opacity-100 bg-primary/10 text-primary" : "opacity-0"
              )}
            >
              Save 2 months
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name} variants={fadeUp}>
              <PriceCard plan={plan} index={i} isAnnual={isAnnual} />
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          ref={footerRef}
          className={cn(
            "mt-12 text-center transition-all duration-700 delay-200",
            footerVisible ? "opacity-100" : "opacity-0"
          )}
          variants={fadeUp}
        >
          <p className="text-muted-foreground mb-3">
            14-day free trial • No credit card required • Cancel anytime
          </p>
          <p className="text-sm text-muted-foreground">
            Need a custom plan?{" "}
            <a href="#contact" className="text-primary hover:underline font-semibold">
              Contact sales
            </a>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

function PriceCard({
  plan,
  index,
  isAnnual,
}: {
  plan: Plan;
  index: number;
  isAnnual: boolean;
}) {
  const { ref, isVisible } = useScrollAnimation();
  const price = isAnnual ? plan.price.annually : plan.price.monthly;
  const period = isAnnual ? "/year" : "/month";

  return (
    <Card
      ref={ref}
      className={cn(
        "p-8 relative overflow-hidden transition-all duration-700",
        plan.highlighted
          ? "border-2 border-primary shadow-xl lg:scale-[1.03]"
          : "hover:shadow-xl",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {plan.highlighted && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-bl-lg">
          Popular
        </div>
      )}

      {/* tiny decorative accent inside card */}
      <span className="pointer-events-none absolute -right-6 top-8 h-12 w-12 rounded-full bg-primary/10 blur-xl" />

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
      </div>

      <div className="mb-8 flex items-baseline gap-2">
        <span className="text-5xl font-bold tracking-tight">${price}</span>
        <span className="text-muted-foreground">{period}</span>
      </div>

      <Button
        className="w-full mb-8"
        variant={plan.highlighted ? "default" : "outline"}
        size="lg"
      >
        Get Started
      </Button>

      <div className="space-y-4">
        <div className="font-semibold">What’s included:</div>
        {plan.features.map((f, idx) => (
          <div className="flex items-start gap-3" key={idx}>
            {f.included ? (
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            ) : (
              <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <span className={f.included ? "text-foreground" : "text-muted-foreground line-through"}>
              {f.text}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Accessible segmented switch with sliding thumb (no external deps) */
function BillingToggle({
  checked,
  onToggle,
  onMonthly,
  onAnnual,
}: {
  checked: boolean; // true = Annually
  onToggle: () => void;
  onMonthly: () => void;
  onAnnual: () => void;
}) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onMonthly();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onAnnual();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Toggle billing (Monthly / Annually)"
      onClick={onToggle}
      onKeyDown={onKeyDown}
      className={cn(
        "relative inline-flex h-10 w-56 items-center rounded-full border border-border bg-muted/50 p-1",
        "transition-[background,box-shadow] duration-300"
      )}
    >
      <span
        className={cn(
          "z-10 flex-1 text-center text-sm font-medium cursor-pointer select-none",
          !checked ? "text-foreground" : "text-muted-foreground"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onMonthly();
        }}
      >
        Monthly
      </span>
      <span
        className={cn(
          "z-10 flex-1 text-center text-sm font-medium cursor-pointer select-none",
          checked ? "text-foreground" : "text-muted-foreground"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onAnnual();
        }}
      >
        Annually
      </span>

      {/* Sliding thumb */}
      <span
        className={cn(
          "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-background shadow-sm",
          "transition-transform duration-300 will-change-transform",
          checked ? "translate-x-[calc(100%+0.5rem)]" : "translate-x-1"
        )}
      />
      {/* Active outline */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full ring-1 transition",
          checked ? "ring-primary/30" : "ring-transparent"
        )}
      />
    </button>
  );
}