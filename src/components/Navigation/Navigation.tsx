
"use client";

import React, { useMemo, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageModal } from "@/sharedComponent/PageModal";
import { NavgationForm, type LeadForm } from "./NavigationForms/NavigationForm";
import { SolutionsMenu } from "./NavigationDropdowns/SolutionsMenu";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../src/assets/logo.png"
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "faq" },
];

const FORM_ID = "lead-modal-form";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<null | "demo" | "partner">(null);
  const [isSending, setIsSending] = useState(false); // controlled by the form via callback

  const navigate = useNavigate();
  const location = useLocation();

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

  // Let PageModal's built-in Send button submit the form
  const handleModalSend = () => {
    const form = document.getElementById(FORM_ID) as HTMLFormElement | null;
    if (!form) return;
    if (typeof form.requestSubmit === "function") form.requestSubmit();
    else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };

  // Called by the form on successful API submission
  const handleFormSuccess = (_result: unknown) => {
    setModalType(null); // close modal on success
  };

  return (
    <nav className="fixed top-0 w-full  backdrop-blur-sm z-50 bg-background/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-2"
            aria-label="Go to Home"
          >
            <div className=" bg-secondary  rounded-lg p-1">
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
                className="text-foreground hover:text-primary transition-colors"
              >
                {label}
              </button>
            ))}
            <SolutionsMenu variant="desktop" />
          </div>

          {/* desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setModalType("demo")}>
              Schedule a demo
            </Button>
            <Button size="sm" onClick={() => setModalType("partner")}>
              Become a partner
            </Button>
          </div>

          {/* mobile toggle */}
          <button
            onClick={() => setIsOpen(v => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
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
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {label}
              </button>
            ))}
            <div className="px-4">
              <SolutionsMenu variant="mobile" onNavigate={() => setIsOpen(false)} />
            </div>
            <div className="flex gap-3 px-4 pt-3">
              <Button
                variant="ghost"
                className="flex-1"
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
