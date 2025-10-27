"use client";

import { useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageModal } from "@/sharedComponent/PageModal";
import { ContactUsForm } from "../ContactUs/ContactUsForm";
import { SolutionsMenu } from "./NavigationDropdowns/SolutionsMenu";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../src/assets/softMachineLogo.png"; // desktop (≥ 996px)
import logosmall from "../../../src/assets/logo.png";       // small (≤ 995px)

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "about", label: "About" },
  { id: "ScrollableShowcase", label: "Showcase" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "FAQ" },
] as const;

const FORM_ID = "lead-modal-form";

/* -------------------------------------------------------------------------- */
/*                                Navigation                                  */
/* -------------------------------------------------------------------------- */

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
        description:
          "Share your details and we'll reach out about partnership options.",
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
    const navHeight = navRef.current?.getBoundingClientRect().height ?? 70;
    const y = el.getBoundingClientRect().top + window.scrollY - navHeight;
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

  return (
    <nav
      ref={navRef}
      className={`
        fixed top-0 w-full z-50 transition-colors
        ${isOpen ? "bg-white shadow-sm" : "bg-transparent"}   /* mobile → white when open */
        md:bg-transparent
        supports-[backdrop-filter]:md:backdrop-blur-md
      `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo (≤995px small, ≥996px large) */}
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-2"
            aria-label="Go to Home"
          >
            {/* small logo up to 995px */}
            <img
              src={logosmall}
              alt="SoftMachine"
              className="block min-[996px]:hidden h-8 w-auto"
              loading="eager"
              decoding="async"
              width={120}
              height={32}
            />
            {/* desktop logo from 996px and up */}
            <img
              src={logo}
              alt="SoftMachine"
              className="hidden min-[996px]:block h-10 w-auto"
              loading="eager"
              decoding="async"
              width={160}
              height={40}
            />
          </button>

          {/* desktop nav */}
          <div className="hidden md:flex items-center gap-6 nav-dfg">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className="transition-opacity hover:opacity-80"
              >
                {label}
              </button>
            ))}
            <SolutionsMenu variant="desktop" />
          </div>

          {/* desktop CTAs */}
          <div className="hidden md:flex items-center gap-3 nav-dfg">
            <Button
              variant="ghost"
              size="sm"
              className="border border-transparent hover:bg-white/0"
              onClick={() => setModalType("demo")}
            >
              Schedule a demo
            </Button>
            <Button size="sm" onClick={() => setModalType("partner")}>
              Become a partner
            </Button>
          </div>

          {/* mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary/30 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* mobile scrim + panel */}
      {isOpen && (
        <>
          {/* scrim behind the panel */}
          <div
            className="md:hidden fixed inset-0 top-16 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />
          {/* white panel */}
          <div
            id="mobile-nav"
            className="md:hidden fixed left-0 right-0 top-16 z-50 bg-white border-t shadow-sm py-4 space-y-3 animate-in slide-in-from-top"
          >
            <div className="nav-dfg space-y-3">
              {NAV_LINKS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className="block w-full text-left px-4 py-2 rounded-lg hover:bg-transparent"
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
                  className="flex-1 hover:bg-white/0"
                  onClick={() => {
                    setIsOpen(false);
                    setModalType("demo");
                  }}
                >
                  Schedule a demo
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 hover:bg-white/0"
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
        </>
      )}

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
          <ContactUsForm
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
