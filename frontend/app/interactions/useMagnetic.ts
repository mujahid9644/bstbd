"use client";

import { useEffect } from "react";

type CachedBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const MAGNETIC_RANGE = 80;

export default function useMagnetic() {
  useEffect(() => {
    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    let active: HTMLElement | null = null;
    let targets: Array<{ element: HTMLElement; bounds: CachedBounds }> = [];
    let measureFrame = 0;
    const resetTimers = new Map<HTMLElement, number>();

    const measureTargets = () => {
      measureFrame = 0;
      if (!pointerQuery.matches) {
        targets = [];
        return;
      }
      targets = Array.from(
        document.querySelectorAll<HTMLElement>(
          "button:not([data-no-magnetic]), [data-magnetic]",
        ),
      ).map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element,
          bounds: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          },
        };
      });
    };

    const scheduleMeasure = () => {
      if (!pointerQuery.matches) {
        targets = [];
        if (active) {
          release(active);
          active = null;
        }
      }
      if (!measureFrame) measureFrame = window.requestAnimationFrame(measureTargets);
    };

    const release = (element: HTMLElement) => {
      element.style.setProperty("translate", "0 0");
      const previousTimer = resetTimers.get(element);
      if (previousTimer) window.clearTimeout(previousTimer);
      resetTimers.set(
        element,
        window.setTimeout(() => {
          element.style.removeProperty("translate");
          element.classList.remove("is-magnetic-active");
          resetTimers.delete(element);
        }, 450),
      );
    };

    const engage = (element: HTMLElement) => {
      const resetTimer = resetTimers.get(element);
      if (resetTimer) {
        window.clearTimeout(resetTimer);
        resetTimers.delete(element);
      }
      element.classList.add("is-magnetic-active");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerQuery.matches) return;
      let next: { element: HTMLElement; bounds: CachedBounds } | null = null;
      let nearestDistance = MAGNETIC_RANGE;
      for (const target of targets) {
        if (!target.element.isConnected) continue;
        const centerX = target.bounds.left + target.bounds.width / 2;
        const centerY = target.bounds.top + target.bounds.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
        if (distance <= nearestDistance) {
          next = target;
          nearestDistance = distance;
        }
      }

      if (next?.element !== active) {
        if (active) release(active);
        active = next?.element ?? null;
        if (active) engage(active);
      }

      if (!active || !next) return;
      const centerX = next.bounds.left + next.bounds.width / 2;
      const centerY = next.bounds.top + next.bounds.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      if (!distance) {
        active.style.setProperty("translate", "0 0");
        return;
      }
      const strength = Math.min(1, (MAGNETIC_RANGE - distance) / MAGNETIC_RANGE);
      const amount = Math.min(12, distance * strength * 0.6);
      const x = distance ? (deltaX / distance) * amount : 0;
      const y = distance ? (deltaY / distance) * amount : 0;
      active.style.setProperty("translate", `${x.toFixed(2)}px ${y.toFixed(2)}px`);
    };

    const observer = new MutationObserver(scheduleMeasure);
    observer.observe(document.body, { childList: true, subtree: true });
    scheduleMeasure();

    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    pointerQuery.addEventListener("change", scheduleMeasure);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure);
      pointerQuery.removeEventListener("change", scheduleMeasure);
      document.removeEventListener("pointermove", onPointerMove);
      if (measureFrame) window.cancelAnimationFrame(measureFrame);
      resetTimers.forEach((timer, element) => {
        window.clearTimeout(timer);
        element.style.removeProperty("translate");
        element.classList.remove("is-magnetic-active");
      });
      if (active) {
        active.style.removeProperty("translate");
        active.classList.remove("is-magnetic-active");
      }
    };
  }, []);
}
