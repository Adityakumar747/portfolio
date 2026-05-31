"use client";

import type { CSSProperties } from "react";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";
import { SKILLS } from "@/data/constants";
import { usePerfProfile } from "@/hooks/use-perf-profile";
import { cn } from "@/lib/utils";

/**
 * Tech-stack section.
 *
 * On capable devices the skills live in the interactive 3D keyboard's keycaps,
 * so this is just a header and the section is tall (the keyboard scrubs through
 * it on scroll). When the 3D scene is disabled (low-end / reduced-motion), the
 * keyboard isn't there to convey the skills — so we render them as a real HTML
 * grid instead. Progressive enhancement: the content survives without WebGL.
 */
const SkillsSection = () => {
  const { disable3D, ready } = usePerfProfile();
  const showGrid = ready && disable3D;

  if (showGrid) {
    return (
      <SectionWrapper
        id="skills"
        className="flex w-full min-h-screen flex-col justify-center py-24"
      >
        <SectionHeader
          id="skills"
          title="Tech Stack"
          desc="Tools I build with"
          className="static mb-14"
        />
        <ul className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Object.values(SKILLS).map((skill) => (
            <li
              key={skill.name}
              style={{ "--skill": skill.color } as CSSProperties}
              className={cn(
                // the section sits inside `.canvas-overlay-mode` (pointer-events
                // disabled so the 3D canvas can be clicked through); re-enable on
                // the whole card so hover isn't limited to the icon/label.
                "pointer-events-auto",
                "group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl p-5",
                "border border-border/60 bg-secondary/20 backdrop-blur-sm",
                "transition-[transform,border-color,background-color,box-shadow] duration-300",
                "hover:-translate-y-1 hover:border-[var(--skill)] hover:bg-secondary/40",
                "hover:shadow-[0_10px_40px_-12px_var(--skill)]"
              )}
            >
              {/* per-skill colored glow */}
              <span
                aria-hidden
                style={{ background: "var(--skill)" }}
                className="pointer-events-none absolute -top-6 h-16 w-16 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={skill.icon}
                alt={skill.label}
                width={44}
                height={44}
                loading="lazy"
                className="relative size-9 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110 md:size-11"
              />
              <span className="relative text-center text-xs font-medium text-foreground/80 transition-colors group-hover:text-foreground md:text-sm">
                {skill.label}
              </span>
            </li>
          ))}
        </ul>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      id="skills"
      className="w-full h-screen md:h-[150dvh] pointer-events-none"
    >
      <SectionHeader id="skills" title="Tech Stack" desc="(hint: press a key)" />
    </SectionWrapper>
  );
};

export default SkillsSection;
