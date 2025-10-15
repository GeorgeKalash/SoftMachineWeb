"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField } from "@/sharedComponent/FormField";

type LeadForm = {
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
};

interface DemoFormProps {
  demoForm: UseFormReturn<LeadForm>;
  onSubmitDemo: () => void;
}

export const DemoForm: React.FC<DemoFormProps> = ({ demoForm, onSubmitDemo }) => {
  const errors = demoForm.formState.errors;

  return (
    <form className="space-y-4" onSubmit={onSubmitDemo}>
      <FormField
        name="name"
        label="Name"
        placeholder="Jane Doe"
        register={demoForm.register}
        error={errors.name?.message as string}
      />

      <FormField
        name="phone"
        type="tel"
        label="Phone"
        placeholder="+961 70 123 456"
        register={demoForm.register}
        error={errors.phone?.message as string}
      />

      <FormField
        name="email"
        type="email"
        label="Email"
        placeholder="jane@company.com"
        register={demoForm.register}
        error={errors.email?.message as string}
      />

      <FormField
        name="company"
        label="Company"
        placeholder="Acme Inc."
        register={demoForm.register}
        error={errors.company?.message as string}
      />

      <FormField
        name="message"
        label="Message"
        placeholder="Tell us what you'd like to see in the demo."
        register={demoForm.register}
        textarea
        rows={5}
        error={errors.message?.message as string}
      />
    </form>
  );
};
