import React, { useMemo, useState } from "react";
import { Star, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";
import { GoBackButton } from "@/sharedComponent/GoBackButton";

/* ---------------- types & data ---------------- */
type T = {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
};

const base: T[] = [
  { name: "Sarah Johnson", role: "CEO at TechStart", image: testimonial1, content: "This platform has completely transformed how our team works. The intuitive interface and powerful features have increased our productivity by 40%. Highly recommended!", rating: 5 },
  { name: "Michael Chen", role: "Product Manager at InnovateCo", image: testimonial2, content: "We've tried many solutions, but this one stands out. The seamless integrations and excellent support team make it a game-changer for our organization.", rating: 5 },
  { name: "Emily Rodriguez", role: "Founder of DesignHub", image: testimonial3, content: "The best investment we've made for our business. The analytics features alone have helped us make better decisions and grow faster than ever before.", rating: 5 },
];

const DATA: Record<"company" | "brand" | "enterprise" | "startup", T[]> = {
  company: [...base, ...base.map((x, i) => ({ ...x, name: x.name + " " + (i + 1) }))],
  brand: [...base].reverse().concat(base),
  enterprise: [...base, ...base, ...base.slice(0, 1)],
  startup: [...base, ...base.map((x) => ({ ...x, role: "Founder / " + x.role }))],
};

/* ---------------- helpers ---------------- */
function initials(name: string) {
  const p = name.trim().split(" ");
  return (p[0]?.[0] ?? "") + (p[1]?.[0] ?? "");
}

function RatingStars({ value = 5 }: { value?: number }) {
  return (
    <div className="mb-6 flex gap-1">
      {Array.from({ length: value }).map((_, i) => (
        <Star key={i} aria-hidden className="h-5 w-5 text-yellow-500" style={{ filter: "drop-shadow(0 0 4px rgba(234,179,8,.35))" }} />
      ))}
      <span className="sr-only">{value} out of 5 stars</span>
    </div>
  );
}

/* ---------------- card ---------------- */
function TestimonialCard({ t, index }: { t: T; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <Card
      ref={ref}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-background/70 to-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/40",
        "p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500"
      )}
      style={{
        transform: isVisible ? "translateY(0px)" : "translateY(10px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${Math.min(index, 6) * 40}ms`,
      }}
    >
      <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <RatingStars value={t.rating} />
      <p className="mb-8 text-base leading-relaxed text-foreground/90">“{t.content}”</p>
      <div className="mt-auto flex items-center gap-4 border-t border-border/70 pt-6">
        <Avatar className="h-14 w-14 ring-2 ring-border/60">
          <AvatarImage src={t.image} alt={t.name} />
          <AvatarFallback className="bg-muted text-foreground/70">
            {initials(t.name).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold tracking-tight">{t.name}</div>
          <div className="text-sm text-muted-foreground">{t.role}</div>
        </div>
      </div>
      <Sparkles className="absolute right-4 top-4 h-4 w-4 text-accent/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Card>
  );
}

/* ---------------- component (single export) ---------------- */
type ProjectListProps = {
  id?: string;
  variant?: "teaser" | "full";
  defaultTab?: "company" | "brand" | "enterprise" | "startup";
  initialCount?: number;
};

export default function ProjectList({
  id,
  variant = "teaser",
  defaultTab = "company",
  initialCount = 6,
}: ProjectListProps) {
  const { ref: blockRef, isVisible } = useScrollAnimation();

  const tabs = useMemo(
    () => [
      { key: "company", label: "Company", data: DATA.company },
      { key: "brand", label: "Brand", data: DATA.brand },
      { key: "enterprise", label: "Enterprise", data: DATA.enterprise },
      { key: "startup", label: "Startup", data: DATA.startup },
    ],
    []
  );

  const [counts] = useState<Record<string, number>>(
    Object.fromEntries(tabs.map((t) => [t.key, variant === "full" ? t.data.length : initialCount]))
  );

  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-24",
        "bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_60%)]"
      )}
    >
      
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0,transparent_31px,rgba(120,119,198,0.08)_32px),linear-gradient(to_bottom,transparent_0,transparent_31px,rgba(120,119,198,0.08)_32px)] bg-[length:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_80%)]" />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
          <GoBackButton fallbackTo="/" />
        </div>

        <div
          ref={blockRef}
          className={cn("transition-all duration-700", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
        >
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Trusted by 500+ teams</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Projects & Testimonials</h2>
            <p className="mt-3 text-pretty text-muted-foreground">Real feedback from companies, brands, and startups using our platform.</p>
          </div>

          <Tabs defaultValue={defaultTab} className="mx-auto max-w-6xl">
            <div className="sticky top-0 z-10 -mx-4 mb-6 bg-background/70 px-4 py-3 backdrop-blur sm:static sm:bg-transparent sm:px-0 sm:py-0">
              <TabsList className="grid w-full grid-cols-4 overflow-auto sm:inline-flex sm:justify-center">
                {tabs.map((t) => (
                  <TabsTrigger key={t.key} value={t.key} className="data-[state=active]:bg-accent/15 data-[state=active]:text-foreground">
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map((tab) => {
              const visible = counts[tab.key] ?? tab.data.length;
              return (
                <TabsContent key={tab.key} value={tab.key} className="animate-in fade-in-50">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tab.data.slice(0, visible).map((item, i) => (
                      <TestimonialCard key={`${item.name}-${i}`} t={item} index={i} />
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
