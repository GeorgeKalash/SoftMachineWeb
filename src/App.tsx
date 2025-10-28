// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InventoryManagement from "./pages/InventoryManagement/InventoryManagement";
import Projects from "./pages/Projects/Projects";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import PrivacyPolicyPage from "./pages/PrivacyPolicy/PrivacyPolicy";
import FixedAssets from "./pages/FixedAssets/FixedAssets";
import SalesOrderProcessing from "./pages/SalesOrderProcessing/SalesOrderProcessing";
import HumanResources from "./pages/HumanResources/HumanResources";
import Financials from "./pages/Financials/Financials";
import Manufacturing from "./pages/Manufacturing/Manufacturing";
import RepairAndService from "./pages/RepairAndService/RepairAndService";
import DeliveryManagement from "./pages/DeliveryManagement/DeliveryManagement";
import PurhaseOcrderProcessing from "./pages/PurhaseOcrderProcessing/PurhaseOcrderProcessing";

const queryClient = new QueryClient();

/** inline scroll manager (same file) */
function ScrollManager({ selector }: { selector?: string }) {
  const location = useLocation();
  const action = useNavigationType(); // "PUSH" | "REPLACE" | "POP"
  const scrollElRef = React.useRef<Window | HTMLElement | null>(null);

  // key ignores hash so anchors don't create new storage keys
  const key = `${location.pathname}${location.search}`;

  // --- helpers (type guards + utils) ---
  const isWin = (el: Window | HTMLElement): el is Window => el === window;

  const getScrollY = (el: Window | HTMLElement): number =>
    isWin(el) ? window.scrollY : el.scrollTop;

  const setScrollY = (el: Window | HTMLElement, y: number) => {
    if (isWin(el)) {
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
    } else {
      el.scrollTop = y;
    }
  };

  // resolve scroll container once
  useEffect(() => {
    scrollElRef.current = selector
      ? (document.querySelector(selector) as HTMLElement | null)
      : window;
  }, [selector]);

  // persist position while scrolling
  useEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;

    let raf = 0 as number;

    const onScroll = (_e: Event) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = getScrollY(el);
        sessionStorage.setItem(`scroll:${key}`, String(y));
        raf = 0;
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll as EventListener);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key]);

  // apply position on navigation
  useLayoutEffect(() => {
    const el = scrollElRef.current;
    if (!el) return;

    // native behavior for in-page anchors
    if (location.hash) return;

    if (action === "POP") {
      // back/forward → restore
      const saved = sessionStorage.getItem(`scroll:${key}`);
      const y = saved ? parseInt(saved, 10) : 0;
      requestAnimationFrame(() => setScrollY(el, y));
    } else {
      // push/replace → top
      setScrollY(el, 0);
    }
  }, [action, key, location.hash]);

  return null;
}


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
     
        <ScrollManager />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
