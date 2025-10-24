"use client";

import React, { useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageModal } from "@/sharedComponent/PageModal";
import { NavgationForm } from "./NavigationForms/NavigationForm";
import { SolutionsMenu } from "./NavigationDropdowns/SolutionsMenu";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/softMachineLogo.png";

/* ---------------------------------- Data --------------------------------- */
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

const FORM_ID = "lead-modal-form";

/* ------------------------------ Compact sizing --------------------------- */
const COMPACT = true; // flip to false if you want the taller nav

const ROW_H   = COMPACT ? "h-12 sm:h-14" : "h-16";
const LOGO_H  = COMPACT ? "h-8 sm:h-9"   : "h-10";
const GAP     = COMPACT ? "gap-4"        : "gap-6";
const ICON_SZ = COMPACT ? "h-5 w-5"      : "h-6 w-6";
const BTN_CLS = COMPACT ? "h-8 px-3 text-sm" : "h-9 px-4";

/* ------------------------------- Component -------------------------------- */
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<null | "demo" | "partner">(null);
  const [isSending, setIsSending] = useState(false);

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
    const navH = navRef.current?.getBoundingClientRect().height ?? 70;
    const y = el.getBoundingClientRect().top + window.scrollY - navH;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
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

  const handleFormSuccess = () => setModalType(null);

  return (
    <nav
      ref={navRef}
      className="
        fixed top-0 w-full z-50 bg-white
        supports-[backdrop-filter]:backdrop-blur-lg
        py-0
      "
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className={`flex items-center justify-between ${ROW_H}`}>
          {/* Logo */}
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-2"
            aria-label="Go to Home"
          >
            <div className="rounded-lg p-1">
              <img
                src={logo}
                alt="Company logo"
                className={`${LOGO_H} w-auto`}
                loading="eager"
                decoding="async"
              />
            </div>
          </button>

          {/* Desktop: links + solutions */}
          <div className={`hidden md:flex items-center ${GAP} nav-ink`}>
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className="transition-opacity hover:opacity-80 no-ink-bg"
              >
                {label}
              </button>
            ))}
            <SolutionsMenu variant="desktop" />
          </div>

          {/* Desktop: CTAs */}
          <div className={`hidden md:flex items-center ${COMPACT ? "gap-2" : "gap-3"} nav-ink`}>
            <Button
              variant="ghost"
              size="sm"
              className={`btn-ghost no-ink-bg ${BTN_CLS}`}
              onClick={() => setModalType("demo")}
            >
              Schedule a demo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`btn-ghost no-ink-bg ${BTN_CLS}`}
              onClick={() => setModalType("partner")}
            >
              Become a partner
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-1.5 rounded-lg transition-opacity nav-ink hover:opacity-80 no-ink-bg"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X className={ICON_SZ} /> : <Menu className={ICON_SZ} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div id="mobile-nav" className="md:hidden py-3 space-y-3 animate-in slide-in-from-top">
            <div className="nav-ink space-y-2">
              {NAV_LINKS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className="block w-full text-left px-4 py-2 rounded-lg hover:opacity-80 no-ink-bg"
                >
                  {label}
                </button>
              ))}

              <div className="px-4">
                <SolutionsMenu variant="mobile" onNavigate={() => setIsOpen(false)} />
              </div>

              <div className="flex gap-2 px-4 pt-2">
                <Button
                  variant="ghost"
                  className="flex-1 btn-ghost no-ink-bg h-9"
                  onClick={() => {
                    setIsOpen(false);
                    setModalType("demo");
                  }}
                >
                  Schedule a demo
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 btn-ghost no-ink-bg h-9"
                  onClick={() => {
                    setIsOpen(false);
                    setModalType("partner");
                  }}
                >
                  Become a partner
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
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
