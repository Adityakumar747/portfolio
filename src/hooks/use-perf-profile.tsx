"use client";

import * as React from "react";

/**
 * Cross-component override: lets a reduced-motion user opt back into the full
 * motion/3D experience. Every `usePerfProfile()` caller reads the same value
 * (module-level store + useSyncExternalStore), and the choice persists.
 */
const MOTION_OVERRIDE_KEY = "portfolio:enable-motion";
let motionOverride = false;
let motionInitialized = false;
const motionListeners = new Set<() => void>();

function ensureMotionInit() {
  if (motionInitialized || typeof window === "undefined") return;
  try {
    motionOverride = localStorage.getItem(MOTION_OVERRIDE_KEY) === "1";
  } catch {
    /* storage blocked — default off */
  }
  motionInitialized = true;
}

/** Opt back into full motion/3D despite `prefers-reduced-motion`. */
export function enableMotion() {
  motionOverride = true;
  try {
    localStorage.setItem(MOTION_OVERRIDE_KEY, "1");
  } catch {
    /* ignore */
  }
  motionListeners.forEach((l) => l());
}

function subscribeMotion(listener: () => void) {
  motionListeners.add(listener);
  return () => motionListeners.delete(listener);
}
function getMotionSnapshot() {
  ensureMotionInit();
  return motionOverride;
}
function getMotionServerSnapshot() {
  return false;
}

/**
 * Single source of truth for "how much eye-candy should we run?".
 *
 * Combines the user's reduced-motion preference with cheap device-capability
 * signals so heavy effects (the Spline 3D scene, the particle canvas, the
 * elastic cursor, infinite GSAP tweens) can be scaled down or skipped on
 * low-end hardware instead of running full-tilt everywhere.
 */
export type PerfProfile = {
  /** Effective reduced-motion (OS pref, unless the user opted back into motion). */
  reducedMotion: boolean;
  /** Raw OS-level `prefers-reduced-motion`, ignoring the user override. */
  rawReducedMotion: boolean;
  /** User has explicitly opted back into full motion/3D. */
  motionEnabled: boolean;
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

  // deviceMemory is bucketed and capped at 8, and core counts get clamped, so
  // these numbers drift even on the same machine. Only drop 3D when both look
  // modest, or one is clearly tiny. saveData means the user opted in.
  if (saveData) return true;
  return (cores <= 4 && memory <= 4) || cores <= 2 || memory <= 2;
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

  const { reducedMotion: rawReducedMotion, isMobile, lowEnd, ready } = state;
  const motionEnabled = React.useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot
  );

  return React.useMemo<PerfProfile>(() => {
    // The opt-in only overrides the motion *preference* — it never re-enables
    // heavy effects on genuinely low-end hardware.
    const reducedMotion = rawReducedMotion && !motionEnabled;
    const disable3D = reducedMotion || lowEnd;
    const disableDecorative = reducedMotion;
    const particleCount = disableDecorative ? 0 : isMobile || lowEnd ? 30 : 100;
    const maxDpr = isMobile || lowEnd ? 1.5 : 2;
    return {
      reducedMotion,
      rawReducedMotion,
      motionEnabled,
      isMobile,
      lowEnd,
      disable3D,
      disableDecorative,
      particleCount,
      maxDpr,
      ready,
    };
  }, [rawReducedMotion, motionEnabled, isMobile, lowEnd, ready]);
}
