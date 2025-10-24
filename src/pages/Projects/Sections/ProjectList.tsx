import React, { useMemo, useState } from "react";
import { Star, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// logo imports
import MGLogo from "../../../assets/Clients/MGLogo.jpeg";
import MasagLogo from "../../../assets/Clients/MasagLogo.jpeg";
import BYCLogo from "../../../assets/Clients/BYCLogo.png";
import NEGLogo from "../../../assets/Clients/NEGLogo.jpg";
import CILLogo from "../../../assets/Clients/CILLogo.jpeg";
import HyundaiLogo from "../../../assets/Clients/HyundaiLogo.png";
import TamkeenLogo from "../../../assets/Clients/TamkeenLogo.png";
import KorristarLogo from "../../../assets/Clients/KorristarLogo.jpeg";
import GDKLogo from "../../../assets/Clients/GDKLogo.jpeg";
import { GoBackButton } from "@/sharedComponent/GoBackButton";
import ClientsWorldwideSection from "@/sharedComponent/WorldPresenceMap";

/* ---------------- types & data ---------------- */
type T = {
  name: string;
  role: string;
  image: string;
  content: string;
};

// add sector only internally; keeps T intact elsewhere
type Sector = "finance" | "manufacturing" | "auto_retail";
type WithSector = T & { sector: Sector };

const base: WithSector[] = [
  {
    name: "Sultan Bin Ghamiah",
    role: "CEO · Mansour Group (Lebanon)",
    image: MGLogo as unknown as string,
    content:
      "Argus ERP unified our 40 stores and improved inventory and sales visibility, giving us tighter control and better insights across locations.",
     
    sector: "auto_retail", // retail group
  },
  {
    name: "Badr Al Amiri",
    role: "CEO · MASAGH (KSA)",
    image: MasagLogo as unknown as string,
    content:
      "Partnering with SoftMachine removed operational headaches. Dependable team with our back—highly reassuring.",
     
    sector: "finance", // services/solutions fit best here
  },
  {
    name: "Khursan Bin Yaala",
    role: "CEO · Bin Yaala Exchange (KSA)",
    image: BYCLogo as unknown as string,
    content:
      "Argus ERP streamlined remittance workflows, boosting accuracy and efficiency. Custom features transformed day-to-day operations.",
     
    sector: "finance",
  },
  {
    name: "Tarek Tarouti",
    role: "CEO · New Egypt Gold (Egypt)",
    image: NEGLogo as unknown as string,
    content:
      "Grateful for the tangible impact on our business and the ongoing support. Definitely recommended.",
     
    sector: "manufacturing",
  },
  {
    name: "Khalil Ghassani",
    role: "CEO · CIL (Ivory Coast)",
    image: CILLogo as unknown as string,
    content:
      "Long-term, reliable, and thorough support with excellent communication. A high-performing partner for business solutions.",
     
    sector: "finance",
  },
  {
    name: "Wissam Bazzoun",
    role: "CIO · Hyundai (Lebanon)",
    image: HyundaiLogo as unknown as string,
    content:
      "They consistently deliver—products and services precisely match our business needs.",
     
    sector: "auto_retail", // automotive
  },
  {
    name: "Yahya Tahan",
    role: "CEO · Tamkeen (KSA)",
    image: TamkeenLogo as unknown as string,
    content:
      "Real-time insights in production, inventory, and logistics helped us optimize processes and meet demand more effectively.",
     
    sector: "manufacturing",
  },
  {
    name: "Ali Korri",
    role: "CEO · Korristar (Lebanon)",
    image: KorristarLogo as unknown as string,
    content: "Exceeded expectations across product, service, and ongoing support.",
     
    sector: "auto_retail", // retail/services bucket
  },
  {
    name: "Elie Ferzli",
    role: "CEO · GDK (Ivory Coast)",
    image: GDKLogo as unknown as string,
    content:
      "Seamless ERP integration with strong reporting improved compliance and transparency across operations.",
     
    sector: "finance", // services/compliance-oriented
  },
];

// derive by filters
const DATA: Record<"all" | "finance" | "manufacturing" | "autoRetail", T[]> = {
  all: base,
  finance: base.filter((x) => x.sector === "finance"),
  manufacturing: base.filter((x) => x.sector === "manufacturing"),
  autoRetail: base.filter((x) => x.sector === "auto_retail"),
};



/* ---------------- card ---------------- */
function TestimonialCard({ t, index }: { t: T; index: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <Card
      ref={ref}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-background/70 to-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/40",
        "p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500",
        "flex flex-col"
      )}
      style={{
        transform: isVisible ? "translateY(0px)" : "translateY(10px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${Math.min(index, 6) * 40}ms`,
      }}
    >
      <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <p className="mb-8 text-base leading-relaxed text-foreground/90 line-clamp-4">“{t.content}”</p>

      <div className="mt-auto flex items-center gap-4 border-t border-border/70 pt-6">
        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-border/60 grid place-items-center">
          <img
            src={t.image}
            alt={t.name}
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
            loading="lazy"
          />
        </div>

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
  defaultTab?: "all" | "finance" | "manufacturing" | "autoRetail";
  initialCount?: number;
};

export default function ProjectList({
  id,
  variant = "teaser",
  defaultTab = "all",
  initialCount = 6,
}: ProjectListProps) {
  const { ref: blockRef, isVisible } = useScrollAnimation();

  const tabs = useMemo(
    () => [
      { key: "all", label: "All", data: DATA.all },
      { key: "finance", label: "Finance & Services", data: DATA.finance },
      { key: "manufacturing", label: "Manufacturing & Industry", data: DATA.manufacturing },
      { key: "autoRetail", label: "Automotive & Retail", data: DATA.autoRetail },
    ],
    []
  );

  const [counts] = useState<Record<string, number>>(
    Object.fromEntries(
      tabs.map((t) => [
        t.key,
        variant === "full" || t.key === "all" ? t.data.length : initialCount,
      ])
    )
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
          className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
        >
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Trusted by leading teams
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects & Testimonials
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Real feedback from finance, manufacturing, automotive, and retail partners.
            </p>
          </div>

          <Tabs defaultValue={defaultTab} className="mx-auto max-w-6xl">
            <div className="sticky top-0 z-10 -mx-4 mb-6 bg-background/70 px-4 py-3 backdrop-blur sm:static sm:bg-transparent sm:px-0 sm:py-0">
              <TabsList className="grid w-full grid-cols-4 overflow-auto sm:inline-flex sm:justify-center">
                {tabs.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.key}
                    className="data-[state=active]:bg-accent/15 data-[state=active]:text-foreground"
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabs.map((tab) => {
              const visible = counts[tab.key] ?? tab.data.length;
              return (
                <TabsContent key={tab.key} value={tab.key} className="animate-in fade-in-50">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
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
      <ClientsWorldwideSection />

    </section>
  );
}
