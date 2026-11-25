"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import RevealImage from "./RevealImage";
import SplitText, { getCharTrackingX, MotionCounter } from "./SplitText";
import useReveal from "./useReveal";
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_STAGGER,
} from "./motion.config";

function HeroSequence() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    delete document.documentElement.dataset.motionHeroStarted;
    delete document.documentElement.dataset.motionHeroReady;

    let removeLoaderListener: (() => void) | null = null;
    const context = gsap.context(() => {
      const characters = hero.querySelectorAll("[data-split-char-inner]");
      const strips = hero.querySelectorAll("[data-reveal-strip]");
      const image = hero.querySelector(".motion-hero-image");
      const subtext = hero.querySelectorAll("[data-split-word-inner]");
      const nav = hero.querySelector("[data-hero-nav]");

      gsap.set(characters, {
        yPercent: 110,
        autoAlpha: 0,
        x: getCharTrackingX,
      });
      gsap.set(strips, { yPercent: 100, autoAlpha: 0, filter: "blur(10px)" });
      gsap.set(image, { autoAlpha: 0 });
      gsap.set(subtext, { y: 24, autoAlpha: 0 });
      gsap.set(nav, { y: -16, autoAlpha: 0 });

      const playHero = () => {
        document.documentElement.dataset.motionHeroStarted = "true";
        delete document.documentElement.dataset.motionHeroReady;
        const timeline = gsap.timeline();
        timeline
            .fromTo(
              characters,
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
            )
            .to(
              strips,
              {
                yPercent: 0,
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: MOTION_DURATION.image * 0.75,
                stagger: MOTION_STAGGER.strip,
                ease: MOTION_EASE.image,
                clearProps: "transform,opacity,visibility,filter",
              },
              "-=0.45",
            )
            .to(image, { autoAlpha: 1, duration: 0.01 }, ">")
            .fromTo(
              subtext,
              { y: 24, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: MOTION_DURATION.text,
                stagger: MOTION_STAGGER.word,
                ease: MOTION_EASE.entrance,
                clearProps: "transform,opacity,visibility",
              },
              "-=0.35",
            )
            .fromTo(
              nav,
              { y: -16, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: MOTION_DURATION.text,
                ease: MOTION_EASE.entrance,
                clearProps: "transform,opacity,visibility",
              },
              "-=0.55",
            )
          .call(() => {
            document.documentElement.dataset.motionHeroReady = "true";
            window.dispatchEvent(new CustomEvent("motion:reveal-image-complete"));
          });
      };
      const startHero = () => context.add(playHero);

      window.addEventListener("motion:loader-exit", startHero, { once: true });
      removeLoaderListener = () =>
        window.removeEventListener("motion:loader-exit", startHero);
      if (document.documentElement.dataset.motionReady === "true") {
        requestAnimationFrame(startHero);
      }
    }, hero);

    return () => {
      removeLoaderListener?.();
      context.revert();
    };
  }, []);

  return (
    <section className="motion-demo-hero" ref={heroRef}>
      <div className="motion-demo-hero-image">
        <RevealImage
          src="/images/hero.jpg"
          alt="Modern glass towers reaching into the sky"
          variant="strips"
          trigger="external"
          aspectRatio="16 / 9"
          priority
          hover
          className="motion-hero-image"
        />
      </div>
      <nav className="motion-demo-nav" data-hero-nav aria-label="Demo navigation">
        <Link className="motion-link" href="/projects">Explore projects</Link>
      </nav>
      <div className="motion-demo-hero-copy">
        <p className="motion-demo-kicker">Architecture · Place · Purpose</p>
        <SplitText
          as="h1"
          className="motion-demo-title"
          text="Built to shape the horizon."
          animation="chars"
          trigger="external"
        />
        <SplitText
          as="p"
          className="motion-demo-copy"
          text="A confident, considered approach to creating the places where the future takes shape."
          animation="words"
          trigger="external"
        />
      </div>
    </section>
  );
}

function StatementSection() {
  const ref = useReveal<HTMLElement>();
  return (
    <section className="motion-demo-section" ref={ref}>
      <p className="motion-demo-kicker">The Aurelia perspective</p>
      <SplitText
        as="h2"
        className="motion-demo-statement"
        text="We believe the most enduring places do more than occupy a skyline. They give a city room to imagine what comes next."
        split="words"
        animation="highlight"
      />
    </section>
  );
}

function EditorialSection() {
  const textRef = useReveal<HTMLDivElement>();
  return (
    <section className="motion-demo-columns">
      <div ref={textRef}>
        <p className="motion-demo-kicker">Built around people</p>
        <h2>Considered in every detail.</h2>
        <p>
          From the first gesture of a building to the quiet moments within it,
          every decision is an opportunity to make a better place. We bring
          architecture, material and landscape together with purpose.
        </p>
        <Link className="motion-link" href="/about-us">Discover our approach</Link>
      </div>
      <RevealImage
        src="/images/project2.jpg"
        alt="Quiet contemporary architectural residence"
        variant="parallax"
        aspectRatio="4 / 5"
        sizes="(max-width: 767px) 100vw, 48vw"
        className="motion-demo-parallax"
      />
    </section>
  );
}

function StatsSection() {
  return (
    <section className="motion-demo-stats" aria-label="Company highlights">
      <div className="motion-demo-stat">
        <strong><MotionCounter value={28} suffix="+" /></strong>
        Years of perspective
      </div>
      <div className="motion-demo-stat">
        <strong><MotionCounter value={42} /></strong>
        Completed addresses
      </div>
      <div className="motion-demo-stat">
        <strong><MotionCounter value={1.8} suffix="M" decimals={1} /></strong>
        Square feet delivered
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <section className="motion-demo-gallery">
      <p className="motion-demo-kicker">Selected moments</p>
      <h2 className="motion-demo-heading">Spaces with a point of view.</h2>
      <div className="motion-demo-gallery-grid">
        <RevealImage
          src="/images/project1.jpg"
          alt="High-rise architectural facade"
          delay={0}
          aspectRatio="5 / 4"
          sizes="(max-width: 767px) 100vw, 56vw"
        />
        <RevealImage
          src="/images/about.jpg"
          alt="Modern building framed by landscape"
          delay={MOTION_STAGGER.grid}
          aspectRatio="4 / 5"
          sizes="(max-width: 767px) 100vw, 36vw"
        />
        <RevealImage
          src="/images/project3.jpg"
          alt="Contemporary residence in natural light"
          delay={MOTION_STAGGER.grid * 2}
          aspectRatio="16 / 8"
          sizes="(max-width: 767px) 100vw, 68vw"
        />
      </div>
    </section>
  );
}

export default function MotionDemo() {
  return (
    <main className="motion-demo">
      <HeroSequence />
      <StatementSection />
      <EditorialSection />
      <StatsSection />
      <GallerySection />
    </main>
  );
}
