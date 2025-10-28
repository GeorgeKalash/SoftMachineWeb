"use client";

import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import PurhaseOcrderProcessing1 from "@/pages/PurhaseOcrderProcessing/Sections/PurhaseOcrderProcessing";
import CaseStudyCarousel from "@/sharedComponent/slider";



const PurhaseOcrderProcessing = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="FixedAssets" className="scroll-mt-24"><PurhaseOcrderProcessing1 /></section>
        <CaseStudyCarousel />

      </main>

      <Footer />

    </div>
  );
};

export default PurhaseOcrderProcessing;
