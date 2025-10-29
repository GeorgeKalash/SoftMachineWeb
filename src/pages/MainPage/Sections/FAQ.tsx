"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { PageModal } from "@/sharedComponent/PageModal";
import { ContactUsForm } from "@/components/ContactUs/ContactUsForm";
import siteData from "@/SiteData/SiteData.json";

const FORM_ID = "faq-support-form";

const FAQ: React.FC = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: accordionRef, isVisible: accordionVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  // Modal + submit state
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleModalSend = () => {
    const form = document.getElementById(FORM_ID) as HTMLFormElement | null;
    if (!form) return;
    if (typeof form.requestSubmit === "function") form.requestSubmit();
    else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };

  const handleFormSuccess = () => setOpen(false);

  const header = siteData.faq.header;
  const items = siteData.faq.items || [];
  const cta = siteData.faq.cta;
  const modal = siteData.faq.modal;

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div
            ref={headerRef}
            className={`text-center mb-16 transition-all duration-700 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">{header.title}</h2>
            <p className="text-xl text-muted-foreground">{header.subtitle}</p>
          </div>

          {/* FAQ Accordion */}
          <Accordion
            ref={accordionRef}
            type="single"
            collapsible
            className={`space-y-4 transition-all duration-700 delay-300 ${
              accordionVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {items.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-muted/30 rounded-xl px-6 border-none">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg pr-4">{faq.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div
            ref={ctaRef}
            className={`mt-16 text-center p-8 bg-muted/30 rounded-2xl transition-all duration-700 delay-500 ${
              ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-2xl font-bold mb-3">{cta.title}</h3>
            <p className="text-muted-foreground mb-6">{cta.subtitle}</p>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center text-primary hover:underline font-semibold"
              aria-label="Contact Support"
            >
              {cta.label}
            </button>
          </div>
        </div>
      </div>

      {/* Reusable modal+form */}
      <PageModal
        open={open}
        onOpenChange={setOpen}
        title={modal.title}
        description={modal.description}
        size="lg"
        scrollBody
        showSend
        onSend={handleModalSend}
        isSending={isSending}
      >
        <ContactUsForm
          formId={FORM_ID}
          type="demo" // or "partner". If you add a "support" template, use type="support".
          onSuccess={handleFormSuccess}
          onSubmittingChange={setIsSending}
        />
      </PageModal>
    </section>
  );
};

export default FAQ;
