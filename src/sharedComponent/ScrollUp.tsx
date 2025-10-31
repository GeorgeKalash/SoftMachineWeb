import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * A polished scroll-to-top FAB that uses your Tailwind/shadcn "primary" color.
 * - Appears after `threshold` px scrolled
 * - Bottom-right fixed; fully accessible; respects reduced motion
 */
type ScrollToTopButtonProps = {
  threshold?: number;
  bottom?: number | string;
  right?: number | string;
  className?: string;
  /** Override the color classes if you use a different token name */
  primaryClass?: string; // e.g. "bg-primary text-primary-foreground border-primary/30 hover:bg-primary/90"
  size?: "md" | "lg";
};

export function ScrollToTopButton({
  threshold = 300,
  bottom = "1.75rem", // 7
  right = "1.75rem",  // 7
  className = "",
  primaryClass = "bg-primary text-primary-foreground border-primary/30 hover:bg-primary/90",
  size = "md",
}: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const dims =
    size === "lg"
      ? "h-14 w-14 text-[1.1rem]"
      : "h-12 w-12 text-[1rem]";

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-up-fab"
          onClick={scrollToTop}
          title="Scroll to top"
          aria-label="Scroll to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className={[
            "group fixed z-50 select-none",
            "rounded-full border shadow-lg",
            "backdrop-blur supports-[backdrop-filter]:bg-opacity-90",
            // primary color styling
            primaryClass,
            // subtle elevation + hover lift
            "shadow-black/10 hover:shadow-xl transition-shadow",
            // focus style in primary color
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/40",
            // size
            "inline-flex items-center justify-center",
            dims,
            className,
          ].join(" ")}
          style={{ bottom, right }}
        >
          {/* Soft primary glow behind the icon */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, hsl(var(--primary)/0.18) 0%, transparent 60%)",
              filter: "blur(4px)",
            }}
          />
          {/* Up arrow with subtle looped lift */}
          <motion.span
            aria-hidden
            className="relative"
            animate={
              reduceMotion ? undefined : { y: [-1, -6, -1] }
            }
            transition={
              reduceMotion ? undefined : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <ArrowUp className="h-5 w-5" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
