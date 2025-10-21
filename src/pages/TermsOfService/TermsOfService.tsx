"use client";

import Navigation from "@/components/Navigation/Navigation";
import TermsOfService from "./Sections/TermsOfService"



const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="about" className="scroll-mt-24"><TermsOfService /></section>
      </main>
    </div>
  );
};

export default About;
