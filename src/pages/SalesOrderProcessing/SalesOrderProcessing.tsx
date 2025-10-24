"use client";

import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import SalesOrderProcessing1 from "@/pages/SalesOrderProcessing/Sections/SalesOrderProcessing";
import CaseStudyCarousel from "@/sharedComponent/slider";



const SalesOrderProcessing = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="FixedAssets" className="scroll-mt-24"><SalesOrderProcessing1 /></section>
        <CaseStudyCarousel />

      </main>

      <Footer />

    </div>
  );
};

export default SalesOrderProcessing;
