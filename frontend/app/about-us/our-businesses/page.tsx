import Image from 'next/image';
import { Suspense } from 'react';
import { businesses } from '../../../src/data/businesses';
import { PageHero } from '../../components/PageSections';
import BusinessFilter from './BusinessFilter';

export default function Page() {
  return <><PageHero title="Our Businesses" eyebrow="One connected group" image="/images/business.jpg" /><Suspense fallback={<section className="editorial"><p>Loading businesses…</p></section>}><BusinessFilter /></Suspense></>;
}
