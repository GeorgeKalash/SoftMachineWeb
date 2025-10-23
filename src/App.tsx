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
import InventoryManagment from "./pages/InventoryManagment/InventoryManagment";
import Projects from "./pages/Projects/Projects";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import PrivacyPolicyPage from "./pages/PrivacyPolicy/PrivacyPolicy";
import FixedAssets from "./pages/FixedAssets/FixedAssets";

const queryClient = new QueryClient();

/** inline scroll manager (same file) */
function ScrollManager({ selector }: { selector?: string }) {
  const location = useLocation();
  const action = useNavigationType(); // "PUSH" | "REPLACE" | "POP"
  const scrollElRef = useRef<Window | HTMLElement | null>(null);

  // key ignores hash so anchors don't create new storage keys
  const key = `${location.pathname}${location.search}`;

  // resolve scroll container once
  useEffect(() => {
    scrollElRef.current = selector
      ? (document.querySelector(selector) as HTMLElement | null)
      : window;
  }, [selector]);

  useEffect(() => {
    const el = scrollElRef.current as any;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = el === window ? window.scrollY : (el as HTMLElement).scrollTop;
        sessionStorage.setItem(`scroll:${key}`, String(y));
        raf = 0;
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [key]);

  // apply position on navigation
  useLayoutEffect(() => {
    const el = scrollElRef.current as any;
    if (!el) return;

    // native behavior for in-page anchors
    if (location.hash) return;

    if (action === "POP") {
      // back/forward → restore
      const saved = sessionStorage.getItem(`scroll:${key}`);
      const y = saved ? parseInt(saved, 10) : 0;
      requestAnimationFrame(() => {
        if (el === window) window.scrollTo(0, y);
        else (el as HTMLElement).scrollTop = y;
      });
    } else {
      // push/replace → top
      if (el === window) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      else (el as HTMLElement).scrollTop = 0;
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
        {/* if you scroll a custom container, pass a selector:
            <ScrollManager selector='[data-scroll-root]' /> */}
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/InventoryManagment" element={<InventoryManagment />} />
          <Route path="/FixedAssets" element={<FixedAssets />} />
          <Route path="/allProjects" element={<Projects />} />
          <Route path="/PrivacyPolicyPage" element={<PrivacyPolicyPage />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
