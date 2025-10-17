// src/components/shared/PageModal.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SharedButton } from "@/sharedComponent/Button";

/* ---------------- utils ---------------- */
function useMediaQuery(query: string) {
  const get = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;
  const [matches, setMatches] = React.useState(get);
  React.useEffect(() => {
    const m = window.matchMedia(query);
    const listener = () => setMatches(m.matches);
    m.addEventListener?.("change", listener);
    return () => m.removeEventListener?.("change", listener);
  }, [query]);
  return matches;
}

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

interface PageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;
  headerExtra?: React.ReactNode;

  children?: React.ReactNode;
  /** If true, the modal body becomes the scroll container */
  scrollBody?: boolean;

  size?: ModalSize;
  widthClassName?: string;   // override width (desktop)
  heightClassName?: string;  // override height (desktop) e.g. "max-h-[90vh]"
  contentClassName?: string;
  bodyClassName?: string;

  showFooter?: boolean;
  showSend?: boolean;

  onSend?: () => void;
  onClose?: () => void;

  isSending?: boolean;

  footerExtra?: React.ReactNode;

  /** Mobile only: render as bottom sheet instead of centered dialog */
  mobileAsSheet?: boolean; // default true
  /** Mobile sheet height (fallback 85svh) */
  mobileHeightClassName?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm:  "sm:max-w-md",
  md:  "sm:max-w-lg",
  lg:  "sm:max-w-2xl",
  xl:  "sm:max-w-4xl",
  "2xl": "sm:max-w-6xl",
  "3xl": "sm:max-w-7xl",
  full: "sm:max-w-none w-[96vw] lg:w-[90vw]",
};

const colorBtn = (color: "green" | "blue", disabled?: boolean) =>
  cn(
    "inline-flex items-center justify-center rounded-md h-10 w-10 !text-white",
    "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    disabled
      ? "!bg-gray-400 hover:!bg-gray-400 focus:!ring-gray-300"
      : color === "green"
      ? "!bg-green-500 hover:!bg-green-600 focus:!ring-green-500"
      : "!bg-blue-500 hover:!bg-blue-600 focus:!ring-blue-500"
  );

/* ---------------- component ---------------- */
export function PageModal({
  open,
  onOpenChange,
  title,
  description,
  headerExtra,
  children,
  scrollBody = false,
  size = "md",
  widthClassName,
  heightClassName,
  contentClassName,
  bodyClassName,
  showFooter = true,
  showSend = true,
  onSend,
  onClose,
  isSending = false,
  footerExtra,
  mobileAsSheet = true,
  mobileHeightClassName, // e.g. "h-[85svh]" or "max-h-[85svh]"
}: PageModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const width = widthClassName ?? sizeMap[size];
  const height = heightClassName ?? "max-h-[80vh]";
  const mobileHeight = mobileHeightClassName ?? "h-[85svh]"; // safe viewport height for mobile browsers

  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  /* --------- MOBILE: bottom sheet --------- */
  if (!isDesktop && mobileAsSheet) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={cn(
            "p-0 flex flex-col rounded-t-2xl overflow-hidden",
            mobileHeight,
            contentClassName
          )}
        >
          {/* drag handle (subtle) */}
          <div className="mx-auto mt-2 mb-1 h-1.5 w-10 rounded-full bg-muted" />

          <SheetHeader className="px-5 py-3 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {title && <SheetTitle className="truncate text-base">{title}</SheetTitle>}
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                )}
              </div>
             
            </div>
          </SheetHeader>

          <div
            className={cn(
              "px-5 py-4 flex-1 min-h-0",
              scrollBody && "overflow-y-auto",
              bodyClassName
            )}
          >
            {children}
          </div>

          {showFooter && (
            <div className="border-t px-4 py-3">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2" />
                <div className="flex items-center gap-2">
                  {footerExtra}
             
                  {showSend && (
          <SharedButton
            title={ "Send" } 
            type="button"
            onClick={onSend}
            color="primary"
            size="sm"
            disabled={isSending}
          />
        )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  /* --------- DESKTOP: centered dialog --------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[calc(100vw-2rem)] p-0",
          width,
          height,
          "overflow-hidden flex flex-col",
          contentClassName
        )}
      >
        {(title || description || headerExtra) && (
          <DialogHeader className="border-b px-6 py-4 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {title && <DialogTitle className="truncate">{title}</DialogTitle>}
                {description && (
                  <DialogDescription className="mt-1">{description}</DialogDescription>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {headerExtra}
               
              </div>
            </div>
          </DialogHeader>
        )}

        <div
          className={cn(
            "px-6 py-5 flex-1 min-h-0",
            scrollBody && "overflow-y-auto",
            bodyClassName
          )}
        >
          {children}
        </div>

        {showFooter && (
          <DialogFooter className="border-t px-4 py-3 shrink-0">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2" />
              <div className="flex items-center gap-2">
                {footerExtra}
             
                {showSend && (
      <SharedButton
      title={ "Send" } 
      type="button"
      onClick={onSend}
      color="primary"
      size="sm"
      disabled={isSending}
    />
        )}
              </div>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PageModal;
