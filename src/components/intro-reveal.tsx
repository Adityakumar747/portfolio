"use client";

import { useEffect, useRef } from "react";
import { config } from "@/data/config";

export default function IntroReveal({ children }: { children: React.ReactNode }) {
  const glowRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const updateHeaderVisibility = () => {
      document.body.classList.toggle(
        "portfolio-intro-active",
        window.scrollY < window.innerHeight * 0.92
      );
    };

    updateHeaderVisibility();
    window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
    window.addEventListener("resize", updateHeaderVisibility);

    return () => {
      document.body.classList.remove("portfolio-intro-active");
      window.removeEventListener("scroll", updateHeaderVisibility);
      window.removeEventListener("resize", updateHeaderVisibility);
    };
  }, []);

  const updateGlow = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    glowRef.current?.style.setProperty(
      "--mx",
      `${((event.clientX - rect.left) / rect.width) * 100}%`
    );
    glowRef.current?.style.setProperty(
      "--my",
      `${((event.clientY - rect.top) / rect.height) * 100}%`
    );
  };

  return (
    <>
      <section className="intro-runway" aria-label="Portfolio intro">
        <div className="intro-pinned">
          <div
            className="intro-name-wrap"
            onMouseMove={updateGlow}
            onMouseEnter={() => glowRef.current?.style.setProperty("--glow-opacity", "1")}
            onMouseLeave={() => glowRef.current?.style.setProperty("--glow-opacity", "0")}
          >
            <h1 className="intro-name intro-name-base">{config.author}</h1>
            <h1
              ref={glowRef}
              className="intro-name intro-name-glow"
              aria-hidden="true"
            >
              {config.author}
            </h1>
          </div>
          <div className="intro-scroll">Scroll to enter</div>
        </div>
      </section>

      <div className="intro-site-card">{children}</div>
    </>
  );
}
