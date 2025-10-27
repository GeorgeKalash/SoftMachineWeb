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
import { ContactUsForm } from "@/components/ContactUs/ContactUsForm"; // <- adjust path if needed

const faqs = [
  { question: "Can Argus integrate with my existing systems (POS, website, etc.)?",
    answer:
      "Yes. Argus is designed to seamlessly integrate with existing POS systems, websites, accounting platforms, and other third-party tools through secure APIs and connectors. Our team can also assist with any custom integration you need.",
  },
  { question: "Is it customizable to our business needs?",
    answer:
      "Absolutely. Argus is fully modular and customizable. You can enable only the modules you need and tailor workflows, reports, and user roles to match your business operations precisely.",
  },
  { question: "Is it subscription-based or a one-time license?",
    answer:
      "Argus is available as both a subscription-based SaaS solution and a one-time on-premise license, depending on your business requirements and IT preferences.",
  },
  { question: "How long does implementation take?",
    answer:
      "Implementation time varies based on your setup size and required integrations. For most businesses, a full deployment takes between 2 to 6 weeks, including setup, customization, and staff training.",
  },
  { question: "How secure is our data?",
    answer:
      "Data security is one of our top priorities. Argus uses 256-bit SSL encryption, multi-layered access control, and is hosted on secure, audited infrastructure. We also follow GDPR and ISO data protection standards.",
  },
  { question: "Can we import data from existing systems?",
    answer:
      "Yes. Our onboarding team assists with importing and migrating data from your current systems, ensuring a smooth and lossless transition to Argus.",
  },
  { question: "Does Argus have a mobile app for reporting, approvals, etc.?",
    answer:
      "Yes. The Argus mobile app allows users to manage approvals, monitor operations, and view real-time reports directly from their smartphones, whether on Android or iOS.",
  },
  { question: "What type of customer support does SoftMachine offer?",
    answer:
      "SoftMachine provides multi-channel support including email, live chat, and phone. Enterprise clients also benefit from a dedicated account manager and on-site assistance when needed.",
  },
];

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
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Have questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for,
              feel free to contact our support team.
            </p>
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
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-muted/30 rounded-xl px-6 border-none">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
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
            <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
            </p>

            {/* Open the modal with the same ContactUsForm */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center text-primary hover:underline font-semibold"
              aria-label="Contact Support"
            >
              Contact Support →
            </button>
          </div>
        </div>
      </div>

      {/* Reusable modal+form (uses the same pattern as Navigation) */}
      <PageModal
        open={open}
        onOpenChange={setOpen}
        title="Contact support"
        description="Tell us what you need help with and we’ll get back to you."
        size="lg"
        scrollBody
        showSend
        onSend={handleModalSend}
        isSending={isSending}
        // sendLabel="Send" // optional
      >
        {/* Reuse the existing form; pick a type. If you later add 'support' as a type, switch it here. */}
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
