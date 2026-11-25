"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_LAYOUT,
  MOTION_STAGGER,
  MOTION_SCROLL,
} from "./motion.config";
import { registerMotionPlugins } from "./registerMotionPlugins";

type RevealVariant = "clip" | "strips" | "parallax";
type TriggerMode = "scroll" | "loader" | "immediate" | "external";

type RevealImageProps = {
  src: string;
  alt: string;
  variant?: RevealVariant;
  trigger?: TriggerMode;
  aspectRatio?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  delay?: number;
  hover?: boolean;
  parallax?: boolean;
  stripCount?: number;
};

export default function RevealImage(props: RevealImageProps) {
  const variant = props.variant ?? "clip";
  return <RevealImageContent key={variant} {...props} />;
}

function RevealImageContent({
  src,
  alt,
  variant = "clip",
  trigger = "scroll",
  aspectRatio = "4 / 3",
  className,
  sizes = "100vw",
  priority = false,
  delay = 0,
  hover = true,
  parallax = true,
  stripCount,
}: RevealImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [stripsVisible, setStripsVisible] = useState(variant === "strips");
  const count = stripCount ?? (isMobile ? MOTION_LAYOUT.mobileStrips : MOTION_LAYOUT.desktopStrips);
  const stripIndexes = useMemo(() => Array.from({ length: count }, (_, index) => index), [count]);

  const refreshScrollTrigger = useCallback(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOTION_LAYOUT.mobileBreakpoint - 1}px)`);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!frame || !image) return;
    if (trigger === "external") {
      const finishExternalReveal = () => setStripsVisible(false);
      window.addEventListener(
        "motion:reveal-image-complete",
        finishExternalReveal,
        { once: true },
      );
      return () =>
        window.removeEventListener(
          "motion:reveal-image-complete",
          finishExternalReveal,
        );
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    registerMotionPlugins();
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    let removeLoaderListener: (() => void) | null = null;
    const context = gsap.context(() => {
      const animate = () => {
        const mobileFactor = isMobile ? 0.75 : 1;
        const scrollTrigger =
          trigger === "scroll"
            ? {
                trigger: frame,
                start: MOTION_LAYOUT.scrollStart,
                toggleActions: "play none none none" as const,
                once: true,
              }
            : undefined;

        const playClipReveal = () => {
          const timeline = gsap.timeline(
            scrollTrigger ? { delay, scrollTrigger } : { delay },
          );
          timeline
            .fromTo(
              frame,
              { clipPath: "inset(100% 0 0 0)" },
              {
                clipPath: "inset(0% 0 0 0)",
                duration: MOTION_DURATION.image * mobileFactor,
                ease: MOTION_EASE.image,
                clearProps: "clipPath",
              },
            )
            .fromTo(
              image,
              { scale: 1.3 },
              {
                scale: 1,
                duration: MOTION_DURATION.image * mobileFactor,
                ease: MOTION_EASE.image,
                clearProps: "transform",
              },
              0,
            );
          return timeline;
        };

        if (variant === "strips") {
          gsap.set(image, { autoAlpha: 0 });
          const stripElements = frame.querySelectorAll<HTMLElement>("[data-reveal-strip]");
          const timeline = gsap.timeline({
            delay,
            onComplete: () => setStripsVisible(false),
          });
          timeline.fromTo(
            stripElements,
            { yPercent: 100, autoAlpha: 0, filter: "blur(10px)" },
            {
              yPercent: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: MOTION_DURATION.image * mobileFactor,
              stagger: MOTION_STAGGER.strip,
              ease: MOTION_EASE.image,
              clearProps: "transform,opacity,visibility,filter",
            },
          );
          timeline.fromTo(
            image,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.01,
              clearProps: "opacity,visibility",
              onComplete: () => setStripsVisible(false),
            },
            ">",
          );
          return timeline;
        }

        if (variant === "parallax") {
          const reveal = playClipReveal();
          if (parallax && !isTouch) {
            gsap.fromTo(
              image,
              { yPercent: MOTION_SCROLL.parallaxFrom },
              {
                yPercent: MOTION_SCROLL.parallaxTo,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          }
          return reveal;
        }

        return playClipReveal();
      };

      if (trigger === "immediate") {
        animate();
      } else if (trigger === "loader") {
        let started = false;
        const handleLoaderExit = () => {
          if (started) return;
          started = true;
          context.add(animate);
        };
        window.addEventListener("motion:loader-exit", handleLoaderExit);
        if (document.documentElement.dataset.motionReady === "true") {
          requestAnimationFrame(handleLoaderExit);
        }
        removeLoaderListener = () =>
          window.removeEventListener("motion:loader-exit", handleLoaderExit);
      } else if (variant !== "strips") {
        if (variant === "parallax") {
          animate();
        } else {
          animate();
        }
      } else {
        gsap.set(image, { autoAlpha: 0 });
        const stripElements = frame.querySelectorAll<HTMLElement>("[data-reveal-strip]");
        gsap.fromTo(
          stripElements,
          { yPercent: 100, autoAlpha: 0, filter: "blur(10px)" },
          {
            yPercent: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: MOTION_DURATION.image * (isMobile ? 0.75 : 1),
            delay,
            stagger: MOTION_STAGGER.strip,
            ease: MOTION_EASE.image,
            clearProps: "transform,opacity,visibility,filter",
            onComplete: () => setStripsVisible(false),
            scrollTrigger: {
              trigger: frame,
              start: MOTION_LAYOUT.scrollStart,
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      }
    }, frame);

    return () => {
      removeLoaderListener?.();
      context.revert();
    };
  }, [delay, isMobile, parallax, trigger, variant]);

  const frameStyle = { aspectRatio } as CSSProperties;

  return (
    <div
      ref={frameRef}
      className={["reveal-image-frame", hover ? "has-hover" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={frameStyle}
      data-reveal-image
      data-parallax={variant === "parallax" && parallax ? "true" : undefined}
    >
      <Image
        ref={imageRef}
        className="reveal-image-inner"
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        onLoad={refreshScrollTrigger}
        data-motion-hero={trigger === "loader" || priority ? "" : undefined}
      />
      {variant === "strips" && stripsVisible && (
        <div className="reveal-image-strips" aria-hidden="true">
          {stripIndexes.map((index) => (
            <span
              className="reveal-image-strip"
              data-reveal-strip
              key={index}
              style={
                {
                  "--strip-index": index,
                  "--strip-count": count,
                  backgroundImage: `url("${src}")`,
                  backgroundPosition: `${count === 1 ? 0 : (index / (count - 1)) * 100}% center`,
                  backgroundSize: `${count * 100}% 100%`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
