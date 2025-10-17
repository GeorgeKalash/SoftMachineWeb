"use client";

import Navigation from "@/components/Navigation/Navigation";
import Hero from "@/pages/AboutPage/Sections/test";



const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="about" className="scroll-mt-24"><Hero /></section>
      </main>
    </div>
  );
};

export default About;
