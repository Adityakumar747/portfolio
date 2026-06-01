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
  /** Conserve mode: Data Saver is on (explicit request to minimize data/effects). */
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

/**
 * Data Saver — an explicit, reliable signal that the user wants to conserve.
 *
 * We deliberately do NOT use `navigator.hardwareConcurrency` / `deviceMemory`
 * here: browsers clamp them unpredictably (the same capable machine has been
 * observed reporting 12, 8, and 2 cores across sessions), so gating the 3D
 * scene on them dropped it for plenty of perfectly capable devices. Capability
 * is too noisy to decide whether the headline feature renders.
 */
function detectSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ?? false
  );
}

export function usePerfProfile(): PerfProfile {
  const [state, setState] = React.useState({
    reducedMotion: false,
    isMobile: false,
    saveData: false,
    ready: false,
  });

  React.useEffect(() => {
    const motionMq = matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = matchMedia("(max-width: 768px)");

    const update = () =>
      setState({
        reducedMotion: motionMq.matches,
        isMobile: mobileMq.matches,
        saveData: detectSaveData(),
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

  const { reducedMotion: rawReducedMotion, isMobile, saveData, ready } = state;
  const motionEnabled = React.useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot
  );

  return React.useMemo<PerfProfile>(() => {
    const reducedMotion = rawReducedMotion && !motionEnabled;
    // Only explicit, reliable intent disables the 3D scene: reduced-motion or
    // Data Saver. Viewport size (a real media query) just scales quality down;
    // it never removes the scene. No capability heuristics — see detectSaveData.
    const lowEnd = saveData;
    const disable3D = reducedMotion || saveData;
    const disableDecorative = reducedMotion;
    const particleCount = disableDecorative ? 0 : isMobile ? 30 : 100;
    const maxDpr = isMobile ? 1.5 : 2;
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
  }, [rawReducedMotion, motionEnabled, isMobile, saveData, ready]);
}
