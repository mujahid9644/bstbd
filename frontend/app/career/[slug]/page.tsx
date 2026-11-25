import { notFound } from 'next/navigation';
import { careers } from '../../../src/data/careers';

export function generateStaticParams() { return careers.map(job => ({ slug: job.slug })); }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = careers.find(item => item.slug === slug);
  if (!job) notFound();
  return <><section className="inner-hero" style={{background:'#53645a',height:520}}><div className="inner-hero-content"><p className="eyebrow">{job.department} · {job.location}</p><h1>{job.title}</h1></div></section><section className="editorial"><div className="editorial-grid"><div><p className="eyebrow">Position details</p><h2>{job.type}</h2></div><div><h3>Responsibilities</h3><p>Build and maintain strong customer relationships, support sales activities, prepare reports and coordinate across project and operations teams.</p><h3>Requirements</h3><p>Relevant experience in real estate or customer-facing sales, strong communication skills and a service-led professional approach.</p><button className="text-link" type="button">Apply now →</button></div></div></section></>;
}
