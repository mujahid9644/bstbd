"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  Clock,
  Compass,
  Copy,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import gsap from "gsap";
import { contactInfo } from "../../src/data/contact-info";
import {
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_LAYOUT,
  MOTION_STAGGER,
} from "../motion/motion.config";
import { registerMotionPlugins } from "../motion/registerMotionPlugins";

const coordinatesQuery =
  `${contactInfo.coordinates.lat},${contactInfo.coordinates.lng}`;

type CopyTarget = "Phone number" | "Address";

export default function ContactExperience() {
  const experienceRef = useRef<HTMLDivElement>(null);
  const [copyFeedback, setCopyFeedback] = useState<{
    target: CopyTarget;
    message: string;
  } | null>(null);

  useLayoutEffect(() => {
    const experience = experienceRef.current;
    if (
      !experience ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    registerMotionPlugins();
    const cards = experience.querySelectorAll(".contact-card");
    const context = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: MOTION_DURATION.section,
          stagger: MOTION_STAGGER.grid,
          ease: MOTION_EASE.entrance,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: experience,
            start: MOTION_LAYOUT.scrollStart,
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }, experience);

    return () => context.revert();
  }, []);

  const copyToClipboard = async (value: string, label: CopyTarget) => {
    setCopyFeedback({ target: label, message: "" });
    if (!navigator.clipboard?.writeText) {
      setCopyFeedback({
        target: label,
        message: "Clipboard access is unavailable in this browser.",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback({ target: label, message: `${label} copied.` });
    } catch {
      setCopyFeedback({
        target: label,
        message: `Could not copy ${label.toLowerCase()}. Please copy it manually.`,
      });
    }
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinatesQuery}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinatesQuery}`;

  return (
    <div className="contact-experience" ref={experienceRef}>
      <div className="contact-card-grid">
        <article className="contact-card quick-call-card" aria-labelledby="quick-call-title">
          <div className="contact-card-heading">
            <Phone size={22} strokeWidth={1.6} aria-hidden="true" />
            <h3 id="quick-call-title">Quick Call</h3>
          </div>
          <span className="office-status is-open" role="status" aria-live="polite">
            <span className="office-status-dot" aria-hidden="true" />
            Available 24/7
          </span>
          <a
            className="contact-phone"
            href={`tel:${contactInfo.phone}`}
            data-cursor="link"
            aria-label={`Call ${contactInfo.companyName} at ${contactInfo.phone}`}
          >
            {contactInfo.phoneDisplay}
          </a>
          <p className="contact-card-copy">Call our team any time. We’re available around the clock.</p>
          <div className="contact-action-row">
            <a className="text-link contact-action" href={`tel:${contactInfo.phone}`} data-cursor="link">
              <Phone size={15} aria-hidden="true" /> Call Now
            </a>
            <button
              className="text-link contact-action contact-copy-action"
              type="button"
              data-cursor="link"
              aria-label="Copy phone number"
              onClick={() => void copyToClipboard(contactInfo.phoneDisplay, "Phone number")}
            >
              <Copy size={15} aria-hidden="true" />
              {copyFeedback?.target === "Phone number" &&
              copyFeedback.message === "Phone number copied."
                ? "Copied"
                : "Copy number"}
            </button>
          </div>
          <a
            className="text-link contact-action contact-whatsapp"
            href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(contactInfo.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
          >
            <MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp
          </a>
          <a className="contact-email" href={`mailto:${contactInfo.email}`} data-cursor="link">
            {contactInfo.email}
          </a>
          {copyFeedback?.target === "Phone number" && copyFeedback.message && (
            <p className="contact-feedback" role="status">{copyFeedback.message}</p>
          )}
        </article>

        <article className="contact-card visit-card" aria-labelledby="visit-us-title">
          <div className="contact-card-heading">
            <MapPin size={22} strokeWidth={1.6} aria-hidden="true" />
            <h3 id="visit-us-title">Visit Us</h3>
          </div>
          <div className="contact-map-frame">
            <iframe
              src={`https://www.google.com/maps?q=${coordinatesQuery}&z=15&output=embed`}
              title={`Map showing ${contactInfo.companyName} in Badda, Dhaka`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="contact-address">{contactInfo.address}</p>
          <button
            className="text-link contact-action contact-copy-action"
            type="button"
            data-cursor="link"
            aria-label="Copy office address"
            onClick={() => void copyToClipboard(contactInfo.address, "Address")}
          >
            <Copy size={15} aria-hidden="true" />
            {copyFeedback?.target === "Address" &&
            copyFeedback.message === "Address copied."
              ? "Copied"
              : "Copy address"}
          </button>
          {copyFeedback?.target === "Address" && copyFeedback.message && (
            <p className="contact-feedback" role="status">{copyFeedback.message}</p>
          )}
          <div className="office-hours">
            <p className="eyebrow">Availability</p>
            <p>{contactInfo.hours.display}</p>
          </div>
          <div className="contact-action-row">
            <a className="text-link contact-action" href={directionsUrl} target="_blank" rel="noopener noreferrer" data-cursor="link">
              <Navigation size={15} aria-hidden="true" /> Get Directions
            </a>
            <a className="text-link contact-action" href={mapsUrl} target="_blank" rel="noopener noreferrer" data-cursor="link">
              <MapPin size={15} aria-hidden="true" /> Open in Google Maps
            </a>
          </div>
        </article>

      </div>

      <ul className="contact-trust-strip" aria-label="Our service commitments">
        <li><Clock size={18} aria-hidden="true" /><span>Response within 30 minutes</span></li>
        <li><Compass size={18} aria-hidden="true" /><span>Free initial site consultation</span></li>
        <li><MapPin size={18} aria-hidden="true" /><span>Serving Dhaka & nearby areas</span></li>
      </ul>

      <nav className="contact-mobile-bar" aria-label="Quick contact actions">
        <a href={`tel:${contactInfo.phone}`} data-cursor="link">
          <Phone size={17} aria-hidden="true" /> Call
        </a>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" data-cursor="link">
          <Navigation size={17} aria-hidden="true" /> Directions
        </a>
      </nav>
    </div>
  );
}
