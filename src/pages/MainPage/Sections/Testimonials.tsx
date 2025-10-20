import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, FolderGit2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useNavigate } from "react-router-dom";
import SharedButton from "@/sharedComponent/Button";

/* You can replace these with real project thumbnails */
import project1 from "@/assets/testimonial-1.jpg";
import project2 from "@/assets/testimonial-2.jpg";
import project3 from "@/assets/testimonial-3.jpg";

/* ---------- Types ---------- */
type Project = {
  title: string;
  client: string;
  image: string;
  summary: string;
  tags: string[];
  href?: string; // optional project case study link
};

/* ---------- Data (example) ---------- */
const PROJECTS: Project[] = [
  {
    title: "Argus ERP Mobile Companion",
    client: "Argus ERP",
    image: project1,
    summary:
      "React Native companion app with secure auth, beneficiary flows, HyperPay payments, and dynamic theming.",
    tags: ["React Native", "TypeScript", "Payments"],
    href: "/projects/argus-mobile",
  },
  {
    title: "SoftMachine SaaS Landing",
    client: "SoftMachine",
    image: project2,
    summary:
      "High-performance Vite + shadcn UI marketing site with smooth animations, forms, and modular sections.",
    tags: ["Vite", "shadcn/ui", "Tailwind"],
    href: "/projects/softmachine",
  },
  {
    title: "BYC Remittance Platform",
    client: "BYC",
    image: project3,
    summary:
      "Remittance flow with beneficiaries, OTP verification, exchange rates, and secure transfer confirmation.",
    tags: ["React Native", "OTP", "API"],
    href: "/projects/byc-remittance",
  },
  // duplicate a few items to make the carousel feel rich
  {
    title: "Argus ERP Mobile Companion v2",
    client: "Argus ERP",
    image: project1,
    summary: "Enhanced flows, image uploads, and refined UI/UX with global theming.",
    tags: ["React Native", "AsyncStorage"],
  },
  {
    title: "SoftMachine Docs UI",
    client: "SoftMachine",
    image: project2,
    summary: "Documentation microsite with MDX, search, and code-focused layout.",
    tags: ["MDX", "Docs", "Vite"],
  },
];

/* ---------- tiny carousel (unchanged) ---------- */
function useCarousel() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
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

function Carousel<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (t: T, idx: number) => React.ReactNode;
}) {
  const { ref, scrollBy } = useCarousel();
  return (
    <div className="relative">
      <div
        ref={ref}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto pb-2",
          "gap-6 scroll-pl-4 pr-4 pl-4",
          "no-scrollbar"
        )}
        onWheel={(e) => {
          const el = ref.current;
          if (!el) return;
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
          el.scrollLeft += e.deltaY;
        }}
      >
        {items.map((t, i) => (
          <div
            key={i}
            data-slide
            className={cn(
              "snap-start shrink-0",
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

      <style>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

/* ---------- Project card (replaces TestimonialCard) ---------- */
function ProjectCard({ p }: { p: Project }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Card
      ref={ref}
      className={cn(
        "h-full overflow-hidden rounded-2xl border border-border/60 bg-background",
        "transition-all duration-700 hover:shadow-xl"
      )}
      style={{
        transform: isVisible ? "translateY(0px)" : "translateY(10px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={p.image}
          alt={`${p.title} thumbnail`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </div>

      {/* body */}
      <div className="p-6">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <FolderGit2 className="h-4 w-4" />
          <span>{p.client}</span>
        </div>
        <h3 className="text-lg font-semibold leading-tight">{p.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-foreground/80">{p.summary}</p>

        {/* tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground/80"
            >
              {t}
            </span>
          ))}
        </div>

        {/* action */}
        {p.href && (
          <a
            href={p.href}
            className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            View case study <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </Card>
  );
}

/* ---------- Page ---------- */
const ProjectsTeaserWithCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  const items = useMemo(() => PROJECTS, []);

  return (
    <section className="bg-muted/30 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={cn(
            "mb-12 text-center transition-all duration-700",
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Latest Projects
          </div>
          <h2 className="text-4xl font-bold lg:text-5xl">What we’ve been building</h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            A quick peek at recent work across mobile, web, and product engineering.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          items={items}
          renderItem={(p, i) => <ProjectCard p={p as Project} key={i} />}
        />

        {/* Show more route */}
        <div className="mt-10 text-center">
          <SharedButton
            title="View all projects"
            onClick={() => navigate("/allProjects")}
          />
        </div>
      </div>
    </section>
  );
};

export default ProjectsTeaserWithCarousel;
