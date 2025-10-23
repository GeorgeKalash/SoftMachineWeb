"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageModal } from "@/sharedComponent/PageModal";
import { NavgationForm, type LeadForm } from "./NavigationForms/NavigationForm";
import { SolutionsMenu } from "./NavigationDropdowns/SolutionsMenu";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../src/assets/softMachineLogo.png";

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "faq" },
];

const FORM_ID = "lead-modal-form";

/* -------------------------------------------------------------------------- */
/*                             Color / Contrast Utils                         */
/* -------------------------------------------------------------------------- */

function srgbToLinear(c: number) {
  const cs = c / 255;
  return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function hexToRgb(hex: string) {
  const s = hex.replace("#", "");
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    return { r, g, b, a: 1 };
  }
  if (s.length === 6 || s.length === 8) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    return { r, g, b, a: 1 }; // ignore alpha from #RRGGBBAA here
  }
  return null;
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
}

function parseCssColor(input: string | null) {
  if (!input) return null;
  const c = input.trim().toLowerCase();
  if (c === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  if (c.startsWith("#")) return hexToRgb(c);

  const rgbm = c.match(/rgba?\(([^)]+)\)/);
  if (rgbm) {
    const parts = rgbm[1].split(",").map((v) => v.trim());
    const r = parseFloat(parts[0]);
    const g = parseFloat(parts[1]);
    const b = parseFloat(parts[2]);
    const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    return { r, g, b, a: isNaN(a) ? 1 : a };
  }

  const hslm = c.match(/hsla?\(([^)]+)\)/);
  if (hslm) {
    const parts = hslm[1].split(",").map((v) => v.trim());
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1].replace("%", ""));
    const l = parseFloat(parts[2].replace("%", ""));
    const { r, g, b } = hslToRgb(h, s, l);
    const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    return { r, g, b, a: isNaN(a) ? 1 : a };
  }

  return null;
}

function isDark(bg: { r: number; g: number; b: number; a: number }) {
  const L = relativeLuminance(bg.r, bg.g, bg.b);
  return L <= 0.179; // WCAG-ish cutoff for preferring white text
}

/** Walk up ancestors to find a solid background color; heuristically treat background-image as dark */
function findSolidBackground(el: Element | null, depth = 0): { r: number; g: number; b: number; a: number } | null {
  if (!el || depth > 6) return null;
  const cs = getComputedStyle(el as Element);
  const bg = parseCssColor(cs.backgroundColor);
  if (bg && bg.a > 0) return bg;

  if (cs.backgroundImage && cs.backgroundImage !== "none") {
    // Heuristic: images/gradients usually need white text over hero/headers
    return { r: 32, g: 32, b: 32, a: 1 };
  }
  return findSolidBackground((el as HTMLElement).parentElement, depth + 1);
}

/** Background at viewport coordinate (x,y), ignoring the nav itself */
function backgroundAtPoint(navEl: HTMLElement, x: number, y: number) {
  const prev = navEl.style.pointerEvents;
  navEl.style.pointerEvents = "none";
  const stack = document.elementsFromPoint(x, y);
  navEl.style.pointerEvents = prev;

  for (const el of stack) {
    const color = findSolidBackground(el);
    if (color) return color;
  }
  const body = parseCssColor(getComputedStyle(document.body).backgroundColor);
  return body ?? { r: 255, g: 255, b: 255, a: 1 };
}

/**
 * Measure dark coverage across a horizontal band where navbar text lives.
 * Returns fraction + pass boolean (pass if fraction >= threshold).
 */
function darkCoverage(
  navEl: HTMLElement,
  opts?: { cols?: number; rows?: number; threshold?: number; insetX?: number; insetY?: number }
) {
  const { cols = 13, rows = 3, threshold = 0.95, insetX = 12, insetY = 6 } = opts || {};
  const rect = navEl.getBoundingClientRect();

  // middle third band of the nav height (where links usually sit)
  const bandTop = rect.top + rect.height * 0.33 + insetY;
  const bandBottom = rect.top + rect.height * 0.66 - insetY;
  const yValues =
    rows === 1
      ? [Math.round((bandTop + bandBottom) / 2)]
      : Array.from({ length: rows }, (_, r) =>
          Math.round(bandTop + ((bandBottom - bandTop) * (r + 0.5)) / rows)
        );

  const xLeft = rect.left + insetX;
  const xRight = rect.right - insetX;
  const xValues = Array.from({ length: cols }, (_, c) =>
    Math.round(xLeft + ((xRight - xLeft) * (c + 0.5)) / cols)
  );

  const total = xValues.length * yValues.length;
  const need = Math.ceil(threshold * total);
  let dark = 0;
  let checked = 0;

  for (const y of yValues) {
    if (y < 0 || y > window.innerHeight) continue;
    for (const x of xValues) {
      if (x < 0 || x > window.innerWidth) continue;

      const bg = backgroundAtPoint(navEl, x, y);
      if (isDark(bg)) dark++;
      checked++;

      const remaining = total - checked;
      if (dark + remaining < need) {
        const fraction = dark / total;
        return { fraction, pass: false };
      }
      if (dark >= need) {
        const fraction = dark / total;
        return { fraction, pass: true };
      }
    }
  }
  const fraction = dark / total;
  return { fraction, pass: fraction >= threshold };
}

