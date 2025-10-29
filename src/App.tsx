
import React, { Suspense, lazy, useEffect, useLayoutEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* --------------------------------- Pages --------------------------------- */
/** Convert to lazy so Suspense fallback (red loader) shows between routes */
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const InventoryManagement = lazy(() => import("./pages/InventoryManagement/InventoryManagement"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const TermsOfService = lazy(() => import("./pages/TermsOfService/TermsOfService"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy"));
const FixedAssets = lazy(() => import("./pages/FixedAssets/FixedAssets"));
const SalesOrderProcessing = lazy(() => import("./pages/SalesOrderProcessing/SalesOrderProcessing"));
const HumanResources = lazy(() => import("./pages/HumanResources/HumanResources"));
const Financials = lazy(() => import("./pages/Financials/Financials"));
const Manufacturing = lazy(() => import("./pages/Manufacturing/Manufacturing"));
const RepairAndService = lazy(() => import("./pages/RepairAndService/RepairAndService"));
const DeliveryManagement = lazy(() => import("./pages/DeliveryManagement/DeliveryManagement"));
const PurhaseOcrderProcessing = lazy(() => import("./pages/PurhaseOcrderProcessing/PurhaseOcrderProcessing"));

const queryClient = new QueryClient();

/* ----------------------------- Route top bar ----------------------------- */
/** Thin red bar that animates on *any* route change (fast feedback). */
function RouteProgressBar() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState(false);

  // Trigger on pathname/search change (ignore hash so anchors don't flash)
  useEffect(() => {
    setActive(true);
    // Auto-finish after a short time; Suspense fallback (below) covers long loads
    const t = setTimeout(() => setActive(false), 600);
    return () => clearTimeout(t);
  }, [location.pathname, location.search]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-progress"
          className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-red-500"
          style={{ transformOrigin: "0% 50%" }}
          initial={{ scaleX: 0 }}
          animate={
            reduceMotion
              ? { scaleX: 1 }
              : { scaleX: [0.2, 0.6, 0.9] }
          }
          exit={{ scaleX: 1, opacity: 0 }}
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
          }
          aria-hidden
        />
      )}
    </AnimatePresence>
  );
}

/* ----------------------- Suspense fallback red loader -------------------- */
/** Shows only while a lazy route is fetching. Includes a red top bar + center dot. */
function PageTransitionFallback() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = React.useState(false);

  // Small delay prevents flicker on super-fast transitions
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {/* Red top bar (indeterminate) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-red-500"
        style={{ transformOrigin: "0% 50%" }}
        initial={{ scaleX: 0.15 }}
        animate={
          reduceMotion
            ? { scaleX: 1 }
            : { scaleX: [0.15, 0.6, 0.85, 0.92, 0.96, 0.98] }
        }
        transition={
          reduceMotion
            ? { duration: 0.4, repeat: Infinity }
            : { duration: 2.2, ease: "easeInOut", repeat: Infinity }
        }
        aria-hidden
      />

      {/* Center red pulse */}
      <div className="grid h-full w-full place-items-center">
        <motion.div
          className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_24px_4px_rgba(239,68,68,0.35)]"
          initial={{ opacity: 0.9, scale: 1 }}
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: [0.7, 1, 0.7], scale: [1, 1.22, 1] }
          }
          transition={
            reduceMotion
              ? { duration: 0.8, repeat: Infinity }
              : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
          }
          aria-label="Loading"
          role="status"
        />
      </div>
    </div>
  );
}

/* ----------------------------- Scroll Manager ---------------------------- */
function ScrollManager({ selector }: { selector?: string }) {
  const location = useLocation();
  const action = useNavigationType(); // "PUSH" | "REPLACE" | "POP"
  const scrollElRef = React.useRef<Window | HTMLElement | null>(null);

  const key = `${location.pathname}${location.search}`;
  const isWin = (el: Window | HTMLElement): el is Window => el === window;
  const getScrollY = (el: Window | HTMLElement): number =>
    isWin(el) ? window.scrollY : (el as HTMLElement).scrollTop;
  const setScrollY = (el: Window | HTMLElement, y: number) => {
    if (isWin(el)) window.scrollTo({ top: y, left: 0, behavior: "auto" });
    else (el as HTMLElement).scrollTop = y;
  };

  useEffect(() => {
    scrollElRef.current = selector
      ? (document.querySelector(selector) as HTMLElement | null)
      : window;
  }, [selector]);

  useEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;
    let raf = 0 as unknown as number;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = getScrollY(el);
        sessionStorage.setItem(`scroll:${key}`, String(y));
        raf = 0 as unknown as number;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll as EventListener);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key]);

  useLayoutEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;
    if (location.hash) return; // native behavior for anchors
    if (action === "POP") {
      const saved = sessionStorage.getItem(`scroll:${key}`);
      const y = saved ? parseInt(saved, 10) : 0;
      requestAnimationFrame(() => setScrollY(el, y));
    } else {
      setScrollY(el, 0);
    }
  }, [action, key, location.hash]);

  return null;
}

/* ---------------------------------- App ---------------------------------- */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Thin red bar on any navigation (fast feedback) */}
        <RouteProgressBar />

        <ScrollManager />
        {/* Full-screen red loader while lazy routes fetch */}
        <Suspense fallback={<PageTransitionFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/InventoryManagement" element={<InventoryManagement />} />
            <Route path="/FixedAssets" element={<FixedAssets />} />
            <Route path="/allProjects" element={<Projects />} />
            <Route path="/PrivacyPolicyPage" element={<PrivacyPolicyPage />} />
            <Route path="/SalesOrderProcessing" element={<SalesOrderProcessing />} />
            <Route path="/HumanResources" element={<HumanResources />} />
            <Route path="/Financials" element={<Financials />} />
            <Route path="/RepairAndService" element={<RepairAndService />} />
            <Route path="/DeliveryManagement" element={<DeliveryManagement />} />
            <Route path="/PurhaseOcrderProcessing" element={<PurhaseOcrderProcessing />} />
            <Route path="/Manufacturing" element={<Manufacturing />} />
            <Route path="/TermsOfService" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
