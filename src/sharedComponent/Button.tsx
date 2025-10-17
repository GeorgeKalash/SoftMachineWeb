// src/components/shared/ActionIconButton.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Save, Send, X, type LucideIcon } from "lucide-react";

type Intent = "save" | "send" | "close" | "primary" | "secondary";
type Size = "icon" | "default" | "sm" | "lg";

function isCoarsePointer() {
  return typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;
}

const intentClasses = (intent: Intent, disabled?: boolean) =>
  cn(
    // base
    "inline-flex items-center justify-center rounded-md !text-white transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    // size will be controlled by Button size prop; here only colors
    disabled
      ? "!bg-gray-400 hover:!bg-gray-400 focus:!ring-gray-300"
      : intent === "save"
      ? "!bg-green-500 hover:!bg-green-600 focus:!ring-green-500"
      : intent === "send"
      ? "!bg-blue-500 hover:!bg-blue-600 focus:!ring-blue-500"
      : intent === "close"
      ? "!bg-muted-foreground/70 hover:!bg-muted-foreground focus:!ring-muted-foreground"
      : intent === "primary"
      ? "!bg-primary hover:!bg-primary/90 focus:!ring-primary"
      : "!bg-secondary-foreground hover:!bg-secondary-foreground/90 focus:!ring-secondary-foreground"
  );

const defaultIconByIntent: Record<Intent, LucideIcon | null> = {
  save: Save,
  send: Send,
  close: X,
  primary: null,
  secondary: null,
};

export interface ActionIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: Intent;
  loading?: boolean;
  tooltip?: string;
  icon?: LucideIcon;            // override icon (optional)
  size?: Size;                  // default "icon"
  tooltipOnDesktopOnly?: boolean; // default true (no tooltips on touch)
}

export const ActionIconButton: React.FC<ActionIconButtonProps> = ({
  intent = "primary",
  loading = false,
  tooltip,
  icon,
  size = "icon",
  className,
  disabled,
  tooltipOnDesktopOnly = true,
  "aria-label": ariaLabel,
  children, // if you want text instead of icon
  ...rest
}) => {
  const Coarse = isCoarsePointer();
  const Icon = icon ?? defaultIconByIntent[intent];

  const btn = (
    <Button
      type="button"
      size={size}
      className={cn(
        intentClasses(intent, disabled || loading),
        size === "icon" && "h-10 w-10",
        className
      )}
      disabled={disabled || loading}
      aria-label={ariaLabel ?? tooltip ?? intent}
      {...rest}
    >
      {loading && (
        <span
          className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"
          aria-hidden
        />
      )}
      {Icon && size === "icon" ? <Icon className="h-5 w-5" /> : children}
    </Button>
  );

  // Skip tooltips on touch devices by default
  if (!tooltip || (tooltipOnDesktopOnly && Coarse)) return btn;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{btn}</TooltipTrigger>
        <TooltipContent>{loading ? `${tooltip}...` : tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
