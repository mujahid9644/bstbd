"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { MOTION_SCROLL } from "./motion.config";
import { registerMotionPlugins } from "./registerMotionPlugins";
import { SCROLL_UI_CONFIG } from "../scroll-ui/scroll-ui.config";

export default function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    registerMotionPlugins();

    const lenis = new Lenis({
      autoRaf: false,
      lerp: MOTION_SCROLL.lerp,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    document.documentElement.dataset.lenisActive = "true";
    document.documentElement.dataset.lenisScrollY = String(lenis.scroll);

    const updateScrollTrigger = (event: { scroll: number }) => {
      document.documentElement.dataset.lenisScrollY = String(event.scroll);
      ScrollTrigger.update();
    };
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const syncScrollLock = () => {
      const paused =
        document.documentElement.dataset.motionScrollLocked === "true" ||
        document.documentElement.dataset.menuScrollLocked === "true";
      if (paused) lenis.stop();
      else lenis.start();
    };
    const handleScrollLock = (event: Event) => {
      const paused = (event as CustomEvent<boolean>).detail;
      document.documentElement.dataset.motionScrollLocked = String(paused);
      syncScrollLock();
    };
    const handleScrollToTop = () => {
      lenis.scrollTo(0, {
        duration: SCROLL_UI_CONFIG.scrollToTopDuration,
        easing: (time) =>
          time < 0.5
            ? 4 * time * time * time
            : 1 - Math.pow(-2 * time + 2, 3) / 2,
      });
    };
    const handleMenuScrollLock = () => syncScrollLock();
    window.addEventListener("motion:scroll-lock", handleScrollLock);
    window.addEventListener("motion:menu-scroll-lock", handleMenuScrollLock);
    window.addEventListener("motion:menu-scroll-unlock", handleMenuScrollLock);
    window.addEventListener("motion:scroll-to-top", handleScrollToTop);
    syncScrollLock();

    return () => {
      window.removeEventListener("motion:scroll-lock", handleScrollLock);
      window.removeEventListener("motion:menu-scroll-lock", handleMenuScrollLock);
      window.removeEventListener("motion:menu-scroll-unlock", handleMenuScrollLock);
      window.removeEventListener("motion:scroll-to-top", handleScrollToTop);
      gsap.ticker.remove(raf);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();
      lenisRef.current = null;
      delete document.documentElement.dataset.lenisActive;
      delete document.documentElement.dataset.lenisScrollY;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return lenisRef;
}
