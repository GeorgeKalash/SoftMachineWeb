"use client";

import Navigation from "@/components/Navigation/Navigation";
import ProjectList from "@/pages/Projects/Sections/ProjectList";



const Projects = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
        <main className="pt-16"> 
          <section  className="scroll-mt-24"><ProjectList /></section>
        </main>
    </div>
  );
};

export default Projects;
