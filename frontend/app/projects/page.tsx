import { Suspense } from 'react';
import { PageHero } from '../components/PageSections';
import ProjectResults from './ProjectResults';

export default function Page() {
  return <><PageHero title="Our Projects" eyebrow="Exclusive addresses" image="/images/hero.jpg" /><Suspense fallback={<section className="editorial">Loading projects…</section>}><ProjectResults /></Suspense></>;
}
