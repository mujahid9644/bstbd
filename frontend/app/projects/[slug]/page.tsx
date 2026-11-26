import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '../../../src/data/projects';
import { contactInfo } from '../../../src/data/contact-info';

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const related = projects.filter(item => item.slug !== slug).slice(0, 3);
  return <><section className="inner-hero"><Image src={project.image} alt={project.title} fill priority sizes="100vw" /><div className="inner-hero-content"><p className="eyebrow">{project.status} · {project.location}</p><h1>{project.title}</h1></div></section><section className="editorial"><div className="detail-layout"><div className="detail-copy"><p className="eyebrow">Overview</p><h2>A considered address.</h2><p>{project.description}</p><a className="text-link" href={`mailto:${contactInfo.email}`}>Make an enquiry →</a></div><Image src={project.image} alt={`${project.title} exterior`} width={900} height={1100} sizes="(max-width: 767px) 100vw, 50vw" /></div></section><section className="editorial"><p className="eyebrow">Related projects</p><div className="listing-grid">{related.map(item => <Link className="listing-card" href={`/projects/${item.slug}`} key={item.slug}><Image src={item.image} alt={item.title} fill sizes="(max-width: 767px) 100vw, 50vw" /><div className="listing-card-content"><h2>{item.title}</h2><p>{item.location}</p></div></Link>)}</div></section></>;
}
