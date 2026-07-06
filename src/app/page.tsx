"use client";

import React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import AnimatedBackground from "@/components/animated-background";
import SkillsSection from "@/components/sections/skills";
import ExperienceSection from "@/components/sections/experience";
import ProjectsSection from "@/components/sections/projects";
import ContactSection from "@/components/sections/contact";
import HeroSection from "@/components/sections/hero";
import IntroReveal from "@/components/intro-reveal";

const SmoothScroll = dynamic(() => import("@/components/smooth-scroll"), {
  ssr: false,
});

function MainPage() {
  return (
    <SmoothScroll>
      <IntroReveal>
        <AnimatedBackground />
        <main className={cn("bg-slate-100 dark:bg-transparent canvas-overlay-mode")} suppressHydrationWarning>
          <HeroSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      </IntroReveal>
    </SmoothScroll>
  );
}

export default MainPage;
