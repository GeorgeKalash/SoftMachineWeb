"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SharedButtonProps = {
  title?: string;
  /** semantic color */
  color?: "primary" | "secondary" | "danger" | "ghost" | "link" | "outline";
  size?: "sm" | "lg" | "default" | "icon";
  /** force outline styling for the chosen color */
  outline?: boolean;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  id?: string;
  tooltip?: string;
  onClick?: () => void;
  logo?: string;
  type?: "button" | "submit" | "reset";
};

function mapVariant(
  color?: SharedButtonProps["color"],
  forceOutline?: boolean
): "default" | "destructive" | "secondary" | "ghost" | "link" | "outline" {
  if (forceOutline || color === "outline") return "outline";
  switch (color) {
    case "ghost":
      return "ghost";
    case "link":
      return "link";
    case "danger":
      return "destructive";
    case "secondary":
      return "secondary";
    case "primary":
    default:
      return "default";
  }
}

/** Additional semantic tweaks without hardcoding hues */
function semanticClasses(
  color?: SharedButtonProps["color"],
  forceOutline?: boolean,
  active?: boolean,
  hasLogo?: boolean
) {
  const base: string[] = ["transition-colors"];

  // Active ring should match the semantic color
  if (active) {
    // Use ring tokens that align with selected variant
    switch (color) {
      case "secondary":
        base.push("ring-2 ring-offset-2 ring-secondary");
        break;
      case "danger":
        base.push("ring-2 ring-offset-2 ring-destructive");
        break;
      case "ghost":
        base.push("ring-2 ring-offset-2 ring-muted");
        break;
      case "link":
        base.push("ring-2 ring-offset-2 ring-primary");
        break;
      case "primary":
      default:
        base.push("ring-2 ring-offset-2 ring-primary");
        break;
    }
  }

  // Outline variant should inherit the semantic border/text color without hardcoding
  if (forceOutline || color === "outline") {
    // Add light semantic nudge: for outline + "primary", ensure primary border/text
    base.push("border-current");
    switch (color) {
      case "secondary":
        base.push("text-secondary");
        break;
      case "danger":
        base.push("text-destructive");
        break;
      case "ghost":
        base.push("text-muted-foreground");
        break;
      case "link":
        base.push("text-primary");
        break;
      case "primary":
      default:
        base.push("text-primary");
        break;
    }
  }

  if (hasLogo) {
    base.push("p-0 w-10 h-10");
  }

  return base.join(" ");
}

export const SharedButton: React.FC<SharedButtonProps> = ({
  title,
  color = "primary",
  size = "default",
  outline = false,
  disabled = false,
  active = false,
  className = "",
  id,
  onClick,
  tooltip,
  logo,
  type = "button",
}) => {
  const variant = mapVariant(color, outline);
  const extras = semanticClasses(color, outline, active, Boolean(logo));

// SharedButton.tsx – only change is the `className` compose

const content = (
  <Button
    id={id}
    type={type}
    variant={variant}
    size={logo ? "icon" : size}
    disabled={disabled}
    onClick={onClick}
    className={[
      // keep smooth color transition
      "transition-colors",
      // ✅ kill the opacity-based hover from shadcn and use solid darkening
      "!bg-[hsl(var(--primary))] !text-[hsl(var(--primary-foreground))]",
      "!hover:bg-[hsl(var(--primary))] hover:brightness-90", // darker red on hover
      "!active:bg-[hsl(var(--primary))] active:brightness-75", // even darker on active
      active ? "!ring-2 !ring-offset-2 !ring-primary" : "",
      logo ? "p-0 w-10 h-10" : "",
      className || "",
    ].join(" ")}
  >
    {logo ? (
      <img src={logo} alt="logo" className="w-[22px] h-[22px] object-contain" />
    ) : (
      title
    )}
  </Button>
);


  if (!tooltip) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="top">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SharedButton;
