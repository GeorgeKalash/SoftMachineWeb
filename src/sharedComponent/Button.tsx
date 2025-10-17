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
  color?: "primary" | "secondary" | "danger" | "ghost" | "link" | "outline";
  size?: "sm" | "lg" | "default" | "icon";
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

/** Use `!` to beat shadcn hover styles; repeat same color on hover/active */
function lockedColorClasses(color?: SharedButtonProps["color"], forceOutline?: boolean) {
  if (forceOutline || color === "outline") {
    return [
      "!border-blue-600 !text-blue-700",
      "hover:!bg-transparent hover:!text-blue-700",
      "active:!bg-transparent focus-visible:!ring-blue-600",
    ].join(" ");
  }

  switch (color) {
    case "secondary":
      return [
        "!bg-gray-600 !text-white",
        "hover:!bg-gray-600 active:!bg-gray-600",
        "focus-visible:!ring-gray-600",
      ].join(" ");
    case "danger":
      return [
        "!bg-red-600 !text-white",
        "hover:!bg-red-600 active:!bg-red-600",
        "focus-visible:!ring-red-600",
      ].join(" ");
    case "ghost":
      return [
        "!text-gray-700 !bg-transparent",
        "hover:!bg-transparent hover:!text-gray-700",
        "active:!bg-transparent focus-visible:!ring-gray-300",
      ].join(" ");
    case "link":
      return [
        "!text-blue-600",
        "hover:!text-blue-600 hover:!no-underline",
        "active:!text-blue-600",
      ].join(" ");
    case "primary":
    default:
      return [
        "!bg-blue-600 !text-white",
        "hover:!bg-blue-600 active:!bg-blue-600",
        "focus-visible:!ring-blue-600",
      ].join(" ");
  }
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
  const hardLock = lockedColorClasses(color, outline);

  const content = (
    <Button
      id={id}
      type={type}
      variant={variant}
      size={logo ? "icon" : size}
      disabled={disabled}
      onClick={onClick}
      className={[
        // disable color shifts on hover/active; keep motion minimal
        "transition-colors",
        hardLock,
        // optional ring when "active" prop is true (keep hue identical)
        active ? "!ring-2 !ring-offset-2 !ring-blue-600" : "",
        logo ? "p-0 w-10 h-10" : "",
        className || "",
      ].join(" ")}
    >
      {logo ? (
        <img
          src={logo}
          alt="logo"
          className="w-[22px] h-[22px] object-contain"
        />
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

