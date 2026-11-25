import Link from 'next/link';
import { careers } from '../../src/data/careers';
import { PageHero } from '../components/PageSections';

export default function Page() { return <><PageHero title="Careers" eyebrow="Build what comes next" image="/images/business.jpg" /><section className="editorial"><div className="content-grid">{careers.map(job => <article className="content-card" key={job.slug}><p className="eyebrow">{job.department}</p><h3>{job.title}</h3><p>{job.location} · {job.type}</p><Link className="text-link" href={`/career/${job.slug}`}>View position →</Link></article>)}</div></section></>; }
