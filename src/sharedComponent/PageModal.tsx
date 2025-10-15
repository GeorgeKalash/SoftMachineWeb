// src/components/shared/PageModal.tsx
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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Save, Send, X } from "lucide-react";

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
  widthClassName?: string;   // override width
  heightClassName?: string;  // override height (e.g., "max-h-[90vh]")
  contentClassName?: string;
  bodyClassName?: string;

  showFooter?: boolean;
  showSend?: boolean;
  showSave?: boolean;
  showClose?: boolean;

  onSend?: () => void;
  onSave?: () => void;
  onClose?: () => void;

  isSending?: boolean;
  isSaving?: boolean;

  footerExtra?: React.ReactNode;
}

const sizeMap: Record<ModalSize, string> = {
  sm:  "sm:max-w-md",
  md:  "sm:max-w-lg",
  lg:  "sm:max-w-2xl",
  xl:  "sm:max-w-4xl",
  // new big bois:
  "2xl": "sm:max-w-6xl",
  "3xl": "sm:max-w-7xl",
  // take almost the full viewport width on larger screens
  full: "sm:max-w-none w-[96vw] lg:w-[90vw]",
};

/** Force-colored icon buttons (default colored, darker on hover, disabled = gray) */
const colorBtn = (color: "green" | "blue" | "red", disabled?: boolean) =>
  cn(
    "inline-flex items-center justify-center rounded-md h-10 w-10",
    "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    disabled ? "!text-white" : "!text-white",
    disabled
      ? "!bg-gray-400 hover:!bg-gray-400 focus:!ring-gray-300"
      : color === "green"
      ? "!bg-green-500 hover:!bg-green-600 focus:!ring-green-500"
      : color === "blue"
      ? "!bg-blue-500 hover:!bg-blue-600 focus:!ring-blue-500"
      : "!bg-red-500 hover:!bg-red-600 focus:!ring-red-500"
  );

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
  showSave = true,
  onSend,
  onSave,
  onClose,
  isSending = false,
  isSaving = false,
  footerExtra,
}: PageModalProps) {
  const width = widthClassName ?? sizeMap[size];
  // Cap overall modal height; body will scroll within
  const height = heightClassName ?? "max-h-[80vh]";

  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[calc(100vw-2rem)] p-0",
          width,
          height,
          "overflow-hidden",
          "flex flex-col", // critical: stack header/body/footer and allow body to grow
          contentClassName
        )}
      >
        {(title || description || headerExtra ) && (
          <DialogHeader className="border-b px-6 py-4 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {title && <DialogTitle className="truncate">{title}</DialogTitle>}
                {description && (
                  <DialogDescription className="mt-1">
                    {description}
                  </DialogDescription>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {headerExtra}
              
              </div>
            </div>
          </DialogHeader>
        )}

        {/* Body: grows to fill remaining space and becomes scroll container (if enabled) */}
        <div
          className={cn(
            "px-6 py-5",
            "flex-1 min-h-0",              // allow internal overflow within flex parent
            scrollBody && "overflow-y-auto",
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <DialogFooter className="border-t px-4 py-3 shrink-0">
            <div className="flex w-full items-center justify-between">
              {/* Left: nothing now, reserved for future (e.g., cancel) */}
              <div className="flex items-center gap-2">
                {/* Placeholder / add left-side actions here if needed */}
              </div>

              {/* Right: Extra + Save + Send */}
              <div className="flex items-center gap-2">
                {footerExtra}

                <TooltipProvider>
                  {showSave && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="default"
                          type="button"
                          size="icon"
                          onClick={onSave}
                          disabled={isSaving}
                          className={colorBtn("green", isSaving)}
                          aria-label="Save"
                        >
                          <Save className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isSaving ? "Saving..." : "Save"}
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {showSend && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="default"
                          type="button"
                          size="icon"
                          onClick={onSend}
                          disabled={isSending}
                          className={colorBtn("blue", isSending)}
                          aria-label="Send"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isSending ? "Sending..." : "Send"}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PageModal;
