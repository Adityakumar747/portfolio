"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/constants";
import { sleep } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreloader } from "./preloader";
import { useTheme } from "next-themes";
import { Section, getKeyboardState } from "./animated-background-config";
import { useSounds } from "./realtime/hooks/use-sounds";
import { usePerfProfile } from "@/hooks/use-perf-profile";

gsap.registerPlugin(ScrollTrigger);

const AnimatedBackground = () => {
  const { isLoading, bypassLoading } = usePreloader();
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { disable3D, maxDpr, ready: perfReady } = usePerfProfile();
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");

  // Animation controllers refs
  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void }>(null);
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void }>(null);

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);

  // --- Event Handlers ---

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("heading") && splineApp.getVariable("desc")) {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }
    } else {
      if (!selectedSkillRef.current || selectedSkillRef.current.name !== e.target.name) {
        const skill = SKILLS[e.target.name as SkillNames];
        if (skill) {
          if (selectedSkillRef.current) playReleaseSound();
          playPressSound();
          setSelectedSkill(skill);
          selectedSkillRef.current = skill;
        }
      }
    }
  };

  const handleSplineInteractions = () => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    splineApp.addEventListener("keyUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
    });
    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    });
    splineApp.addEventListener("mouseHover", handleMouseHover);
  };

  // --- Animation Setup Helpers ---

  const createSectionTimeline = (
    triggerId: string,
    targetSection: Section,
    prevSection: Section,
    start: string = "top 50%",
    end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: triggerId,
        start,
        end,
        scrub: true,
        onEnter: () => {
          setActiveSection(targetSection);
          const state = getKeyboardState({ section: targetSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          const state = getKeyboardState({ section: prevSection, isMobile, });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
      },
    });
  };

  const setupScrollAnimations = () => {
    if (!splineApp || !splineContainer.current) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    // Initial state
    const heroState = getKeyboardState({ section: "hero", isMobile });
    gsap.set(kbd.scale, heroState.scale);
    gsap.set(kbd.position, heroState.position);

    // Section transitions
    createSectionTimeline("#skills", "skills", "hero");
    createSectionTimeline("#projects", "projects", "skills", "top 70%");
    createSectionTimeline("#contact", "contact", "projects", "top 30%");
  };

  const getBongoAnimation = () => {
    const framesParent = splineApp?.findObjectByName("bongo-cat");
    const frame1 = splineApp?.findObjectByName("frame-1");
    const frame2 = splineApp?.findObjectByName("frame-2");

    if (!frame1 || !frame2 || !framesParent) {
      return { start: () => { }, stop: () => { } };
    }

    let interval: NodeJS.Timeout;
    const start = () => {
      let i = 0;
      framesParent.visible = true;
      interval = setInterval(() => {
        if (i % 2) {
          frame1.visible = false;
          frame2.visible = true;
        } else {
          frame1.visible = true;
          frame2.visible = false;
        }
        i++;
      }, 100);
    };
    const stop = () => {
      clearInterval(interval);
      framesParent.visible = false;
      frame1.visible = false;
      frame2.visible = false;
    };
    return { start, stop };
  };

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => { }, stop: () => { } };

    let tweens: gsap.core.Tween[] = [];
    const removePrevTweens = () => tweens.forEach((t) => t.kill());

    const start = () => {
      removePrevTweens();
      Object.values(SKILLS)
        .sort(() => Math.random() - 0.5)
        .forEach((skill, idx) => {
          const keycap = splineApp.findObjectByName(skill.name);
          if (!keycap) return;
          const t = gsap.to(keycap.position, {
            y: Math.random() * 200 + 200,
            duration: Math.random() * 2 + 2,
            delay: idx * 0.6,
            repeat: -1,
            yoyo: true,
            yoyoEase: "none",
            ease: "elastic.out(1,0.3)",
          });
          tweens.push(t);
        });
    };

    const stop = () => {
      removePrevTweens();
      Object.values(SKILLS).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        const t = gsap.to(keycap.position, {
          y: 0,
          duration: 4,
          repeat: 1,
          ease: "elastic.out(1,0.7)",
        });
        tweens.push(t);
      });
      setTimeout(removePrevTweens, 1000);
    };

    return { start, stop };
  };

  const updateKeyboardTransform = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        ...currentState.scale,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );

    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");

    await sleep(900);

    if (isMobile) {
      const mobileKeyCaps = allObjects.filter((obj) => obj.name === "keycap-mobile");
      mobileKeyCaps.forEach((keycap) => { keycap.visible = true; });
    } else {
      const desktopKeyCaps = allObjects.filter((obj) => obj.name === "keycap-desktop");
      desktopKeyCaps.forEach(async (keycap, idx) => {
        await sleep(idx * 70);
        keycap.visible = true;
      });
    }

    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false;
      await sleep(idx * 70);
      keycap.visible = true;
      gsap.fromTo(
        keycap.position,
        { y: 200 },
        { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" }
      );
    });
  };

  // --- Effects ---

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    setupScrollAnimations();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();
    return () => {
      bongoAnimationRef.current?.stop()
      keycapAnimationsRef.current?.stop()
    }

  }, [splineApp, isMobile]);

  // Handle keyboard text visibility based on theme and section
  useEffect(() => {
    if (!splineApp) return;
    const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
    const textMobileLight = splineApp.findObjectByName("text-mobile");

    if (!textDesktopDark || !textDesktopLight || !textMobileDark || !textMobileLight) return;

    const setVisibility = (
      dDark: boolean,
      dLight: boolean,
      mDark: boolean,
      mLight: boolean
    ) => {
      textDesktopDark.visible = dDark;
      textDesktopLight.visible = dLight;
      textMobileDark.visible = mDark;
      textMobileLight.visible = mLight;
    };

    if (activeSection !== "skills") {
      setVisibility(false, false, false, false);
    } else if (theme === "dark") {
      isMobile
        ? setVisibility(false, false, false, true)
        : setVisibility(false, true, false, false);
    } else {
      isMobile
        ? setVisibility(false, false, true, false)
        : setVisibility(true, false, false, false);
    }
  }, [theme, splineApp, isMobile, activeSection]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill]);

  // Handle rotation and teardown animations based on active section
  useEffect(() => {
    if (!splineApp) return;

    let rotateKeyboard: gsap.core.Tween | undefined;
    let teardownKeyboard: gsap.core.Tween | undefined;

    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y,
        duration: 10,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "back.inOut",
        delay: 2.5,
        paused: true, // Start paused
      });

      teardownKeyboard = gsap.fromTo(
        kbd.rotation,
        { y: 0, x: -Math.PI, z: 0 },
        {
          y: -Math.PI / 2,
          duration: 5,
          repeat: -1,
          yoyo: true,
          yoyoEase: true,
          delay: 2.5,
          immediateRender: false,
          paused: true,
        }
      );
    }

    const manageAnimations = async () => {
      // Reset text if not in skills
      if (activeSection !== "skills") {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }

      // Handle Rotate/Teardown Tweens
      if (activeSection === "hero") {
        rotateKeyboard?.restart();
        teardownKeyboard?.pause();
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause();
      } else {
        rotateKeyboard?.pause();
        teardownKeyboard?.pause();
      }

      // Handle Bongo Cat
      if (activeSection === "projects") {
        await sleep(300);
        bongoAnimationRef.current?.start();
      } else {
        await sleep(200);
        bongoAnimationRef.current?.stop();
      }

      // Handle Contact Section Animations
      if (activeSection === "contact") {
        await sleep(600);
        teardownKeyboard?.restart();
        keycapAnimationsRef.current?.start();
      } else {
        await sleep(600);
        teardownKeyboard?.pause();
        keycapAnimationsRef.current?.stop();
      }
    };

    manageAnimations();

    return () => {
      rotateKeyboard?.kill();
      teardownKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    // Rebuild the URL from the current pathname so the hash is always *replaced*
    // rather than appended. Using router.push("/" + hash) stacked fragments on
    // refresh (e.g. "/#skills#skills#skills") because the existing hash in the
    // address bar was never stripped first. replaceState also avoids polluting
    // browser history with an entry per scrolled-through section.
    const hash = activeSection === "hero" ? "" : `#${activeSection}`;
    const url = window.location.pathname + window.location.search + hash;
    window.history.replaceState(window.history.state, "", url);

    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection]);

  // Cap the renderer's pixel ratio once the scene is ready, and clean up the
  // resize listener on unmount / DPR change (previously added in onLoad and
  // never removed).
  useEffect(() => {
    if (!splineApp) return;
    return capSplinePixelRatio(splineApp, maxDpr);
  }, [splineApp, maxDpr]);

  // Pause the entire WebGL render loop (and the keyboard's infinite tweens /
  // bongo-cat interval, which are only visible through it) while the tab is
  // hidden. Spline keeps rendering at full tilt in a background tab otherwise —
  // a pointless, continuous GPU/battery drain.
  useEffect(() => {
    if (!splineApp) return;
    const onVisibility = () => {
      if (document.hidden) splineApp.stop();
      else splineApp.play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [splineApp]);

  // On low-end hardware or when the user prefers reduced motion, skip the WebGL
  // scene entirely — it's the single heaviest thing on the page. Don't mount
  // Spline until device detection has run, either: a mount-then-unmount would
  // still fetch the heavy runtime chunk + scene (a "flash mount"). Waiting one
  // tick keeps the 3D off low-end devices for real; the page keeps its own
  // background, and the Preloader bypasses its splash when 3D is disabled.
  if (!perfReady || disable3D) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Spline
        className="w-full h-full fixed"
        ref={splineContainer}
        onLoad={(app: Application) => {
          setSplineApp(app);
          bypassLoading();
        }}
        scene="/assets/skills-keyboard.spline"
      />
    </Suspense>
  );
};

/**
 * Cap the Spline/Three.js renderer's pixel ratio. The scene is published with
 * pixelRatio=0 ("device"), so on a 2–3x screen it renders 4–9x the pixels of a
 * 1x canvas — a huge GPU cost. We clamp it and reapply on resize, since Spline
 * re-reads devicePixelRatio when the canvas resizes. Returns a disposer that
 * removes the resize listener (so it isn't leaked across reloads/unmounts).
 */
function capSplinePixelRatio(app: Application, maxDpr: number) {
  const apply = () => {
    try {
      const renderer = (app as unknown as { _renderer?: { setPixelRatio?: (n: number) => void } })
        ._renderer;
      if (renderer?.setPixelRatio) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
      }
    } catch {
      /* internal API moved — fail silent, scene still renders */
    }
  };
  apply();
  window.addEventListener("resize", apply, { passive: true });
  return () => window.removeEventListener("resize", apply);
}

export default AnimatedBackground;
