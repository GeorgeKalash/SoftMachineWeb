import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { SearchX, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "404 – Page not found";
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Subtle background grid + vignettes (keeps it on-brand) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Vignette */}
        <div className="absolute inset-0 opacity-[0.65] dark:opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        {/* Soft orbs */}
        <div className="absolute -top-28 -left-28 h-72 w-72 rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-foreground/5 blur-3xl" />
        {/* (Optional) faint grid — comment out if your Tailwind setup disallows arbitrary values */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <motion.div
        className="container px-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-black/5 bg-white/70 p-8 text-center shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.055]">
          {/* Animated icon */}
          <div className="mx-auto mb-6 h-16 w-16">
            <motion.div
              className="relative h-16 w-16"
              initial={reduceMotion ? false : { scale: 0.94 }}
              animate={
                reduceMotion
                  ? {}
                  : {
                      scale: [0.94, 1.02, 1.0, 0.98, 0.94],
                    }
              }
              transition={reduceMotion ? { duration: 0.4 } : { duration: 3.2, ease: "easeInOut", repeat: Infinity }}
            >
              {/* Rotating dashed ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-foreground/25 border-dashed"
                aria-hidden
                animate={reduceMotion ? {} : { rotate: 360 }}
                transition={reduceMotion ? {} : { duration: 14, ease: "linear", repeat: Infinity }}
              />
              {/* Soft glow */}
              <div className="absolute inset-0 rounded-full bg-foreground/10 blur-md" aria-hidden />
              {/* Icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={reduceMotion ? { opacity: 1 } : { rotate: 0 }}
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : { rotate: [0, -6, 0, 6, 0] }
                }
                transition={reduceMotion ? { duration: 0.4 } : { duration: 4.2, ease: "easeInOut", repeat: Infinity }}
              >
                <SearchX className="h-7 w-7" aria-hidden />
                <span className="sr-only">Page not found</span>
              </motion.div>
            </motion.div>
          </div>

          <h1 className="text-5xl font-semibold tracking-tight">404</h1>

          <p className="mt-3 text-sm/6 text-foreground/70">
            We couldn’t find{" "}
            <code className="rounded bg-foreground/10 px-1.5 py-0.5 text-foreground/80">
              {location.pathname}
            </code>
            .
          </p>

          <p className="mt-2 text-xs text-foreground/60">
            The page may have been moved, renamed, or never existed.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-foreground/50" aria-live="polite">
          Error code: 404
        </p>
      </motion.div>
    </div>
  );
}
