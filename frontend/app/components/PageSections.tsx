import Image from "next/image";

export function PageHero({ title, eyebrow, image = '/images/hero.jpg' }: { title: string; eyebrow?: string; image?: string }) {
  return <section className="inner-hero"><Image src={image} alt="" fill priority sizes="100vw" /><div className="inner-hero-content">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1></div></section>;
}

export function Editorial({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="editorial"><div className="editorial-grid"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><div><p>{copy}</p></div></div></section>;
}
