"use client";

import Navigation from "@/components/Navigation/Navigation";
import Hero from "@/pages/MainPage/Sections/Hero";
import Features from "@/pages/MainPage/Sections/Features";
import About from "@/pages/MainPage/Sections/About";
import Pricing from "@/pages/MainPage/Sections/Pricing";
import Testimonials from "@/pages/MainPage/Sections/Testimonials";
import FAQ from "@/pages/MainPage/Sections/FAQ";
import CTA from "@/pages/MainPage/Sections/CTA";
import Footer from "@/components/Footer/Footer";
import Blog from "@/pages/MainPage/Sections/Blog";
import Projects from "@/pages/MainPage/Sections/projects";
import Team from "@/pages/MainPage/Sections/Team";
import ScrollableShowcase from "./Sections/ScrollableShowcase";
import CaseStudyCarousel from "@/sharedComponent/slider";

const Main = () => {
  return (
    <div >
      <Navigation />
      <main > 
        <section id="home" className="scroll-mt-24"><Hero /></section>
        <section id="features" className="scroll-mt-24"><Features /></section>
        {/* <section id="blog" className="scroll-mt-24"><Blog /></section> */}
        <section id="about" className="scroll-mt-24"><About /></section>
        <section id="ScrollableShowcase" className="scroll-mt-24"><ScrollableShowcase /></section>

        {/* <section id="pricing" className="scroll-mt-24"><Pricing /></section> */}
        {/* <section id="projects" className="scroll-mt-24"><Projects /></section> */}
        <section id="testimonials" className="scroll-mt-24"><Testimonials /></section>
        {/* <section id="team" className="scroll-mt-24"><Team /></section> */}

        <section id="faq" className="scroll-mt-24"><FAQ /></section>
        {/* <section id="cta" className="scroll-mt-24"><CTA /></section> */}
                <CaseStudyCarousel />

      </main>
      <Footer />
    </div>
  );
};

export default Main;
