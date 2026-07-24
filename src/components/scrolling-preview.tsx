"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Pan speed (CSS px/sec).
const PAN_SPEED = 70;
const PAUSE = 1.2; // seconds held at top and bottom

// A page only pans if it overflows the frame by at least this fraction.
const MIN_SCROLL_OVERFLOW = 0.2;

const FALLBACK_BG = "linear-gradient(135deg, #1e293b, #0f172a)";

/**
 * Card preview that uses GPU-accelerated transform: translateY for the pan
 * animation — zero layout/paint cost per frame, always 60 fps.
 */
const ScrollingPreview = ({
  src,
  alt,
  bg,
}: {
  src: string;
  alt: string;
  bg?: string;
}) => {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [scrollPx, setScrollPx] = useState(0);
  const [bgReady, setBgReady] = useState(false);
  const [imgHeight, setImgHeight] = useState<number | null>(null);

  // Compute how much the image overflows the viewport
  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    const compute = () => {
      const vp = viewportRef.current;
      if (cancelled || !vp || !img.naturalWidth) return;
      const ratio = img.naturalHeight / img.naturalWidth;
      const displayedHeight = vp.clientWidth * ratio;
      const overflow = displayedHeight - vp.clientHeight;
      if (!cancelled) {
        setImgHeight(displayedHeight);
        setScrollPx(overflow > vp.clientHeight * MIN_SCROLL_OVERFLOW ? overflow : 0);
      }
    };
    img.onload = compute;
    img.src = src;
    if (img.complete) compute();
    window.addEventListener("resize", compute);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", compute);
    };
  }, [src]);

  // Preload background wallpaper
  useEffect(() => {
    if (!bg) { setBgReady(false); return; }
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => !cancelled && setBgReady(true);
    img.onerror = () => !cancelled && setBgReady(false);
    img.src = bg;
    return () => { cancelled = true; };
  }, [bg]);

  const scrolls = scrollPx > 0;
  const animate = !reduceMotion && scrolls;

  const pan = scrollPx / PAN_SPEED;
  const total = pan * 2 + PAUSE * 2;
  const times = [
    0,
    pan / total,
    (pan + PAUSE) / total,
    (pan * 2 + PAUSE) / total,
    1,
  ];

  return (
    <div
      className="pointer-events-none absolute inset-0"
      role="img"
      aria-label={alt}
    >
      {/* wallpaper background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0f172a",
          backgroundImage: bgReady && bg ? `url("${bg}")` : FALLBACK_BG,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* floating screenshot panel — overflow hidden clips the panning image */}
      <div
        ref={viewportRef}
        style={{
          position: "absolute",
          left: 22,
          right: 22,
          top: 20,
          bottom: 0,
          overflow: "hidden",
          borderRadius: 10,
          boxShadow:
            "0 24px 50px -12px rgba(8,20,55,0.55), 0 8px 18px -8px rgba(8,20,55,0.45)",
          border: "1px solid rgba(255,255,255,0.18)",
          backgroundColor: "#000",
        }}
      >
        {/*
          Key trick: the image sits ABOVE the viewport in a taller container,
          then we translateY it downward to pan. This is pure compositor work —
          no layout, no paint, always GPU.
        */}
        <motion.div
          ref={imgRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            // tall enough to contain the full image
            height: scrolls && imgHeight ? imgHeight : "100%",
            willChange: "transform",
          }}
          animate={
            animate
              ? { y: [0, -scrollPx, -scrollPx, 0, 0] }
              : { y: 0 }
          }
          transition={
            animate
              ? {
                  duration: total,
                  ease: "easeInOut",
                  repeat: Infinity,
                  times,
                }
              : undefined
          }
        >
          <img
            src={src}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: scrolls ? "auto" : "100%",
              objectFit: scrolls ? "fill" : "cover",
              objectPosition: "top center",
            }}
            loading="lazy"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollingPreview;
