"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/sharedComponent/FormField";

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(6, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(2, "Company is required"),
  message: z.string().min(5, "Please add a short message"),
});

export type LeadForm = z.infer<typeof leadSchema>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type SubmitType = "demo" | "partner";
type SimulateMode = "success" | "fail" | "random";


async function sendLead(
  payload: LeadForm & { type: SubmitType },
  opts?: {
    mock?: boolean;
    simulate?: SimulateMode;   
    delayMs?: number;          
  }
) {
  const { mock = false, simulate = "success", delayMs = 900 } = opts || {};

  if (mock) {
    await sleep(delayMs);
    const shouldSucceed =
      simulate === "success" || (simulate === "random" && Math.random() >= 0.5);

    if (shouldSucceed) {
      return {
        ok: true,
        message: "Mock submission succeeded",
        echo: payload,
      };
    }
    throw new Error("Mock submission failed");
  }

  // Real request path (plug your API here later)
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw new Error((await res.text().catch(() => "")) || "Failed to send email");
  return res.json().catch(() => ({}));
}

interface NavgationFormProps {
  formId?: string;

  type: SubmitType;

  onSuccess?: (result: unknown) => void;

  onSubmittingChange?: (submitting: boolean) => void;

  mock?: boolean;               
  simulate?: SimulateMode;       
  mockDelayMs?: number;         

  showSubmitButton?: boolean;
  submitLabel?: string;
}

export const NavgationForm: React.FC<NavgationFormProps> = ({
  formId,
  type,
  onSuccess,
  onSubmittingChange,
  mock = true,         
  simulate = "fail", 
  mockDelayMs = 900,
  showSubmitButton = false,
  submitLabel = "Submit",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", company: "", message: "" },
  });

  const [submitting, setSubmitting] = useState(false);

  // Reflect submitting to parent (to disable modal button)
  const setSubmittingBoth = (v: boolean) => {
    setSubmitting(v);
    onSubmittingChange?.(v);
  };

  const onSubmit = async (data: LeadForm) => {
    try {
      setSubmittingBoth(true);
      const result = await sendLead(
        { ...data, type },
        { mock, simulate, delayMs: mockDelayMs }
      );
      onSuccess?.(result);
      reset(); 
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      console.error(msg);
      alert(msg);
    } finally {
      setSubmittingBoth(false);
    }
  };

  return (
    <form id={formId} className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

      {showSubmitButton && (
        <button type="submit" className="hidden" disabled={submitting}>
          {submitLabel}
        </button>
      )}
    </form>
  );
};

export default NavgationForm;
