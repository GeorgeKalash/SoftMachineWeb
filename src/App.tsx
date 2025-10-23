import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InventoryManagment from "./pages/InventoryManagment/InventoryManagment";
import Projects from "./pages/Projects/Projects";
import TermsOfService from "./pages/TermsOfService/TermsOfService"
import PrivacyPolicyPage from "./pages/PrivacyPolicy/PrivacyPolicy";
import FixedAssets from "./pages/FixedAssets/FixedAssets";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/InventoryManagment" element={<InventoryManagment />}/>
          <Route path="/FixedAssets" element={<FixedAssets />}/>

          <Route path="/allProjects" element={<Projects />}/>
          <Route path="/PrivacyPolicyPage" element={<PrivacyPolicyPage />}/>
          <Route path="/TermsOfService" element={<TermsOfService />}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
