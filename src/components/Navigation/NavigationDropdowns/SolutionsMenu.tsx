"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Server,
  Shield,
  Layers,
  Wrench,
  BarChart3,
  Globe,
  CreditCard,
  Users,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

function useMediaQuery(query: string) {
  const get = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const m = window.matchMedia(query);
    const listener = () => setMatches(m.matches);
    m.addEventListener?.("change", listener);
    return () => m.removeEventListener?.("change", listener);
  }, [query]);
  return matches;
}

export type SolutionItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  meta?: string;
};

export const DEFAULT_SOLUTIONS: SolutionItem[] = [
  { icon: Server, label: "Cloud Hosting", href: "#cloud", meta: "New" },
  { icon: Shield, label: "Security Suite", href: "#security" },
  { icon: Layers, label: "Integrations", href: "#integrations" },
  { icon: Wrench, label: "Developer Tools", href: "#devtools" },
  { icon: BarChart3, label: "Analytics", href: "#analytics" },
  { icon: Globe, label: "Global CDN", href: "#cdn" },
  { icon: CreditCard, label: "Payments", href: "#payments" },
  { icon: Users, label: "Team Workspaces", href: "#workspaces" },
];

type SolutionsMenuProps = {
  items?: SolutionItem[];
  onNavigate?: () => void;
  variant?: "desktop" | "mobile" | "auto";
  triggerLabel?: string;
  triggerClassName?: string;
  className?: string;
};

export function SolutionsMenu({
  items = DEFAULT_SOLUTIONS,
  onNavigate,
  variant = "auto",
  triggerLabel = "Solutions",
  triggerClassName = "",
  className = "",
}: SolutionsMenuProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const resolvedVariant = variant === "auto" ? (isDesktop ? "desktop" : "mobile") : variant;

  const [openDesktop, setOpenDesktop] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  const hoverTimer = useRef<number | null>(null);

  const openWithDelay = (ms = 60) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenDesktop(true), ms);
  };
  const closeWithDelay = (ms = 120) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenDesktop(false), ms);
  };

  useEffect(() => {
    if (resolvedVariant === "desktop") setOpenMobile(false);
    else setOpenDesktop(false);
  }, [resolvedVariant]);

  const ItemCell = ({ icon: Icon, label, href, meta, onClick }: SolutionItem) => {
    const handleClick = () => {
      onClick?.();
      onNavigate?.();
      setOpenDesktop(false);
      setOpenMobile(false);
    };

    const inner = (
      <div className="flex items-center gap-3 p-3 rounded-xl border hover:border-primary/40 hover:bg-muted/50 transition active:scale-[0.98]">
        <div className="rounded-xl bg-primary/10 p-2 shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {label}
          </span>
          {meta && (
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
              {meta}
            </Badge>
          )}
        </div>
        <ChevronRight className="h-4 w-4 opacity-60 shrink-0" />
      </div>
    );

    return href ? (
      <a key={label} href={href} onClick={handleClick}>
        {inner}
      </a>
    ) : (
      <button key={label} type="button" onClick={handleClick} className="w-full text-left">
        {inner}
      </button>
    );
  };

  /** Desktop: open on hover */
  if (resolvedVariant === "desktop") {
    return (
      <Popover open={openDesktop}>
        <div
          onMouseEnter={() => openWithDelay()}
          onMouseLeave={() => closeWithDelay()}
          className="relative"
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors ${triggerClassName}`}
              aria-haspopup="dialog"
              aria-expanded={openDesktop}
              onClick={(e) => e.preventDefault()} // disable click toggle
            >
              {triggerLabel}
              <ChevronDown
                className={`h-4 w-4 opacity-70 transition-transform ${openDesktop ? "rotate-180" : ""}`}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={12}
            className={`w-[440px] p-4 z-[60] ${className}`}
            onMouseEnter={() => openWithDelay(0)}
            onMouseLeave={() => closeWithDelay()}
          >
            <div className="grid grid-cols-2 gap-3">
              {items.map((it) => (
                <ItemCell key={it.label} {...it} />
              ))}
            </div>
          </PopoverContent>
        </div>
      </Popover>
    );
  }

  /** Mobile: scrollable bottom sheet */
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetTrigger asChild>
        <button
          type="button"
          className={`w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-secondary transition-colors ${className}`}
          aria-expanded={openMobile}
        >
          <span className="text-foreground font-medium">{triggerLabel}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${openMobile ? "rotate-180" : ""}`}
          />
        </button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col rounded-t-2xl overflow-hidden">
        <SheetHeader className="px-4 py-3 border-b bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">Our Solutions</SheetTitle>
           
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          <div className="space-y-2 pb-10">
            {items.map((it) => (
              <ItemCell key={it.label} {...it} />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
