"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";

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
  return (
    <form className="space-y-4" onSubmit={onSubmitPartner}>
      {/* name */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Name</label>
        <input
          {...partnerForm.register("name")}
          type="text"
          placeholder="John Smith"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
        />
        {partnerForm.formState.errors.name && (
          <p className="text-xs text-red-500">{partnerForm.formState.errors.name.message}</p>
        )}
      </div>

      {/* phone */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Phone</label>
        <input
          {...partnerForm.register("phone")}
          type="tel"
          placeholder="+961 3 555 555"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
        />
        {partnerForm.formState.errors.phone && (
          <p className="text-xs text-red-500">{partnerForm.formState.errors.phone.message}</p>
        )}
      </div>

      {/* email */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Email</label>
        <input
          {...partnerForm.register("email")}
          type="email"
          placeholder="partner@company.com"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
        />
        {partnerForm.formState.errors.email && (
          <p className="text-xs text-red-500">{partnerForm.formState.errors.email.message}</p>
        )}
      </div>

      {/* company */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Company</label>
        <input
          {...partnerForm.register("company")}
          type="text"
          placeholder="Your Organization"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
        />
        {partnerForm.formState.errors.company && (
          <p className="text-xs text-red-500">{partnerForm.formState.errors.company.message}</p>
        )}
      </div>

      {/* message */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Message</label>
        <textarea
          {...partnerForm.register("message")}
          rows={5}
          placeholder="Describe your partnership focus and market."
          className="w-full rounded-md border bg-background p-3 text-sm outline-none"
        />
        {partnerForm.formState.errors.message && (
          <p className="text-xs text-red-500">{partnerForm.formState.errors.message.message}</p>
        )}
      </div>
    </form>
  );
};
