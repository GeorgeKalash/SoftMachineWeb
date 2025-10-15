"use client";

import Navigation from "@/components/Navigation/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Blog from "@/components/Blog";
import Projects from "@/components/projects";
import Team from "@/components/Team";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16"> 
        <section id="home" className="scroll-mt-24"><Hero /></section>
        <section id="features" className="scroll-mt-24"><Features /></section>
        <section id="blog" className="scroll-mt-24"><Blog /></section>
        <section id="about" className="scroll-mt-24"><About /></section>
        <section id="pricing" className="scroll-mt-24"><Pricing /></section>
        <section id="projects" className="scroll-mt-24"><Projects /></section>
        <section id="testimonials" className="scroll-mt-24"><Testimonials /></section>
        <section id="team" className="scroll-mt-24"><Team /></section>
        <section id="faq" className="scroll-mt-24"><FAQ /></section>
        <section id="cta" className="scroll-mt-24"><CTA /></section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
