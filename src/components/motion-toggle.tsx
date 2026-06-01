"use client";

import { Zap, ZapOff } from "lucide-react";
import { setMotionPreference, usePerfProfile } from "@/hooks/use-perf-profile";
import { cn } from "@/lib/utils";

/**
 * Menu control to toggle reduced motion. Flips the effective motion state to an
 * explicit, persisted preference: turning it off drops the 3D scene, particles
 * and decorative animations; turning it on brings them back — overriding the OS
 * `prefers-reduced-motion` setting either way.
 */
export default function MotionToggle({ className }: { className?: string }) {
  const { ready, reducedMotion } = usePerfProfile();
  // Until client detection runs, render the stable "motion on" state to match SSR.
  const motionOn = ready ? !reducedMotion : true;

  return (
    <button
      type="button"
      onClick={() => setMotionPreference(reducedMotion ? "on" : "off")}
      aria-pressed={reducedMotion}
      aria-label={motionOn ? "Reduce motion and disable 3D" : "Enable motion and 3D"}
      title={motionOn ? "Motion on — click to reduce" : "Reduced motion — click to enable"}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      {motionOn ? <Zap className="size-5" /> : <ZapOff className="size-5" />}
      <span className="sr-only">{motionOn ? "Reduce motion" : "Enable motion"}</span>
    </button>
  );
}
