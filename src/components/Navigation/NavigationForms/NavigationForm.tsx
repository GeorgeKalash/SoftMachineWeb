
"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser"; 
import { FormField } from "@/sharedComponent/FormField";

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(6, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(2, "Company is required"),
  message: z.string().min(5, "Please add a short message"),
});

export type LeadForm = z.infer<typeof leadSchema>;

type SubmitType = "demo" | "partner";

interface NavgationFormProps {
  formId?: string;
  type: SubmitType;

  onSuccess?: (result: unknown) => void;
  onSubmittingChange?: (submitting: boolean) => void;

  /** keep your modal’s external submit button behavior */
  showSubmitButton?: boolean;
  submitLabel?: string;
}

/** Use env when available; fallback to the same IDs you used on the other site */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "gmailService";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_rjbetfo";
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "qxG8BN4BBGtSYpX3g";

export const NavgationForm: React.FC<NavgationFormProps> = ({
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
    formState: { errors },
    reset,
    watch,
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", company: "", message: "" },
  });

  const [submitting, setSubmitting] = useState(false);
  const watchName = watch("name");
  const watchEmail = watch("email");

  const setSubmittingBoth = (v: boolean) => {
    setSubmitting(v);
    onSubmittingChange?.(v);
  };

  const onSubmit = async () => {
    if (!formRef.current) return;

    try {
      setSubmittingBoth(true);

      // Send the actual form DOM so EmailJS can read fields by name
      const res = await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );

      if (res.text === "OK") {
        onSuccess?.({ ok: true, type });
        reset();
        // Optional: toast here if you have a ToastContainer on the page
        // toast.success("Your email has been sent");
      } else {
        throw new Error("Failed to send email");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      console.error(msg);
      alert(msg); // or toast.error(msg)
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
      {/* Visible fields (react-hook-form controlled) */}
      <FormField
        name="name"
        label="Name"
        placeholder="Jane Doe"
        register={register}
        error={errors.name?.message}
      />

      <FormField
        name="phone"
        type="tel"
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

      {/* Hidden mirrors so the EmailJS template gets the SAME expected names */}
      <input type="hidden" name="from_name" value={watchName || ""} readOnly />
      <input type="hidden" name="from_email" value={watchEmail || ""} readOnly />
      {/* If your template needs `type`, pass it too */}
      <input type="hidden" name="lead_type" value={type} readOnly />

      {/* Hidden button so an external modal/footer button can trigger submit */}
      {showSubmitButton && (
        <button type="submit" className="hidden" disabled={submitting}>
          {submitLabel}
        </button>
      )}
    </form>
  );
};

export default NavgationForm;
