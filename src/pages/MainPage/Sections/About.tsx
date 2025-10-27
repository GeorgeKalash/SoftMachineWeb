"use client";

import React, { useState } from "react";
import { Check, Target, TrendingUp, Users } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import aboutTeam from "@/assets/about-team.jpg";
import aboutDashboard from "@/assets/about-dashboard.jpg";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Decoration from "@/sharedComponent/Decoration";

import { PageModal } from "@/sharedComponent/PageModal";
import { ContactUsForm } from "@/components/ContactUs/ContactUsForm"; 

/* ------------------------------- types ---------------------------------- */
type Stat = { icon: LucideIcon; value: string; label: string };
type AboutProps = {
  stats?: Stat[];
  benefits?: string[];
  pill1?: string;
  heading1?: string;
  copy1a?: string;
  copy1b?: string;
  pill2?: string;
  heading2?: string;
  copy2a?: string;
  copy2b?: string;
  featureCards?: { title: string; copy: string }[];
  primaryCtaText?: string;
  onPrimaryCta?: () => void;
  secondaryCtaText?: string;
  onSecondaryCta?: () => void;
};

/* ------------------------------ defaults -------------------------------- */
const DEFAULT_STATS: Stat[] = [
  { icon: Users, value: "40+", label: "Projects delivered" },
  { icon: Target, value: "10+", label: "Years building" },
  { icon: TrendingUp, value: "12+", label: "Industries served" },
];

const DEFAULT_BENEFITS = [
  "Standard operationg procedure for our multi-industry workspace",
  "SoftMachine is expanding to become a phenomenally thriving company with clients all over the globe in the same product and line by giving sufficient value to our clients, and employees.",
  "Providing technological solutions that exceed clients expectations",
];

const DEFAULT_FEATURE_CARDS = [
  {
    title: "Cloud ERP, zero hardware",
    copy:
      "Because they are portable, you can work remotely and while you're on the move and still have immediate access to all of your data.",
  },
  {
    title: "secutites ",
    copy:
      "Businesses can become more flexible, scalable, and ready for any unexpected event with Argus ERP Cloud.",
  },
];

