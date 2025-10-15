"use client";

import React from "react";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

type BaseProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label: string;
  register: UseFormRegister<TFieldValues>;
  error?: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  className?: string;
};

export function FormField<TFieldValues extends FieldValues>({
  name,
  label,
  register,
  error,
  placeholder,
  type = "text",
  textarea = false,
  rows = 5,
  className = "",
}: BaseProps<TFieldValues>) {
  const id = `field-${String(name)}`;
  const base =
    "w-full rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {textarea ? (
        <textarea
          id={id}
          {...register(name)}
          placeholder={placeholder}
          rows={rows}
          aria-invalid={!!error}
          className={`${base} p-3 ${className}`}
        />
      ) : (
        <input
          id={id}
          {...register(name)}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={`${base} h-10 px-3 ${className}`}
        />
      )}

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
