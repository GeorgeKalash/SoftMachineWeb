import React, { useMemo, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// ---- demo data (reuse your three and generate a few more for carousel length) ----
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

type T = {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
};

const base: T[] = [
  {
    name: "Sarah Johnson",
    role: "CEO at TechStart",
    image: testimonial1,
    content:
      "This platform has completely transformed how our team works. The intuitive interface and powerful features have increased our productivity by 40%. Highly recommended!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager at InnovateCo",
    image: testimonial2,
    content:
      "We've tried many solutions, but this one stands out. The seamless integrations and excellent support team make it a game-changer for our organization.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Founder of DesignHub",
    image: testimonial3,
    content:
      "The best investment we've made for our business. The analytics features alone have helped us make better decisions and grow faster than ever before.",
    rating: 5,
  },
];

const DATA: Record<"company" | "brand" | "enterprise" | "startup", T[]> = {
  company: [...base, ...base.map((x, i) => ({ ...x, name: x.name + " " + (i + 1) }))],
  brand: [...base].reverse().concat(base),
  enterprise: [...base, ...base, ...base.slice(0, 1)],
  startup: [...base, ...base.map((x, i) => ({ ...x, role: "Founder / " + x.role }))],
};

// ---- small, dependency-free carousel using scroll-snap + arrow buttons ----
function useCarousel() {
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
    // width of one card (including gap) ~ clientWidth * 0.9 on mobile, 0.5 on md, 0.33 on lg
    // better: compute the first child's width + gap
    const child = el.querySelector<HTMLElement>("[data-slide]");
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "24");
    const step = child ? child.offsetWidth + gap : el.clientWidth * 0.9;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  const toIndex = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"));
    const target = slides[i];
    if (target) {
      el.scrollTo({ left: target.offsetLeft - 16, behavior: "smooth" });
    }
  };

  return { ref, scrollBy, toIndex };
}

function Carousel({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (t: T, idx: number) => React.ReactNode;
}) {
  const { ref, scrollBy } = useCarousel();

  return (
    <div className="relative">
      {/* track */}
      <div
        ref={ref}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto pb-2",
          "gap-6 scroll-pl-4 pr-4 pl-4",
          "no-scrollbar" // hide scrollbar (we’ll add utility below)
        )}
        // improve wheel on trackpads horizontally
        onWheel={(e) => {
          const el = ref.current;
          if (!el) return;
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // already horizontal
          el.scrollLeft += e.deltaY; // vertical wheel -> horizontal scroll
        }}
      >
        {items.map((t, i) => (
          <div
            key={i}
            data-slide
            className={cn(
              "snap-start shrink-0",
              // responsive slide widths
              "w-[88%] sm:w-[60%] md:w-[48%] lg:w-[32%]"
            )}
          >
            {renderItem(t, i)}
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollBy("prev")}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10",
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur",
          "shadow-sm hover:bg-muted transition"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollBy("next")}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10",
          "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur",
          "shadow-sm hover:bg-muted transition"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// ---- card used in slides ----
function TestimonialCard({ t }: { t: T }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <Card
      ref={ref}
      className={cn(
        "p-8 h-full hover:shadow-xl transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      {/* Stars */}
      <div className="mb-6 flex gap-1">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-accent text-accent" />
        ))}
      </div>

      <p className="mb-8 leading-relaxed text-foreground">"{t.content}"</p>

      <div className="mt-auto flex items-center gap-4 border-t border-border pt-6">
        <img src={t.image} alt={t.name} className="h-14 w-14 rounded-full object-cover" />
        <div>
          <div className="font-bold">{t.name}</div>
          <div className="text-sm text-muted-foreground">{t.role}</div>
        </div>
      </div>
    </Card>
  );
}

const Testimonials: React.FC = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: badgesRef, isVisible: badgesVisible } = useScrollAnimation();

  const tabs = useMemo(
    () => [
      { key: "company", label: "Company", data: DATA.company },
      { key: "brand", label: "Brand", data: DATA.brand },
      { key: "enterprise", label: "Enterprise", data: DATA.enterprise },
      { key: "startup", label: "Startup", data: DATA.startup },
    ],
    []
  );

  return (
    <section className="bg-muted/30 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={cn(
            "mb-16 text-center transition-all duration-700",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Testimonials
          </div>
          <h2 className="mb-4 text-4xl font-bold lg:text-5xl">Loved by Teams Worldwide</h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Don&apos;t just take our word for it. Here&apos;s what our customers say about their experience.
          </p>
        </div>

        {/* Carousel (non-tabbed top section) */}
        <Carousel
          items={DATA.company.slice(0, 6)}
          renderItem={(t, i) => <TestimonialCard t={t} key={i} />}
        />

        {/* Trust Badges with Tabs -> each tab is also a carousel */}
        <div
          ref={badgesRef}
          className={cn(
            "mt-20 transition-all duration-700 delay-200",
            badgesVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Trusted by over 500+ companies worldwide
          </p>

          <Tabs defaultValue="company" className="mx-auto max-w-6xl">
            <TabsList className="mb-8 grid w-full grid-cols-4">
              {tabs.map((t) => (
                <TabsTrigger key={t.key} value={t.key}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.key} value={tab.key} className="animate-in fade-in-50">
                <Carousel
                  items={tab.data}
                  renderItem={(t, i) => <TestimonialCard t={t} key={i} />}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* hide scrollbars cross-browser */}
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
