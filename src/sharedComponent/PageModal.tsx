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

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

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

/** Lock body scroll & tame iOS overscroll bounce while a modal/sheet is open. */
function useBodyScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked || typeof document === "undefined") return;
    const { overflow, overscrollBehaviorY } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehaviorY = "contain";
    return () => {
      document.body.style.overflow = overflow || "";
      document.body.style.overscrollBehaviorY = overscrollBehaviorY || "";
    };
  }, [locked]);
}

/* -------------------------------------------------------------------------- */
/* Types & Sizing                                                             */
/* -------------------------------------------------------------------------- */

type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

interface PageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;
  headerExtra?: React.ReactNode;

  children?: React.ReactNode;
  scrollBody?: boolean;

  size?: ModalSize;
  widthClassName?: string;
  heightClassName?: string;
  contentClassName?: string;
  bodyClassName?: string;

  showFooter?: boolean;
  showSend?: boolean;

  onSend?: () => void;
  onClose?: () => void;

  isSending?: boolean;

  footerExtra?: React.ReactNode;

  mobileAsSheet?: boolean;
  mobileHeightClassName?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  "2xl": "sm:max-w-6xl",
  "3xl": "sm:max-w-7xl",
  full: "sm:max-w-none w-[96vw] lg:w-[90vw]",
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

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
  mobileHeightClassName,
}: PageModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  useBodyScrollLock(open);

  // Use stable viewport units to prevent iOS Safari jumps when the URL bar collapses/expands.
  const width = widthClassName ?? sizeMap[size];
  const height = heightClassName ?? "max-h-[min(80dvh,80svh)]";
  const mobileHeight = mobileHeightClassName ?? "h-[min(92svh,92dvh)]";

  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  if (!isDesktop && mobileAsSheet) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={cn(
            "p-0 flex flex-col rounded-t-2xl overflow-hidden will-change-transform",
            mobileHeight,
            // Safe area for iOS home indicator:
            "pb-[env(safe-area-inset-bottom)]",
            contentClassName
          )}
        >
          <div className="mx-auto mt-2 mb-1 h-1.5 w-10 rounded-full bg-muted" />
          <SheetHeader className="px-5 py-3 border-b bg-background/80 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {title && <SheetTitle className="truncate text-base">{title}</SheetTitle>}
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              {headerExtra}
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
                      title="Send"
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
        onEscapeKeyDown={handleClose}
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
              <div className="flex items-center gap-2 shrink-0">{headerExtra}</div>
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
                    title="Send"
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
