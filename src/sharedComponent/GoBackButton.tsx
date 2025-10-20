// src/shared/GoBackButton.tsx
"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;           // text next to the icon
  fallbackTo?: string;      // where to go if history is empty
  variant?: "ghost" | "secondary" | "outline" | "default";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function GoBackButton({
  label = "Go back",
  fallbackTo = "/",
  variant = "ghost",
  size = "sm",
  className,
  onClick,
}: Props) {
  const navigate = useNavigate();
  const canGoBack =
    typeof window !== "undefined" && window.history.length > 1;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (canGoBack) navigate(-1);
    else navigate(fallbackTo);
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("inline-flex items-center gap-2", className)}
      aria-label={label}
    >
      <ArrowLeft className="h-4 w-4" />
      {size !== "icon" && <span>{label}</span>}
    </Button>
  );
}
