"use client";

import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import Manufacturing1 from "@/pages/Manufacturing/Sections/Manufacturing";
import CaseStudyCarousel from "@/sharedComponent/slider";



const Manufacturing = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="FixedAssets" className="scroll-mt-24"><Manufacturing1 /></section>
        <CaseStudyCarousel />

      </main>

      <Footer />

    </div>
  );
};

export default Manufacturing;
