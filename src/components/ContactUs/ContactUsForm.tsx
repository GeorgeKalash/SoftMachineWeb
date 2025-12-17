"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import { FormField } from "@/sharedComponent/FormField";
import { toast } from "@/hooks/use-toast";

/* ---------------- Schema ---------------- */
const leadSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(6, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(2, "Company is required"),
  message: z.string().min(5, "Please add a short message"),
});
export type LeadForm = z.infer<typeof leadSchema>;

type SubmitType = "demo" | "partner" | "support";

interface ContactUsFormProps {
  formId?: string;
  type: SubmitType;
  onSuccess?: (result: unknown) => void;
  onSubmittingChange?: (submitting: boolean) => void;
  showSubmitButton?: boolean;
  submitLabel?: string;
}

/* ---------------- EmailJS config ---------------- */
const SERVICE_ID = "gmailService";
const TEMPLATE_ID_SHARED = "template_50bhfuh"; 
const PUBLIC_KEY = "qxG8BN4BBGtSYpX3g";

/* ---------------- Recipient per type ---------------- */
const TO_EMAIL_BY_TYPE: Record<SubmitType, string> = {
  demo: "info@softmachine.co",
  partner: "info@softmachine.co",
  support: "info@softmachine.co",
};
/* ---------------- Recipients (many) per type  ---------------- */
// const TO_EMAIL_BY_TYPE: Record<SubmitType, string> = {
//   demo: "info@softmachine.co",
//   partner: "info@softmachine.co,info@softmachine.co,info@softmachine.co",
//   support: "info@softmachine.co",
// };

export const ContactUsForm: React.FC<ContactUsFormProps> = ({
  formId,
  type,
  onSuccess,
  onSubmittingChange,
  showSubmitButton = false,
  submitLabel = "Submit",
}) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", company: "", message: "" },
  });

  const [sending, setSending] = useState(false);

  const watchName = watch("name");
  const watchEmail = watch("email");
  const toEmail = TO_EMAIL_BY_TYPE[type];

  const setSubmittingBoth = (v: boolean) => {
    setSending(v);
    onSubmittingChange?.(v);
  };

  const onSubmit = async () => {
    if (!formRef.current) return;

    try {
      setSubmittingBoth(true);
      emailjs.init(PUBLIC_KEY);

      const res = await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID_SHARED,
        formRef.current,
        PUBLIC_KEY
      );

      if (res.text === "OK") {
        onSuccess?.({ ok: true, type });
        reset();
        return;
      }

      throw new Error("Failed to send email");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      console.error(e);
      toast({
        title: "Could not send",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSubmittingBoth(false);
    }
  };

  return (
    <form
      id={formId}
      ref={formRef}
      className="space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        name="name"
        label="Name"
        placeholder="Jane Doe"
        register={register}
        error={errors.name?.message}
      />

      <FormField
        name="phone"
        type="number"
        label="Phone"
        placeholder="+961 70 123 456"
        register={register}
        error={errors.phone?.message}
      />

      <FormField
        name="email"
        type="email"
        label="Email"
        placeholder="jane@company.com"
        register={register}
        error={errors.email?.message}
      />

      <FormField
        name="company"
        label="Company"
        placeholder="Acme Inc."
        register={register}
        error={errors.company?.message}
      />

      <FormField
        name="message"
        label="Message"
        placeholder="Tell us what you'd like to see."
        textarea
        rows={5}
        register={register}
        error={errors.message?.message}
      />

      <input type="hidden" name="from_name" value={watchName || ""} readOnly />
      <input type="hidden" name="from_email" value={watchEmail || ""} readOnly />
      <input type="hidden" name="lead_type" value={type} readOnly />

      <input type="hidden" name="to_email" value={toEmail} readOnly />

      {showSubmitButton && (
        <button type="submit" className="hidden" disabled={sending || isSubmitting}>
          {submitLabel}
        </button>
      )}
    </form>
  );
};

export default ContactUsForm;
