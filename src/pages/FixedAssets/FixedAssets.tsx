"use client";

import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import Hero from "@/pages/FixedAssets/Sections/FixedAssets";



const FixedAssets = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="FixedAssets" className="scroll-mt-24"><Hero /></section>
      </main>
      <Footer />

    </div>
  );
};

export default FixedAssets;
