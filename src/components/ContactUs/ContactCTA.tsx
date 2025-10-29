"use client";

import React, { useState } from "react";
import { PageModal } from "@/sharedComponent/PageModal";
import { ContactUsForm } from "@/components/ContactUs/ContactUsForm";
import { Button } from "@/components/ui/button";

export type ContactCTAProps = {
  title: string;
  body?: string;
  className?: string;
};

export function ContactCTA({ title, body, className }: ContactCTAProps) {
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [intent, setIntent] = useState<"demo" | "partner">("demo");

  const FORM_ID = "contact-cta-form";

  const handleModalSend = () => {
    const form = document.getElementById(FORM_ID) as HTMLFormElement | null;
    if (!form) return;
    if (typeof form.requestSubmit === "function") form.requestSubmit();
    else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };

  const handleFormSuccess = () => setOpen(false);

  const openModal = (nextIntent: "demo" | "partner") => {
    setIntent(nextIntent);
    setOpen(true);
  };

  const modalTitle = intent === "partner" ? "Become a Partner" : "Schedule a Demo";
  const modalDescription =
    intent === "partner"
      ? "Tell us about your business and partnership goals—we’ll get back to you shortly."
      : "Fill in your details and we’ll schedule a product walkthrough.";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div
        className={[
          "rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-10",
          className || "",
        ].join(" ")}
      >
        <div className="grid md:grid-cols-2 items-center gap-8">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900">{title}</h3>
            {body ? <p className="mt-2 text-slate-600">{body}</p> : null}
          </div>

          <div className="flex md:justify-end gap-3">
            {/* Schedule a demo */}
            <Button
              variant="ghost"
              size="sm"
              className="border border-transparent hover:bg-white/0"
              onClick={() => openModal("demo")}
              aria-haspopup="dialog"
              aria-controls={FORM_ID}
            >
              Schedule a demo
            </Button>

            {/* Become a partner */}
            <Button size="sm" onClick={() => openModal("partner")} aria-haspopup="dialog" aria-controls={FORM_ID}>
              Become a partner
            </Button>
          </div>
        </div>
      </div>

      {/* Modal + built-in form */}
      <PageModal
        open={open}
        onOpenChange={setOpen}
        title={modalTitle}
        description={modalDescription}
        size="lg"
        scrollBody
        showSend
        onSend={handleModalSend}
        isSending={isSending}
      >
        <ContactUsForm
          formId={FORM_ID}
          type={intent}                 // <- key: pass "demo" | "partner"
          onSuccess={handleFormSuccess} // closes modal
          onSubmittingChange={setIsSending}
        />
      </PageModal>
    </div>
  );
}
