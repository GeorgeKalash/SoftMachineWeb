"use client";

import Navigation from "@/components/Navigation/Navigation";
import Hero from "@/pages/InventoryManagment/Sections/InventoryManagment";
import Footer from "@/components/Footer/Footer";



const InventoryManagment = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="InventoryManagment" className="scroll-mt-24"><Hero /></section>
      </main>
      <Footer />

    </div>
  );
};

export default InventoryManagment;
