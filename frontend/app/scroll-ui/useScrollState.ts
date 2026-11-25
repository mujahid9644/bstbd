"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SCROLL_UI_CONFIG } from "./scroll-ui.config";

export type ScrollDirection = "up" | "down";
export type ScrollState = {
  y: number;
  direction: ScrollDirection;
  isScrolling: boolean;
};
type RouteScrollState = ScrollState & { pathname: string | null };

function getScrollY() {
  const lenisY = document.documentElement.dataset.lenisScrollY;
  if (document.documentElement.dataset.lenisActive === "true" && lenisY) {
    const parsedY = Number(lenisY);
    if (Number.isFinite(parsedY)) return parsedY;
  }
  return window.scrollY;
}

export default function useScrollState(): ScrollState {
  const pathname = usePathname();
  const [state, setState] = useState<RouteScrollState>({
    y: 0,
    direction: "up",
    isScrolling: false,
    pathname,
  });

  useEffect(() => {
    let frame = 0;
    let initialFrame = 0;
    let idleTimer = 0;
    let directionAnchor = getScrollY();

    const updateScrollState = () => {
      frame = 0;
      const y = getScrollY();
      const delta = y - directionAnchor;
      let direction: ScrollDirection | null = null;

      if (Math.abs(delta) >= SCROLL_UI_CONFIG.directionThreshold) {
        direction = delta > 0 ? "down" : "up";
        directionAnchor = y;
      }

      setState((current) => ({
        y,
        direction:
          direction ??
          (current.pathname === pathname ? current.direction : "up"),
        isScrolling: true,
        pathname,
      }));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollState);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        setState((current) => ({ ...current, isScrolling: false }));
      }, SCROLL_UI_CONFIG.scrollingIdleDelay);
    };

    initialFrame = window.requestAnimationFrame(() => {
      const y = getScrollY();
      directionAnchor = y;
      setState({ y, direction: "up", isScrolling: false, pathname });
    });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(initialFrame);
      window.clearTimeout(idleTimer);
    };
  }, [pathname]);

  return state.pathname === pathname
    ? state
    : { y: 0, direction: "up", isScrolling: false };
}
