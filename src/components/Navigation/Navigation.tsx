"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Zap,
  Server,
  Shield,
  Layers,
  Wrench,
  BarChart3,
  Globe,
  CreditCard,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageModal } from "@/sharedComponent/PageModal";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DemoForm } from "./NavigationForms/ScheduleDemoForm";
import { PartnerForm } from "./NavigationForms/BecomePartnerForm";

// shadcn/ui popover
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "Support" },
];

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(5, "Please enter a valid phone").max(30),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(2, "Please enter your company"),
  message: z.string().min(5, "Please add a short message"),
});

type LeadForm = z.infer<typeof leadSchema>;

async function sendLead(payload: LeadForm & { type: "demo" | "partner" }) {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to send email");
  }
  return res.json().catch(() => ({}));
}

type SolutionItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
};

const SOLUTIONS: SolutionItem[] = [
  { icon: Server, label: "Cloud Hosting", href: "#cloud" },
  { icon: Shield, label: "Security Suite", href: "#security" },
  { icon: Layers, label: "Integrations", href: "#integrations" },
  { icon: Wrench, label: "Developer Tools", href: "#devtools" },
  { icon: BarChart3, label: "Analytics", href: "#analytics" },
  { icon: Globe, label: "Global CDN", href: "#cdn" },
  { icon: CreditCard, label: "Payments", href: "#payments" },
  { icon: Users, label: "Team Workspaces", href: "#workspaces" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [demoOpen, setDemoOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const yOffset = -70;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    setIsOpen(false);
  };

  // Forms
  const demoForm = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", company: "", message: "" },
  });

  const partnerForm = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", company: "", message: "" },
  });

  const onSubmitDemo = demoForm.handleSubmit(async (data) => {
    await sendLead({ ...data, type: "demo" });
    demoForm.reset();
    setDemoOpen(false);
  });

  const onSubmitPartner = partnerForm.handleSubmit(async (data) => {
    await sendLead({ ...data, type: "partner" });
    partnerForm.reset();
    setPartnerOpen(false);
  });

  return (
    <nav className="fixed top-0 w-full backdrop-blur-sm z-50 bg-background/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (scrolls to Home) */}
          <button
            onClick={() => handleScroll("home")}
            className="flex items-center gap-2"
            aria-label="Go to Home"
          >
            <div className="bg-primary rounded-lg p-2">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Base</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleScroll(id)}
                className="text-foreground hover:text-primary transition-colors"
              >
                {label}
              </button>
            ))}

            {/* ===== NEW: Solutions dropdown (2 items per row) ===== */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                >
                  Solutions
                  <svg
                    className="h-4 w-4 opacity-70"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[440px] p-4"
                sideOffset={12}
              >
                <div className="grid grid-cols-2 gap-3">
                  {SOLUTIONS.map(({ icon: Icon, label, href, onClick }) => {
                    const content = (
                      <div className="flex items-center gap-3 p-3 rounded-xl border hover:border-primary/40 hover:bg-muted/50 transition-colors">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    );

                    return href ? (
                      <a key={label} href={href} onClick={() => setIsOpen(false)}>
                        {content}
                      </a>
                    ) : (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          onClick?.();
                          setIsOpen(false);
                        }}
                        className="text-left"
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* CTAs (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setDemoOpen(true)}>
              Schedule a demo
            </Button>
            <Button size="sm" onClick={() => setPartnerOpen(true)}>
              Become a partner
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 animate-in slide-in-from-top">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleScroll(id)}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {label}
              </button>
            ))}

            {/* ===== NEW (Mobile): Solutions grid ===== */}
            <div className="px-4 pt-1">
              <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                Solutions
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SOLUTIONS.map(({ icon: Icon, label, href, onClick }) => {
                  const cell = (
                    <div className="flex items-center gap-3 p-3 rounded-xl border hover:border-primary/40 hover:bg-muted/50 transition-colors">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  );

                  return href ? (
                    <a key={label} href={href} onClick={() => setIsOpen(false)}>
                      {cell}
                    </a>
                  ) : (
                    <button
                      key={label}
                      type="button"
                      className="text-left"
                      onClick={() => {
                        onClick?.();
                        setIsOpen(false);
                      }}
                    >
                      {cell}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Existing mobile CTAs */}
            <div className="flex gap-3 px-4 pt-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setIsOpen(false);
                  setDemoOpen(true);
                }}
              >
                Schedule a demo
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setIsOpen(false);
                  setPartnerOpen(true);
                }}
              >
                Become a partner
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Schedule a demo modal */}
      <PageModal
        open={demoOpen}
        onOpenChange={setDemoOpen}
        title="Schedule a demo"
        description="Fill in your details and we’ll email our team."
        size="lg"
        scrollBody
        onSave={onSubmitDemo}
        onSend={onSubmitDemo}
      >
        <DemoForm demoForm={demoForm} onSubmitDemo={onSubmitDemo} />
      </PageModal>

      {/* Become a partner modal */}
      <PageModal
        open={partnerOpen}
        onOpenChange={setPartnerOpen}
        title="Become a partner"
        description="Share your details and we’ll contact you."
        size="lg"
        scrollBody
        onSave={onSubmitPartner}
        onSend={onSubmitPartner}
      >
        <PartnerForm
          partnerForm={partnerForm}
          onSubmitPartner={onSubmitPartner}
        />
      </PageModal>
    </nav>
  );
};

export default Navigation;
