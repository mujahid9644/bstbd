"use client";

import { useEffect, useRef, useState } from "react";
import useScrollState from "./useScrollState";
import { SCROLL_UI_CONFIG } from "./scroll-ui.config";

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3.5 20l1.1-4.4a8.2 8.2 0 1 1 15.6-3.9Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .6.6 1 1.4 1.8 2.5 2.3.2.1.4.1.6-.1l.8-.9c.2-.2.4-.3.7-.2l1.7.8c.3.1.4.3.4.6-.1.7-.4 1.3-.9 1.7-.5.4-1.2.5-2 .3-1-.3-2.2-.8-3.5-2-1.5-1.4-2.4-2.9-2.7-4-.2-.9-.1-1.6.4-2.2.2-.2.4-.3.7-.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UpArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 19V5m0 0L6.5 10.5M12 5l5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatsAppButton() {
  const href = `https://wa.me/${SCROLL_UI_CONFIG.whatsappPhoneNumber}?text=${encodeURIComponent(SCROLL_UI_CONFIG.whatsappDefaultMessage)}`;
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <a
      className={`scroll-ui-button whatsapp-button${entered ? " is-entered" : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
}

export function BackToTop() {
  const { y, isScrolling } = useScrollState();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const idleTimer = useRef<number | null>(null);
  const visibilityFrame = useRef<number | null>(null);

  useEffect(() => {
    if (idleTimer.current !== null) {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
    if (visibilityFrame.current !== null) {
      window.cancelAnimationFrame(visibilityFrame.current);
      visibilityFrame.current = null;
    }

    if (y < SCROLL_UI_CONFIG.backToTopThreshold) {
      visibilityFrame.current = window.requestAnimationFrame(() => {
        setVisible(false);
        visibilityFrame.current = null;
      });
      return;
    }

    if (isScrolling) {
      visibilityFrame.current = window.requestAnimationFrame(() => {
        setVisible(true);
        visibilityFrame.current = null;
      });
      return;
    }

    if (visible && !hovered && !focused) {
      idleTimer.current = window.setTimeout(() => {
        setVisible(false);
        idleTimer.current = null;
      }, SCROLL_UI_CONFIG.backToTopIdleDelay);
    }

    return () => {
      if (idleTimer.current !== null) {
        window.clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }
      if (visibilityFrame.current !== null) {
        window.cancelAnimationFrame(visibilityFrame.current);
        visibilityFrame.current = null;
      }
    };
  }, [y, isScrolling, visible, hovered, focused]);

  useEffect(
    () => () => {
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
      if (visibilityFrame.current !== null) {
        window.cancelAnimationFrame(visibilityFrame.current);
      }
    },
    [],
  );

  const scrollToTop = () => {
    if (document.documentElement.dataset.lenisActive === "true") {
      window.dispatchEvent(new CustomEvent("motion:scroll-to-top"));
      return;
    }
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`scroll-ui-button back-to-top-button${visible ? " is-visible" : " is-hidden"}`}
      onClick={scrollToTop}
      onMouseEnter={() => {
        setHovered(true);
        setVisible(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        setFocused(true);
        setVisible(true);
      }}
      onBlur={() => setFocused(false)}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <UpArrowIcon />
    </button>
  );
}

export default function ScrollAwareControls() {
  return (
    <div className="scroll-ui-controls">
      <BackToTop />
      <WhatsAppButton />
    </div>
  );
}
