"use client";

import * as React from "react";

/**
 * Single source of truth for "how much eye-candy should we run?".
 *
 * Combines the user's reduced-motion preference with cheap device-capability
 * signals so heavy effects (the Spline 3D scene, the particle canvas, the
 * elastic cursor, infinite GSAP tweens) can be scaled down or skipped on
 * low-end hardware instead of running full-tilt everywhere.
 */
export type PerfProfile = {
  /** OS-level "prefers reduced motion" is on. */
  reducedMotion: boolean;
  /** Small viewport (phone-sized). */
  isMobile: boolean;
  /** Weak CPU / little RAM / data-saver — a low-end device. */
  lowEnd: boolean;
  /** Drop the WebGL 3D scene entirely (show a static fallback). */
  disable3D: boolean;
  /** Skip purely decorative effects (particles, elastic cursor jelly). */
  disableDecorative: boolean;
  /** How many background particles to render (0 = none). */
  particleCount: number;
  /** Pixel-ratio ceiling for any canvas/WebGL renderer. */
  maxDpr: number;
  /** True once detection has run on the client (avoids SSR/CSR mismatch). */
  ready: boolean;
};

function detectLowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  // deviceMemory is non-standard but widely supported on Chromium/Android.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const saveData =
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false;
  return cores <= 4 || memory <= 4 || saveData;
}

export function usePerfProfile(): PerfProfile {
  const [state, setState] = React.useState({
    reducedMotion: false,
    isMobile: false,
    lowEnd: false,
    ready: false,
  });

  React.useEffect(() => {
    const motionMq = matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = matchMedia("(max-width: 768px)");

    const update = () =>
      setState({
        reducedMotion: motionMq.matches,
        isMobile: mobileMq.matches,
        lowEnd: detectLowEnd(),
        ready: true,
      });

    update();
    motionMq.addEventListener("change", update);
    mobileMq.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      mobileMq.removeEventListener("change", update);
    };
  }, []);

  const { reducedMotion, isMobile, lowEnd, ready } = state;

  return React.useMemo<PerfProfile>(() => {
    const disable3D = reducedMotion || lowEnd;
    const disableDecorative = reducedMotion;
    const particleCount = disableDecorative ? 0 : isMobile || lowEnd ? 30 : 100;
    const maxDpr = isMobile || lowEnd ? 1.5 : 2;
    return {
      reducedMotion,
      isMobile,
      lowEnd,
      disable3D,
      disableDecorative,
      particleCount,
      maxDpr,
      ready,
    };
  }, [reducedMotion, isMobile, lowEnd, ready]);
}
