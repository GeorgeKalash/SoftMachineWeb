"use client";

import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import RepairAndService1 from "@/pages/RepairAndService/Sections/RepairAndService";
import CaseStudyCarousel from "@/sharedComponent/slider";



const RepairAndService = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="FixedAssets" className="scroll-mt-24"><RepairAndService1 /></section>
        <CaseStudyCarousel />

      </main>

      <Footer />

    </div>
  );
};

export default RepairAndService;
