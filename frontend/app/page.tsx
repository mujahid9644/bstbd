"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import RevealImage from "./motion/RevealImage";
import SplitText, { getCharTrackingX } from "./motion/SplitText";
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_LAYOUT,
  MOTION_STAGGER,
} from "./motion/motion.config";
import { registerMotionPlugins } from "./motion/registerMotionPlugins";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    registerMotionPlugins();
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const imageLoadHandlers: Array<{
      image: HTMLImageElement;
      event: "load" | "error";
      handler: EventListener;
    }> = [];
    const context = gsap.context(() => {}, main);
    const startHero = () =>
      context.add(() => {
        const hero = main.querySelector<HTMLElement>(".hero");
        const heroImage = main.querySelector<HTMLElement>(".home-hero-image");
        const heroImageInner = heroImage?.querySelector("img");
        const heroStrips = heroImage?.querySelectorAll("[data-reveal-strip]");
        const heroCharacters = hero?.querySelectorAll<HTMLElement>("[data-split-char-inner]");
        const heroKicker = hero?.querySelector(".hero-kicker");
        const heroLink = hero?.querySelector(".hero-content .text-link");
        const header = document.querySelector(".site-header");
        if (
          !hero ||
          !heroImageInner ||
          !heroStrips ||
          !heroCharacters ||
          !heroKicker ||
          !heroLink ||
          !header
        ) {
          return;
        }

        gsap.set(heroCharacters, {
          yPercent: 110,
          autoAlpha: 0,
          x: getCharTrackingX,
        });
        gsap.set(heroKicker, { y: 18, autoAlpha: 0 });
        gsap.set(heroLink, { y: 18, autoAlpha: 0 });
        gsap.set(heroImageInner, { autoAlpha: 0, scale: 1.15 });
        gsap.set(heroStrips, {
          yPercent: 100,
          autoAlpha: 0,
          filter: "blur(10px)",
        });

        const timeline = gsap.timeline();
        timeline
          .fromTo(
            heroCharacters,
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
            heroStrips,
            {
              yPercent: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: MOTION_DURATION.image * 0.75 * (mobile ? 0.75 : 1),
              stagger: MOTION_STAGGER.strip,
              ease: MOTION_EASE.image,
              clearProps: "transform,opacity,visibility,filter",
            },
            "-=0.45",
          )
          .to(
            heroImageInner,
            {
              autoAlpha: 1,
              scale: 1,
              duration: MOTION_DURATION.image * (mobile ? 0.75 : 1),
              ease: MOTION_EASE.image,
              clearProps: "transform,opacity,visibility",
            },
            ">",
          )
          .to(
            heroKicker,
            {
              y: 0,
              autoAlpha: 1,
              duration: MOTION_DURATION.text,
              ease: MOTION_EASE.entrance,
              clearProps: "transform,opacity,visibility",
            },
            "-=0.4",
          )
          .to(
            heroLink,
            {
              y: 0,
              autoAlpha: 1,
              duration: MOTION_DURATION.text,
              ease: MOTION_EASE.entrance,
              clearProps: "transform,opacity,visibility",
            },
            "-=0.65",
          )
          .fromTo(
            header,
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
            window.dispatchEvent(new CustomEvent("motion:reveal-image-complete"));
          });

        main.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
          if (image.closest(".home-hero-image")) return;
          gsap.fromTo(
            image,
            { clipPath: "inset(100% 0 0 0)", scale: 1.2 },
            {
              clipPath: "inset(0% 0 0 0)",
              scale: 1,
              duration: MOTION_DURATION.image * (mobile ? 0.75 : 1),
              ease: MOTION_EASE.image,
              clearProps: "clipPath,transform",
              scrollTrigger: {
                trigger: image.parentElement ?? image,
                start: MOTION_LAYOUT.scrollStart,
                toggleActions: "play none none none",
                once: true,
              },
            },
          );

          if (!image.complete) {
            const refresh = () => ScrollTrigger.refresh();
            image.addEventListener("load", refresh, { once: true });
            image.addEventListener("error", refresh, { once: true });
            imageLoadHandlers.push(
              { image, event: "load", handler: refresh },
              { image, event: "error", handler: refresh },
            );
          }
        });

        const revealTargets = main.querySelectorAll<HTMLElement>(
          ".intro > div, .featured-top, .featured-meta, .projects-head, .project-info, .businesses-head, .business-card h3, .connect-left, .connect-card",
        );
        revealTargets.forEach((element, index) => {
          const staggerIndex =
            element.matches(".intro > div, .project-info, .business-card h3, .connect-card")
              ? index % 3
              : 0;
          gsap.fromTo(
            element,
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: MOTION_DURATION.section,
              delay: staggerIndex * MOTION_STAGGER.grid,
              ease: MOTION_EASE.entrance,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: element,
                start: MOTION_LAYOUT.scrollStart,
                toggleActions: "play none none none",
                once: true,
              },
            },
          );
        });
      });
    window.addEventListener("motion:loader-exit", startHero, { once: true });
    if (document.documentElement.dataset.motionReady === "true") {
      requestAnimationFrame(startHero);
    }

    return () => {
      window.removeEventListener("motion:loader-exit", startHero);
      imageLoadHandlers.forEach(({ image, event, handler }) => {
        image.removeEventListener(event, handler);
      });
      context.revert();
    };
  }, []);

  return (
    <main id="top" ref={mainRef}>
        <section className="hero">
          <RevealImage
            className="hero-image home-hero-image"
            src="/images/hero.jpg"
            alt="Modern illuminated architectural tower"
            variant="strips"
            trigger="external"
            aspectRatio="16 / 9"
            priority
            hover={false}
          />
          <div className="hero-content">
            <p className="hero-kicker">Architecture for tomorrow</p>
            <h1 aria-label="Elevating the skyline">
              <SplitText
                as="span"
                className="home-hero-line"
                text="Elevating"
                animation="chars"
                trigger="external"
                ariaHidden
              />
              <em>
                <SplitText
                  as="span"
                  className="home-hero-line"
                  text="the skyline"
                  animation="chars"
                  trigger="external"
                  ariaHidden
                />
              </em>
            </h1>
            <a className="text-link" href="#projects">Discover our projects <span>→</span></a>
          </div>
        </section>

        <section className="section intro" id="about">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2>Designed with purpose. Built for generations.</h2>
          </div>
          <div>
            <p className="intro-copy">Aurelia creates considered spaces that bring architecture, landscape and everyday life into balance. Each address combines enduring design, exceptional craftsmanship and a distinctly modern sense of belonging.</p>
            <a className="text-link" href="#contact" style={{ marginTop: 24 }}>Our story <span>→</span></a>
          </div>
        </section>

        <section className="featured" id="projects">
          <Image src="/images/project1.jpg" alt="Contemporary residential development" fill sizes="100vw" />
          <div className="featured-overlay">
            <div className="featured-top">
              <p className="eyebrow">Featured project</p>
              <p className="eyebrow">Dhaka · 2026</p>
            </div>
            <div className="featured-meta">
              <h2 className="featured-title">The Meridian</h2>
              <p>Private residences shaped around light, calm and uninterrupted city views.</p>
              <a className="text-link" href="#project-grid">View project <span>→</span></a>
            </div>
          </div>
        </section>

        <section className="section projects" id="project-grid">
          <div className="projects-head">
            <div>
              <p className="eyebrow">Selected works</p>
              <h2 className="section-heading">Explore</h2>
            </div>
            <a className="text-link" href="#">All projects <span>→</span></a>
          </div>
          <div className="project-grid">
            <article className="project-card">
              <Image src="/images/project2.jpg" alt="Aurelia courtyard residence" fill sizes="60vw" />
              <div className="project-info"><div><h3>Courtyard House</h3><span>Residential · 2025</span></div><span>01</span></div>
            </article>
            <article className="project-card small">
              <Image src="/images/project3.jpg" alt="Aurelia lakeside apartments" fill sizes="40vw" />
              <div className="project-info"><div><h3>North Ridge</h3><span>Residential · 2024</span></div><span>02</span></div>
            </article>
          </div>
        </section>

        <section className="section businesses" id="businesses">
          <div className="businesses-head">
            <h2 className="section-heading">Businesses</h2>
            <a className="text-link" href="#">Discover <span>→</span></a>
          </div>
          <div className="business-grid">
            <article className="business-card"><Image src="/images/business.jpg" alt="Aurelia workplace" fill sizes="33vw" /><h3>Property & Development</h3></article>
            <article className="business-card"><Image src="/images/about.jpg" alt="Aurelia architecture" fill sizes="33vw" /><h3>Construction</h3></article>
            <article className="business-card"><Image src="/images/project3.jpg" alt="Aurelia hospitality" fill sizes="33vw" /><h3>Hospitality</h3></article>
          </div>
        </section>

        <section className="connect" id="contact">
          <div className="connect-left">
            <p className="eyebrow">Start a conversation</p>
            <h2 className="section-heading">Let&apos;s connect.</h2>
          </div>
          <div className="connect-right">
            <article className="connect-card"><p className="eyebrow">For clients</p><h3>Find your address</h3><p>Discover residences and commercial spaces created for modern life.</p><a className="text-link" href="mailto:hello@aureliaproperties.com">Enquire <span>→</span></a></article>
            <article className="connect-card"><p className="eyebrow">For partners</p><h3>Build with us</h3><p>Explore land and investment opportunities with our development team.</p><a className="text-link" href="mailto:partners@aureliaproperties.com">Partner <span>→</span></a></article>
          </div>
        </section>
    </main>
  );
}
