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

interface DemoFormProps {
  demoForm: UseFormReturn<LeadForm>;
  onSubmitDemo: () => void;
}

export const DemoForm: React.FC<DemoFormProps> = ({ demoForm, onSubmitDemo }) => {
  return (
    <form className="space-y-4" onSubmit={onSubmitDemo}>
      {/* name */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Name</label>
        <input
          {...demoForm.register("name")}
          type="text"
          placeholder="Jane Doe"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
        />
        {demoForm.formState.errors.name && (
          <p className="text-xs text-red-500">{demoForm.formState.errors.name.message}</p>
        )}
      </div>

      {/* phone */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Phone</label>
        <input
          {...demoForm.register("phone")}
          type="tel"
          placeholder="+961 70 123 456"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
        />
        {demoForm.formState.errors.phone && (
          <p className="text-xs text-red-500">{demoForm.formState.errors.phone.message}</p>
        )}
      </div>

      {/* email */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Email</label>
        <input
          {...demoForm.register("email")}
          type="email"
          placeholder="jane@company.com"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
        />
        {demoForm.formState.errors.email && (
          <p className="text-xs text-red-500">{demoForm.formState.errors.email.message}</p>
        )}
      </div>

      {/* company */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Company</label>
        <input
          {...demoForm.register("company")}
          type="text"
          placeholder="Acme Inc."
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none"
        />
        {demoForm.formState.errors.company && (
          <p className="text-xs text-red-500">{demoForm.formState.errors.company.message}</p>
        )}
      </div>

      {/* message */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Message</label>
        <textarea
          {...demoForm.register("message")}
          rows={5}
          placeholder="Tell us what you'd like to see in the demo."
          className="w-full rounded-md border bg-background p-3 text-sm outline-none"
        />
        {demoForm.formState.errors.message && (
          <p className="text-xs text-red-500">{demoForm.formState.errors.message.message}</p>
        )}
      </div>
    </form>
  );
};
