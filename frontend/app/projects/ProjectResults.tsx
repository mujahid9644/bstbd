"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { projects } from "../../src/data/projects";

export default function ProjectResults() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const filteredProjects = projects.filter((project) =>
    `${project.title} ${project.location} ${project.status}`
      .toLowerCase()
      .includes(search),
  );

  return (
    <section className="editorial">
      {search && <p className="eyebrow">Search results for “{search}”</p>}
      {filteredProjects.length > 0 ? (
        <div className="listing-grid">
          {filteredProjects.map((project) => (
            <Link
              className="listing-card"
              href={`/projects/${project.slug}`}
              key={project.slug}
            >
              <Image src={project.image} alt={project.title} fill sizes="(max-width: 767px) 100vw, 50vw" />
              <div className="listing-card-content">
                <p className="eyebrow">{project.status}</p>
                <h2>{project.title}</h2>
                <p>{project.location}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No projects matched your search. Try another name or location.</p>
      )}
    </section>
  );
}
