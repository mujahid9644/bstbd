import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  Map,
  MapPinned,
  Route,
} from "lucide-react";
import { Editorial, PageHero } from "../components/PageSections";
import "./services.css";

export const metadata: Metadata = {
  title:
    "Building Solutions — Elevating the Urban Skyline | Strategic Land Planning & Construction",
  description:
    "Premium residential and commercial developments shaped for modern living. Strategic land planning, survey and mapping, optimal site placement, road alignment, construction, and turnkey execution.",
};

const services = [
  {
    id: "site-feasibility",
    title: "Site Feasibility & Optimal Placement",
    description:
      "Every plot has strengths and constraints. We evaluate land geometry, access, terrain, and surrounding conditions to determine the best position and orientation for a house, building, or structure so you get maximum usability, comfort, natural advantage, and long-term value.",
    icon: MapPinned,
  },
  {
    id: "master-planning",
    title: "Land Survey, Mapping & Master Planning",
    description:
      "Good projects start with accurate ground data. We handle site mapping, layout planning, and practical zoning—mapping out where structures, pathways, drainage, and open spaces should go before construction begins.",
    icon: Map,
  },
  {
    id: "build",
    title: "Residential & Building Construction",
    description:
      "Whether you are building a family home or a commercial property, we plan and execute structures tailored to how the space will actually be used—focusing on smart spatial positioning, structural quality, and everyday convenience.",
    icon: Building2,
  },
  {
    id: "road-infrastructure",
    title: "Road Alignment & Infrastructure Planning",
    description:
      "A poorly placed road creates bottlenecks and wasted space. We plan and execute road routes, access ways, and supporting site infrastructure in the right locations to ensure smooth connectivity, practical land use, and lasting durability.",
    icon: Route,
  },
  {
    id: "turnkey",
    title: "End-to-End Turnkey Execution",
    description:
      "From initial site assessment and mapping to final handover, we manage the full workflow under one roof. You get clear planning, coordinated execution, and a finished result without juggling disconnected vendors.",
    icon: ClipboardCheck,
  },
] as const;

const processSteps = [
  "Site Assessment",
  "Mapping & Planning",
  "Construction/Execution",
  "Handover",
];

export default function ServicesPage() {
  return (
    <main className="services-page">
      <PageHero
        title="Our Services"
        eyebrow="Planning to handover"
        image="/images/business.jpg"
      />
      <Editorial
        eyebrow="Strategic land services"
        title="Strategic Land Planning, Optimal Placement & End-to-End Execution"
        copy="We help property owners, developers, and communities make smarter construction decisions before breaking ground. From identifying the most advantageous building or road placement to handling complete mapping, planning, and execution, we turn raw land and concepts into high-value, practical assets."
      />

      <section className="section services-catalog" aria-label="Our services">
        <p className="eyebrow">Our services</p>
        <div className="services-grid">
          {services.map(({ id, title, description, icon: Icon }) => (
            <article
              className="content-card service-card"
              id={id}
              key={id}
              aria-labelledby={`${id}-title`}
            >
              <Icon
                className="service-icon"
                size={32}
                strokeWidth={1.5}
                aria-hidden="true"
                focusable="false"
              />
              <h2 id={`${id}-title`}>{title}</h2>
              <p>{description}</p>
              <Link className="text-link" href="/contact-us">
                Get a Quote <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section services-process"
        aria-labelledby="services-process-title"
      >
        <p className="eyebrow">Our approach</p>
        <h2 className="section-heading" id="services-process-title">
          How we work
        </h2>
        <ol className="services-process-steps">
          {processSteps.map((step) => (
            <li className="content-card" key={step}>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section
        className="connect-left services-cta"
        aria-labelledby="services-cta-title"
      >
        <div>
          <p className="eyebrow">Start with the right plan</p>
          <h2 className="section-heading" id="services-cta-title">
            Ready to build in the right place? Talk to us before you break
            ground.
          </h2>
        </div>
        <Link className="text-link" href="/contact-us">
          Contact Us <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