/* -------------------------------------------------------------------------- */
/*                                Navigation                                  */
/* -------------------------------------------------------------------------- */

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<null | "demo" | "partner">(null);
  const [isSending, setIsSending] = useState(false);
  const [preferWhite, setPreferWhite] = useState(false); // flips when dark coverage ≥ 95%

  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  const isModalOpen = modalType !== null;

  const modalCopy = useMemo(() => {
    if (modalType === "partner") {
      return {
        title: "Become a partner",
        description: "Share your details and we'll reach out about partnership options.",
        submitLabel: "Request partnership",
      };
    }
    return {
      title: "Schedule a demo",
      description: "Fill in your details and we'll email our team.",
      submitLabel: "Schedule demo",
    };
  }, [modalType]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 70;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: prefersReduced ? "auto" : "smooth" });
  };

  const handleNav = (id: string) => {
    if (location.pathname === "/") {
      scrollToId(id);
      setIsOpen(false);
      return;
    }
    navigate({ pathname: "/", hash: `#${id}` });
    setIsOpen(false);
  };

  const handleModalSend = () => {
    const form = document.getElementById(FORM_ID) as HTMLFormElement | null;
    if (!form) return;
    if (typeof form.requestSubmit === "function") form.requestSubmit();
    else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };

  const handleFormSuccess = (_result: unknown) => {
    setModalType(null);
  };

  // Recompute coverage on scroll/resize/route or mobile menu open (layout shift)
  useEffect(() => {
    const update = () => {
      if (!navRef.current) return;
      const { pass } = darkCoverage(navRef.current, {
        cols: 13,
        rows: 3,
        threshold: 0.95,
        insetX: 12,
        insetY: 6,
      });
      setPreferWhite(pass);
    };

    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [location.pathname, isOpen]);

  // Drive all nav text via CSS variable for consistency
  const navFg = preferWhite ? "#ffffff" : "hsl(var(--foreground))";

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full z-50
        bg-background/95
        md:bg-background/10
        backdrop-blur-none
        supports-[backdrop-filter]:md:backdrop-blur-sm"
      style={
        {
          "--nav-fg": navFg,
        } as React.CSSProperties
      }
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-2"
            aria-label="Go to Home"
          >
            <div className="rounded-lg p-1">
              <img
                src={logo}
                alt="Company logo"
                className="h-10 w-auto"
                loading="eager"
                decoding="async"
              />
            </div>
          </button>

          {/* desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className="transition-colors text-[color:var(--nav-fg)] hover:opacity-80"
              >
                {label}
              </button>
            ))}
            <span className="text-[color:var(--nav-fg)]">
              <SolutionsMenu variant="desktop" />
            </span>
          </div>

          {/* desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-[color:var(--nav-fg)] border border-transparent hover:bg-white/10"
              onClick={() => setModalType("demo")}
            >
              Schedule a demo
            </Button>
            <Button
              size="sm"
              onClick={() => setModalType("partner")}
              className={preferWhite ? "text-white" : undefined}
            >
              Become a partner
            </Button>
          </div>

          {/* mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors text-[color:var(--nav-fg)]"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* mobile menu */}
        {isOpen && (
          <div id="mobile-nav" className="md:hidden py-4 space-y-3 animate-in slide-in-from-top">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-[color:var(--nav-fg)]"
              >
                {label}
              </button>
            ))}
            <div className="px-4 text-[color:var(--nav-fg)]">
              <SolutionsMenu variant="mobile" onNavigate={() => setIsOpen(false)} />
            </div>
            <div className="flex gap-3 px-4 pt-3">
              <Button
                variant="ghost"
                className="flex-1 text-[color:var(--nav-fg)] border border-transparent hover:bg-white/10"
                onClick={() => {
                  setIsOpen(false);
                  setModalType("demo");
                }}
              >
                Schedule a demo
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setIsOpen(false);
                  setModalType("partner");
                }}
              >
                Become a partner
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Send button submits the form; form handles API + success */}
      <PageModal
        open={isModalOpen}
        onOpenChange={(open) => setModalType(open ? (modalType ?? "demo") : null)}
        title={modalCopy.title}
        description={modalCopy.description}
        size="lg"
        scrollBody
        showSend
        onSend={handleModalSend}
        isSending={isSending}
      >
        {modalType && (
          <NavgationForm
            formId={FORM_ID}
            type={modalType}
            onSuccess={handleFormSuccess}
            onSubmittingChange={setIsSending}
          />
        )}
      </PageModal>
    </nav>
  );
};

export default Navigation;
