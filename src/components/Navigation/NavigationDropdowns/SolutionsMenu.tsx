"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";

/* media query helper (unchanged) */
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

/* images (unchanged) */
import HR from "@/assets/modules/HumanResources.png";
import HRRed from "@/assets/modules/HumanResourcesRed.png";
import Financials from "@/assets/modules/Financials.png";
import FinancialsRed from "@/assets/modules/FinancialsRed.png";
import RepairAndService from "@/assets/modules/RepairAndService.png";
import RepairAndServiceRed from "@/assets/modules/RepairAndServiceRed.png";
import SalesOrderProcessing from "@/assets/modules/SalesOrderProcessing.png";
import SalesOrderProcessingRed from "@/assets/modules/SalesOrderProcessingRed.png";
import FixedAssets from "@/assets/modules/FixedAssets.png";
import FixedAssetsRed from "@/assets/modules/FixedAssetsRed.png";
import Manufacturing from "@/assets/modules/Manufacturing.png";
import ManufacturingRed from "@/assets/modules/ManufacturingRed.png";
import PurchaseOrderProcessing from "@/assets/modules/PurchaseOrderProcessing.png";
import PurchaseOrderProcessingRed from "@/assets/modules/PurchaseOrderProcessingRed.png";
import Delivery from "@/assets/modules/Delivery.png";
import DeliveryRed from "@/assets/modules/DeliveryRed.png";
import InventoryManagement from "@/assets/modules/InventoryManagement.png";
import InventoryManagementRed from "@/assets/modules/InventoryManagementRed.png";

/* types (unchanged) */
export type SolutionItem = {
  icon?: React.ComponentType<{ className?: string }>;
  imgSrc?: string;
  imgHoverSrc?: string;
  label: string;
  href?: string;
  onClick?: () => void;
  meta?: string;
};

type SolutionsMenuProps = {
  items?: SolutionItem[];
  onNavigate?: () => void;
  variant?: "desktop" | "mobile" | "auto";
  triggerLabel?: string;
  triggerClassName?: string;
  className?: string;
};

export const DEFAULT_SOLUTIONS: SolutionItem[] = [
  { imgSrc: HR, imgHoverSrc: HRRed, label: "Human Resources", href: "/HumanResources" },
  { imgSrc: Financials, imgHoverSrc: FinancialsRed, label: "Financials", href: "/Financials" },
  { imgSrc: RepairAndService, imgHoverSrc: RepairAndServiceRed, label: "Repair And Service", href: "#repair-service" },
  { imgSrc: SalesOrderProcessing, imgHoverSrc: SalesOrderProcessingRed, label: "Sales Order Processing", href: "/SalesOrderProcessing" },
  { imgSrc: FixedAssets, imgHoverSrc: FixedAssetsRed, label: "Fixed Assets", href: "/FixedAssets" },
  { imgSrc: Manufacturing, imgHoverSrc: ManufacturingRed, label: "Manufacturing", href: "/Manufacturing" },
  { imgSrc: PurchaseOrderProcessing, imgHoverSrc: PurchaseOrderProcessingRed, label: "Purchase Order Processing", href: "#purchase-order-processing" },
  { imgSrc: Delivery, imgHoverSrc: DeliveryRed, label: "Delivery", href: "#delivery" },
  { imgSrc: InventoryManagement, imgHoverSrc: InventoryManagementRed, label: "Inventory Management",  href: "/InventoryManagment" },
];

