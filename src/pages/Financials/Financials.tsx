"use client";

import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import Financials1 from "@/pages/Financials/Sections/Financials";
import CaseStudyCarousel from "@/sharedComponent/slider";



const Financials = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="FixedAssets" className="scroll-mt-24"><Financials1 /></section>
        <CaseStudyCarousel />

      </main>

      <Footer />

    </div>
  );
};

export default Financials;