/* ------------------------------ helpers/ui ------------------------------ */
const StatCard = ({ stat, index, visible }: { stat: Stat; index: number; visible: boolean }) => {
  const Icon = stat.icon;
  return (
    <div
      className={`text-center p-8 rounded-2xl bg-background shadow-lg hover:shadow-xl transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Icon className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden />
      <div className="text-4xl font-bold mb-2">{stat.value}</div>
      <div className="text-muted-foreground">{stat.label}</div>
    </div>
  );
};

const BigCard = ({ label, index, visible }: { label: string; index: number; visible: boolean }) => (
  <div
    className={`p-6 sm:p-7 bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-700 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
    }`}
    style={{ transitionDelay: `${index * 70}ms` }}
  >
    <div className="flex items-start gap-3">
      <Check className="h-5 w-5 text-primary shrink-0 mt-1" aria-hidden />
      <div>
        <h3 className="text-lg font-semibold leading-snug">{label}</h3>
      </div>
    </div>
  </div>
);

const BulletRow = ({
  title,
  copy,
  index,
  visible,
}: {
  title: string;
  copy: string;
  index: number;
  visible: boolean;
}) => (
  <div
    className={`flex items-start gap-3 transition-all duration-700 ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
    }`}
    style={{ transitionDelay: `${index * 60}ms` }}
  >
    <Check className="h-5 w-5 text-primary shrink-0 mt-1" aria-hidden />
    <div>
      <div className="font-medium leading-tight">{title}</div>
      <p className="text-sm text-muted-foreground leading-snug">{copy}</p>
    </div>
  </div>
);

/* --------------------------- local constants ---------------------------- */
const FORM_ID = "about-talk-to-us-form";

/* --------------------------------- ui ----------------------------------- */
const About: React.FC<AboutProps> = ({
  stats = DEFAULT_STATS,
  benefits = DEFAULT_BENEFITS,
  pill1 = "Who We Are",
  heading1 = "3 decades of ERP—Software",
  copy1a = "Just over 30 years ago, we started as an erp software company that offers business solutions at its best! We grew with creativity and determination, creating out first windows erp software back in 1995.",
  copy1b = "Our aim was the sky and we reached the cloud erp world with our unique product. We're still expanding around the world with our hard working and professional team. Now SoftMachine is one of the leading software companies across industries and regions still aiming high, still reaching there!",
  pill2 = "About Argus",
  heading2 = "Argus ERP Cloud",
  copy2a = "Argus is an erp software product that enables businesses to plan and manage their operations more successfully and efficiently. It enables you to function smoothly, instantly, and intelligently.",
  copy2b = "Businesses can become more flexible, scalable, and ready for any unexpected event with Argus ERP Cloud. You operate with desktop computers and don't rely on hardware. Because they are portable, you can work remotely and while you're on the move and still have immediate access to all of your data.",
  featureCards = DEFAULT_FEATURE_CARDS,
  primaryCtaText = "Talk to us",
  onPrimaryCta,
}) => {
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { ref: content1Ref, isVisible: content1Visible } = useScrollAnimation();
  const { ref: image1Ref, isVisible: image1Visible } = useScrollAnimation();
  const { ref: image2Ref, isVisible: image2Visible } = useScrollAnimation();
  const { ref: content2Ref, isVisible: content2Visible } = useScrollAnimation();

  /* Modal state (same pattern as Navigation / FAQ) */
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleModalSend = () => {
    const form = document.getElementById(FORM_ID) as HTMLFormElement | null;
    if (!form) return;
    if (typeof form.requestSubmit === "function") form.requestSubmit();
    else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };

  const handleFormSuccess = () => setOpen(false);

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden py-20 bg-gradient-to-br from-background via-background to-primary/5"
      aria-label="About SoftMachine"
      role="region"
    >
      <Decoration
        minCount={5}
        maxCount={12}
        masked
        zIndex={0}
        className="z-10"
        avoidCenter={{ xPct: 50, yPct: 40, radiusPct: 22 }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Stats */}
        <div ref={statsRef} className="grid md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <StatCard key={`${stat.label}-${index}`} stat={stat} index={index} visible={statsVisible} />
          ))}
        </div>

        {/* Section 1 */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div
            ref={content1Ref}
            className={`space-y-6 transition-all duration-700 ${
              content1Visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
              {pill1}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">{heading1}</h2>
            <p className="text-lg text-muted-foreground">{copy1a}</p>
            <p className="text-lg text-muted-foreground">{copy1b}</p>

            <div className="grid sm:grid-cols-1 gap-4 pt-4">
              {benefits.map((b, i) => (
                <BigCard key={`benefit-${i}`} label={b} index={i} visible={content1Visible} />
              ))}
            </div>
          </div>

          <div
            ref={image1Ref}
            className={`relative transition-all duration-700 delay-300 ${
              image1Visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              <img
                src={aboutTeam}
                alt="SoftMachine team collaborating"
                className="rounded-3xl shadow-2xl w-full"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            ref={image2Ref}
            className={`relative order-2 lg:order-1 transition-all duration-700 ${
              image2Visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative">
              <img
                src={aboutDashboard}
                alt="Argus ERP dashboard interface"
                className="rounded-3xl shadow-2xl w-full"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-accent/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>

          <div
            ref={content2Ref}
            className={`space-y-6 order-1 lg:order-2 transition-all duration-700 delay-300 ${
              content2Visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="inline-block px-4 py-2 bg-accent/20 text-accent-foreground rounded-full text-sm font-semibold">
              {pill2}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">{heading2}</h2>
            <p className="text-lg text-muted-foreground">{copy2a}</p>
            <p className="text-lg text-muted-foreground">{copy2b}</p>

            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 pt-4">
              {featureCards.map((f, i) => (
                <BulletRow key={`${f.title}-${i}`} title={f.title} copy={f.copy} index={i} visible={content2Visible} />
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={
                  onPrimaryCta
                    ? onPrimaryCta
                    : () => setOpen(true) // ⟵ open modal instead of scrolling
                }
                aria-label={primaryCtaText}
              >
                {primaryCtaText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal + Contact form */}
      <PageModal
        open={open}
        onOpenChange={setOpen}
        title="Talk to us"
        description="Tell us a bit about your needs—we’ll get back to you shortly."
        size="lg"
        scrollBody
        showSend
        onSend={handleModalSend}
        isSending={isSending}
        // sendLabel="Send" // optional
      >
        <ContactUsForm
          formId={FORM_ID}
          type="demo" // or "partner" (or add a new "support" template later)
          onSuccess={handleFormSuccess}
          onSubmittingChange={setIsSending}
        />
      </PageModal>
    </section>
  );
};

export default About;
