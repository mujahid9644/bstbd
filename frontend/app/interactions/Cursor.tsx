"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useMagnetic from "./useMagnetic";

type CursorMode = "default" | "link" | "view" | "drag" | "hide";

const CURSOR_SELECTOR =
  "a, button, [role='button'], .project-card, .business-card, .listing-card, .hero-slide, [data-cursor]";
const MAX_RING_DISTANCE = 8;

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  useMagnetic();

  useEffect(() => {
    const capabilityQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    );
    const updateCapability = () => setEnabled(capabilityQuery.matches);
    updateCapability();
    capabilityQuery.addEventListener("change", updateCapability);
    return () => capabilityQuery.removeEventListener("change", updateCapability);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!enabled) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    root.classList.add("has-custom-cursor");
    let pointerX = -100;
    let pointerY = -100;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;
    let mode: CursorMode = "default";
    root.dataset.cursorOutside = "true";

    const render = () => {
      frame = 0;
      if (motionQuery.matches) {
        ringX = pointerX;
        ringY = pointerY;
      } else {
        ringX += (pointerX - ringX) * 0.45;
        ringY += (pointerY - ringY) * 0.45;
        const distanceX = pointerX - ringX;
        const distanceY = pointerY - ringY;
        const distance = Math.hypot(distanceX, distanceY);
        if (distance > MAX_RING_DISTANCE) {
          ringX = pointerX - (distanceX / distance) * MAX_RING_DISTANCE;
          ringY = pointerY - (distanceY / distance) * MAX_RING_DISTANCE;
        }
      }

      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      if (Math.hypot(pointerX - ringX, pointerY - ringY) > 0.05) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const setMode = (nextMode: CursorMode) => {
      if (mode === nextMode) return;
      mode = nextMode;
      root.dataset.cursorMode = nextMode;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      delete root.dataset.cursorOutside;
      requestRender();
      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest(CURSOR_SELECTOR);
      let nextMode: CursorMode = "default";

      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        nextMode = "hide";
      } else if (interactive) {
        if (!interactive.hasAttribute("data-cursor")) {
          interactive.setAttribute(
            "data-cursor",
            interactive.matches(".project-card, .business-card, .listing-card, .hero-slide")
              ? "view"
              : "link",
          );
        }
        const value = interactive.getAttribute("data-cursor");
        if (value === "link" || value === "view" || value === "drag" || value === "hide") {
          nextMode = value;
        }
      }
      setMode(nextMode);
    };

    const onMouseDown = () => {
      root.dataset.cursorPressed = "true";
    };
    const onMouseUp = () => {
      delete root.dataset.cursorPressed;
    };
    const onWindowLeave = () => {
      root.dataset.cursorOutside = "true";
      delete root.dataset.cursorPressed;
      setMode("default");
    };
    const onWindowEnter = (event: MouseEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      ringX = pointerX;
      ringY = pointerY;
      delete root.dataset.cursorOutside;
      setMode("default");
      requestRender();
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseup", onMouseUp, { passive: true });
    window.addEventListener("blur", onWindowLeave);
    document.addEventListener("mouseleave", onWindowLeave);
    document.addEventListener("mouseenter", onWindowEnter);
    requestRender();

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("blur", onWindowLeave);
      document.removeEventListener("mouseleave", onWindowLeave);
      document.removeEventListener("mouseenter", onWindowEnter);
      if (frame) window.cancelAnimationFrame(frame);
      delete root.dataset.cursorMode;
      delete root.dataset.cursorPressed;
      delete root.dataset.cursorOutside;
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled, pathname]);

  if (!enabled) return null;
  return (
    <div className="custom-cursor" aria-hidden="true">
      <div className="custom-cursor__dot" ref={dotRef} />
      <div className="custom-cursor__ring" ref={ringRef}>
        <div className="custom-cursor__ring-visual">
          <span className="custom-cursor__label custom-cursor__label--view">View</span>
          <span className="custom-cursor__label custom-cursor__label--drag">←&nbsp; Drag &nbsp;→</span>
        </div>
      </div>
    </div>
  );
}
