"use client";

import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import InventoryManagement from "@/pages/InventoryManagement/Sections/InventoryManagement";
import CaseStudyCarousel from "@/sharedComponent/slider";



const delivery = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="FixedAssets" className="scroll-mt-24"><InventoryManagement /></section>
        <CaseStudyCarousel />

      </main>

      <Footer />

    </div>
  );
};

export default delivery;