export function SolutionsMenu({
  items = DEFAULT_SOLUTIONS,
  onNavigate,
  variant = "auto",
  triggerLabel = "Modules",
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

  const navigate = useNavigate();
  const location = useLocation();

  const scrollToHash = (hash: string) => {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ——— style presets (unchanged) ——— */
  const ICON_BOX =
    "p-2 rounded-xl bg-primary/10 ring-1 ring-primary/15 shadow-sm " +
    "group-hover:bg-primary/15 transition-colors shrink-0";
  const ICON_IMG_WRAPPER = "relative h-8 w-8 md:h-9 md:w-9";
  const ICON_SIZE = "h-8 w-8 md:h-9 md:w-9";
  const LABEL_CLASS =
    "text-[15px] md:text-base font-medium leading-6 tracking-tight";
  const CELL_CLASS =
    "group flex items-start gap-3 p-2.5 md:p-3 rounded-xl border border-transparent " +
    "hover:border-primary/30 hover:bg-muted/50 transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 " +
    "active:scale-[0.99]";

  const ItemCell = ({ icon: Icon, imgSrc, imgHoverSrc, label, href, meta, onClick }: SolutionItem) => {
    const handleClick = (e?: React.MouseEvent) => {
      e?.preventDefault();
      onClick?.();
      onNavigate?.();
      setOpenDesktop(false);
      setOpenMobile(false);

      if (!href) return;
      if (/^https?:\/\//i.test(href)) return window.open(href, "_blank", "noopener,noreferrer");

      if (href.startsWith("#")) {
        if (location.pathname !== "/") {
          navigate("/");
          setTimeout(() => scrollToHash(href), 50);
        } else scrollToHash(href);
        return;
      }
      if (href.startsWith("/")) navigate(href);
    };

    return (
      <button
        key={label}
        type="button"
        onClick={handleClick}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-0"
      >
        <div className={CELL_CLASS}>
          <div className={ICON_BOX}>
            {imgSrc ? (
              <div className={ICON_IMG_WRAPPER}>
                <img
                  src={imgSrc}
                  alt=""
                  className={`absolute inset-0 ${ICON_SIZE} object-contain opacity-100 transition-opacity duration-200 group-hover:opacity-0`}
                  loading="lazy"
                  decoding="async"
                />
                {imgHoverSrc ? (
                  <img
                    src={imgHoverSrc}
                    alt=""
                    className={`absolute inset-0 ${ICON_SIZE} object-contain opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
            ) : Icon ? (
              <Icon className={`${ICON_SIZE}`} />
            ) : null}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <span className={LABEL_CLASS}>{label}</span>
              {meta && (
                <Badge
                  variant="secondary"
                  className="h-5 px-1.5 text-[10px] leading-[18px] mt-0.5"
                >
                  {meta}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </button>
    );
  };

  /* ---------- Desktop (Popover) ---------- */
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
              /* keep button neutral; only the inline text+icon gets ink */
              className={`inline-flex items-center gap-1 no-ink-bg ${triggerClassName}`}
              aria-haspopup="dialog"
              aria-expanded={openDesktop}
              onClick={(e) => e.preventDefault()}
            >
              <span className="ink-inline inline-flex items-center gap-1">
                {triggerLabel}
                <ChevronDown
                  className={`h-4 w-4 opacity-70 transition-transform ${openDesktop ? "rotate-180" : ""}`}
                />
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={14}
            className={[
              "w-[500px] md:w-[640px] lg:w-[720px]",
              "p-2.5 md:p-3",
              "rounded-2xl bg-popover/95 backdrop-blur-xl",
              "shadow-2xl ring-1 ring-border border border-border/50",
              "outline-none",
              className || "",
            ].join(" ")}
            onMouseEnter={() => openWithDelay(0)}
            onMouseLeave={() => closeWithDelay()}
          >
            <div className="px-1.5 pb-2 pt-0.5 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Modules of Argus
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 md:gap-2">
              {items.map((it) => (
                <ItemCell key={it.label} {...it} />
              ))}
            </div>
          </PopoverContent>
        </div>
      </Popover>
    );
  }

  /* ---------- Mobile (Bottom Sheet) ---------- */
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetTrigger asChild>
        <button
          type="button"
          className={`w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-secondary transition-colors ${className}`}
          aria-expanded={openMobile}
        >
          {/* label ink on left */}
          <span className="ink-inline font-medium">{triggerLabel}</span>
          {/* arrow ink on right */}
          <span className="ink-inline">
            <ChevronDown className={`h-4 w-4 transition-transform ${openMobile ? "rotate-180" : ""}`} />
          </span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="h-[85vh] p-0 flex flex-col rounded-t-3xl overflow-hidden bg-popover/95 backdrop-blur-xl"
      >
        <SheetHeader className="px-4 py-3 border-b bg-background/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sm font-semibold tracking-tight">
              MODULES OF ARGUS
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-3.5 md:px-4 py-3 md:py-4">
          <div className="grid grid-cols-1 gap-1">
            {items.map((it) => (
              <ItemCell key={it.label} {...it} />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SolutionsMenu;
