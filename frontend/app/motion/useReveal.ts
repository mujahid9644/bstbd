"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MOTION_DURATION, MOTION_EASE, MOTION_LAYOUT } from "./motion.config";
import { registerMotionPlugins } from "./registerMotionPlugins";

type RevealOptions = {
  distance?: number;
  duration?: number;
  delay?: number;
  start?: string;
  once?: boolean;
};

export default function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    distance = 28,
    duration = MOTION_DURATION.section,
    delay = 0,
    start = MOTION_LAYOUT.scrollStart,
    once = true,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerMotionPlugins();
    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: distance, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration,
          delay,
          ease: MOTION_EASE.entrance,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: element,
            start,
            toggleActions: once ? "play none none none" : "play none none reverse",
            once,
          },
        },
      );
    }, element);

    return () => context.revert();
  }, [delay, distance, duration, once, start]);

  return ref;
}
