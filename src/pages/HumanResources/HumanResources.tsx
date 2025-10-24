"use client";

import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import HumanResources1 from "@/pages/HumanResources/Sections/HumanResources";
import CaseStudyCarousel from "@/sharedComponent/slider";



const HumanResources = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="HumanResources" className="scroll-mt-24"><HumanResources1 /></section>
        <CaseStudyCarousel />

      </main>

      <Footer />

    </div>
  );
};

export default HumanResources;
