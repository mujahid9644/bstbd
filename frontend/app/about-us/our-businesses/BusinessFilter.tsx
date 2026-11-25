"use client";

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { businesses } from '../../../src/data/businesses';

export default function BusinessFilter() {
  const params = useSearchParams();
  const status = params.get('status')?.toLowerCase() || 'our businesses';
  const visible = status === 'all' ? businesses : businesses.filter(item => item.status === 'our businesses');
  return <section className="editorial"><div style={{display:'flex',gap:12,marginBottom:48}}><a className="text-link" href="/about-us/our-businesses?status=our%20businesses">Our businesses</a><a className="text-link" href="/about-us/our-businesses?status=all">All businesses</a></div><div className="listing-grid">{visible.map(item => <article className="listing-card" key={item.name}><Image src={item.image} alt={item.name} fill sizes="(max-width: 767px) 100vw, 50vw" /><div className="listing-card-content"><p className="eyebrow">Aurelia group</p><h2>{item.name}</h2><p>{item.summary}</p></div></article>)}</div></section>;
}
