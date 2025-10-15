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

interface PartnerFormProps {
  partnerForm: UseFormReturn<LeadForm>;
  onSubmitPartner: () => void;
}

export const PartnerForm: React.FC<PartnerFormProps> = ({ partnerForm, onSubmitPartner }) => {
  const {
    register,
    formState: { errors },
  } = partnerForm;

  return (
    <form className="space-y-4" onSubmit={onSubmitPartner}>
      <FormField
        name="name"
        label="Name"
        placeholder="John Smith"
        register={register}
        error={errors.name?.message}
      />

      <FormField
        name="phone"
        type="tel"
        label="Phone"
        placeholder="+961 3 555 555"
        register={register}
        error={errors.phone?.message}
      />

      <FormField
        name="email"
        type="email"
        label="Email"
        placeholder="partner@company.com"
        register={register}
        error={errors.email?.message}
      />

      <FormField
        name="company"
        label="Company"
        placeholder="Your Organization"
        register={register}
        error={errors.company?.message}
      />

      <FormField
        name="message"
        label="Message"
        textarea
        rows={5}
        placeholder="Describe your partnership focus and market."
        register={register}
        error={errors.message?.message}
      />
    </form>
  );
};
