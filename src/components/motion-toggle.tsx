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
  const Icon = motionOn ? Zap : ZapOff;

  return (
    <button
      type="button"
      onClick={() => setMotionPreference(reducedMotion ? "on" : "off")}
      aria-pressed={reducedMotion}
      aria-label={motionOn ? "Reduce motion and disable 3D" : "Enable motion and 3D"}
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/10 px-3.5 py-2.5",
        "text-left backdrop-blur-sm transition-colors duration-300",
        "hover:border-border/80 hover:bg-secondary/20",
        className
      )}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      <span className="flex flex-col leading-tight">
        <span className="text-xs font-medium text-foreground/70 transition-colors group-hover:text-foreground">
          {motionOn ? "Reduce motion" : "Enable motion"}
        </span>
        <span className="text-[11px] text-muted-foreground/70">
          {motionOn ? "Turn off 3D & animations" : "Turn on 3D & animations"}
        </span>
      </span>
    </button>
  );
}
