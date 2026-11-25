"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_LAYOUT,
  MOTION_STAGGER,
} from "./motion.config";
import { registerMotionPlugins } from "./registerMotionPlugins";

type SplitMode = "lines" | "words" | "chars";
type AnimationMode = "lines" | "chars" | "words" | "highlight";
type TriggerMode = "scroll" | "loader" | "immediate" | "external";
type SplitTag = "div" | "span" | "p" | "h1" | "h2";

export function getCharTrackingX(_index: number, target: HTMLElement) {
  const fontSize = Number.parseFloat(getComputedStyle(target).fontSize);
  return Number(target.dataset.charIndex ?? 0) * fontSize * 0.055;
}

type SplitTextProps = {
  text: string;
  split?: SplitMode;
  animation?: AnimationMode;
  trigger?: TriggerMode;
  as?: SplitTag;
  className?: string;
  start?: string;
  delay?: number;
  ariaHidden?: boolean;
};

function getWordGroups(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

export default function SplitText({
  text,
  split,
  animation = "lines",
  trigger = "scroll",
  as = "div",
  className,
  start = MOTION_LAYOUT.scrollStart,
  delay = 0,
  ariaHidden = false,
}: SplitTextProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const previousWidth = useRef(0);
  const [lines, setLines] = useState<string[] | null>(null);
  const mode = split ?? (animation === "chars" ? "chars" : animation === "lines" ? "lines" : "words");
  const words = useMemo(() => getWordGroups(text), [text]);
  const Tag = as;

  useEffect(() => {
    if (mode !== "lines" || !elementRef.current || !measureRef.current) return;
    const root = elementRef.current;
    const measure = measureRef.current;
    let frame = 0;

    const remeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = root.getBoundingClientRect().width;
        if (!width || Math.abs(width - previousWidth.current) < 1) return;
        previousWidth.current = width;
        const spans = Array.from(measure.querySelectorAll<HTMLElement>("[data-measure-word]"));
        const grouped: string[][] = [];
        let lineTop = Number.NaN;
        spans.forEach((span) => {
          const top = Math.round(span.getBoundingClientRect().top);
          if (!Number.isFinite(lineTop) || Math.abs(top - lineTop) > 2) {
            grouped.push([]);
            lineTop = top;
          }
          grouped[grouped.length - 1].push(span.textContent ?? "");
        });
        setLines(grouped.map((line) => line.join(" ")));
      });
    };

    remeasure();
    const observer = new ResizeObserver(remeasure);
    observer.observe(root);
    window.addEventListener("resize", remeasure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", remeasure);
    };
  }, [mode, text, words]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || (mode === "lines" && !lines?.length)) return;
    if (trigger === "external") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    registerMotionPlugins();
    let removeLoaderListener: (() => void) | null = null;
    const context = gsap.context(() => {
      const lineInners = element.querySelectorAll<HTMLElement>("[data-split-line-inner]");
      const charInners = element.querySelectorAll<HTMLElement>("[data-split-char-inner]");
      const wordInners = element.querySelectorAll<HTMLElement>("[data-split-word-inner]");
      const allWords = element.querySelectorAll<HTMLElement>("[data-split-highlight-word]");
      const play = () => {
        if (animation === "lines") {
          gsap.fromTo(
            lineInners,
            { yPercent: 110, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: MOTION_DURATION.text,
              delay,
              stagger: MOTION_STAGGER.line,
              ease: MOTION_EASE.entrance,
              clearProps: "transform,opacity,visibility",
            },
          );
        } else if (animation === "chars") {
          const timeline = gsap.timeline({ delay });
          timeline
            .fromTo(
              charInners,
              { yPercent: 110, autoAlpha: 0, x: getCharTrackingX },
              {
                yPercent: 0,
                autoAlpha: 1,
                x: 0,
                duration: MOTION_DURATION.text,
                stagger: MOTION_STAGGER.char,
                ease: MOTION_EASE.entrance,
                clearProps: "transform,opacity,visibility",
              },
            );
        } else if (animation === "words") {
          gsap.fromTo(
            wordInners,
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: MOTION_DURATION.text,
              delay,
              stagger: MOTION_STAGGER.word,
              ease: MOTION_EASE.entrance,
              clearProps: "transform,opacity,visibility",
            },
          );
        } else {
          gsap.set(allWords, { autoAlpha: 0.2 });
          gsap.to(allWords, {
            autoAlpha: 1,
            stagger: MOTION_STAGGER.word,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start,
              end: "bottom 25%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      };

      if (trigger === "immediate") {
        play();
      } else if (trigger === "loader") {
        const handleLoaderExit = () => context.add(play);
        window.addEventListener("motion:loader-exit", handleLoaderExit, { once: true });
        if (document.documentElement.dataset.motionReady === "true") {
          requestAnimationFrame(() => context.add(play));
        }
        removeLoaderListener = () =>
          window.removeEventListener("motion:loader-exit", handleLoaderExit);
      } else if (animation === "highlight") {
        play();
      } else {
        const targets = animation === "lines" ? lineInners : animation === "chars" ? charInners : wordInners;
        gsap.fromTo(
          targets,
          animation === "lines" || animation === "chars"
            ? {
                yPercent: 110,
                autoAlpha: 0,
                x: animation === "chars" ? getCharTrackingX : undefined,
              }
            : { y: 24, autoAlpha: 0 },
          {
            yPercent: animation === "lines" || animation === "chars" ? 0 : undefined,
            y: animation === "lines" || animation === "chars" ? undefined : 0,
            x: animation === "chars" ? 0 : undefined,
            autoAlpha: 1,
            duration: MOTION_DURATION.text,
            delay,
            stagger:
              animation === "lines"
                ? MOTION_STAGGER.line
                : animation === "chars"
                  ? MOTION_STAGGER.char
                  : MOTION_STAGGER.word,
            ease: MOTION_EASE.entrance,
            clearProps: "transform,opacity,visibility",
            scrollTrigger: {
              trigger: element,
              start,
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      }

    }, element);

    return () => {
      removeLoaderListener?.();
      context.revert();
    };
  }, [animation, delay, lines, mode, start, text, trigger]);

  const visual = (() => {
    if (mode === "lines") {
      if (!lines?.length) return text;
      return lines.map((line, index) => (
        <span className="split-line-mask" key={`${index}-${line}`}>
          <span data-split-line-inner>{line}</span>
        </span>
      ));
    }

    if (mode === "chars") {
      return words.map((word, wordIndex) => (
        <span className="split-char-word" key={`${word}-${wordIndex}`}>
          {Array.from(word).map((char, charIndex) => (
            <span className="split-char-mask" key={`${charIndex}-${char}`}>
              <span data-split-char-inner data-char-index={charIndex}>
                {char === " " ? "\u00a0" : char}
              </span>
            </span>
          ))}
        </span>
      ));
    }

    return words.map((word, index) => (
      <span
        className="split-word-mask"
        data-split-highlight-word={animation === "highlight" ? "" : undefined}
        key={`${index}-${word}`}
      >
        <span data-split-word-inner>{word}</span>
        {index < words.length - 1 ? " " : ""}
      </span>
    ));
  })();

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        elementRef.current = node;
      }}
      className={["split-text", className].filter(Boolean).join(" ")}
      aria-label={ariaHidden ? undefined : text}
      aria-hidden={ariaHidden || undefined}
      style={{ display: "block" }}
    >
      <span className="split-text-sr-only">{text}</span>
      <span className={`split-text-visual split-mode-${mode}`} aria-hidden="true">
        {visual}
      </span>
      {mode === "lines" && (
        <span className="split-text-measure" ref={measureRef} aria-hidden="true">
          {words.map((word, index) => (
            <span data-measure-word key={`${index}-${word}`}>{word} </span>
          ))}
        </span>
      )}
    </Tag>
  );
}

export function MotionCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const formattedValue = (number: number) =>
      `${prefix}${number.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = formattedValue(value);
      return;
    }

    registerMotionPlugins();
    element.textContent = formattedValue(0);
    const counter = { value: 0 };
    const context = gsap.context(() => {
      gsap.to(counter, {
        value,
        duration: 1.6,
        ease: MOTION_EASE.entrance,
        scrollTrigger: {
          trigger: element,
          start: MOTION_LAYOUT.scrollStart,
          toggleActions: "play none none none",
          once: true,
        },
        onUpdate: () => {
          element.textContent = formattedValue(counter.value);
        },
      });
    }, element);
    return () => context.revert();
  }, [decimals, prefix, suffix, value]);

  return (
    <span
      ref={ref}
      className={["motion-counter", className].filter(Boolean).join(" ")}
      aria-label={`${prefix}${value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`}
    >
      {prefix}{value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}{suffix}
    </span>
  );
}
