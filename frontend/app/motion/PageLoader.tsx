"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { MOTION_DURATION, MOTION_EASE } from "./motion.config";

function dispatchLoaderExit() {
  document.documentElement.dataset.motionReady = "true";
  window.dispatchEvent(new CustomEvent("motion:loader-exit"));
}

function waitForHeroMedia() {
  const hero = document.querySelector<HTMLImageElement | HTMLVideoElement>(
    "[data-motion-hero]",
  );
  if (!hero) return Promise.resolve();
  const isVideo = hero instanceof HTMLVideoElement;
  if (isVideo ? hero.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA : hero.complete) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const finish = () => {
      window.clearTimeout(timeout);
      hero.removeEventListener(isVideo ? "loadeddata" : "load", finish);
      hero.removeEventListener("error", finish);
      resolve();
    };
    const timeout = window.setTimeout(finish, 8000);
    hero.addEventListener(isVideo ? "loadeddata" : "load", finish, { once: true });
    hero.addEventListener("error", finish, { once: true });
  });
}

export default function PageLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.classList.remove("is-visible");
    document.documentElement.classList.add("js");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      document.documentElement.dataset.motionReduced = "true";
      dispatchLoaderExit();
      return;
    }

    overlay.classList.add("is-visible");
    const startedAt = performance.now();
    let cancelled = false;
    let exitTween: gsap.core.Tween | null = null;
    let exitContext: gsap.Context | null = null;
    const previousOverflow = document.body.style.overflow;
    const setScrollLock = (locked: boolean) => {
      document.documentElement.dataset.motionScrollLocked = String(locked);
      document.body.style.overflow = locked ? "hidden" : previousOverflow;
      window.dispatchEvent(
        new CustomEvent("motion:scroll-lock", { detail: locked }),
      );
    };
    const releaseScroll = () => setScrollLock(false);
    setScrollLock(true);

    const revealPage = async () => {
      await Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        waitForHeroMedia(),
      ]);
      const remaining =
        MOTION_DURATION.loaderMinimum - (performance.now() - startedAt) / 1000;
      if (remaining > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remaining * 1000));
      }
      if (cancelled || !overlay) return;
      dispatchLoaderExit();
      exitContext = gsap.context(() => {
        exitTween = gsap.to(overlay, {
          yPercent: -100,
          duration: MOTION_DURATION.loader,
          ease: MOTION_EASE.loader,
          onComplete: () => {
            overlay.classList.remove("is-visible");
            releaseScroll();
          },
        });
      }, overlay);
    };

    void revealPage();
    return () => {
      cancelled = true;
      exitTween?.kill();
      exitContext?.revert();
      releaseScroll();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="page-loader"
      aria-hidden="true"
    >
      <span className="page-loader-logo">
        <Image
          className="page-loader-logo-base"
          src="/images/logo1.png"
          alt=""
          width={300}
          height={93}
          priority
        />
        <Image
          className="page-loader-logo-color"
          src="/images/logo1.png"
          alt=""
          width={300}
          height={93}
          priority
        />
      </span>
      <span className="page-loader-rule" />
    </div>
  );
}
