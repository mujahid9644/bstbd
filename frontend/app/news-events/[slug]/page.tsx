import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { news } from '../../../src/data/news';

export function generateStaticParams() { return news.map(article => ({ slug: article.slug })); }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = news.find(item => item.slug === slug);
  if (!article) notFound();
  const related = news.filter(item => item.slug !== slug).slice(0, 3);
  return <><PageArticleHero title={article.title} date={article.date} image={article.image} /><article className="editorial"><div className="editorial-grid"><div><p className="eyebrow">{article.date}</p><h2>{article.title}</h2></div><div><p>{article.summary}</p><p>Aurelia continues to invest in design quality, trusted partnerships and the responsible growth of modern urban places. This feature reflects the thinking, people and projects behind that commitment.</p></div></div></article><section className="editorial"><p className="eyebrow">More news</p><div className="news-list">{related.map(item => <Link className="news-card" href={`/news-events/${item.slug}`} key={item.slug}><Image src={item.image} alt={item.title} width={700} height={420} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" /><h2>{item.title}</h2></Link>)}</div></section></>;
}

function PageArticleHero({title,date,image}:{title:string,date:string,image:string}) { return <section className="inner-hero"><Image src={image} alt={title} fill priority sizes="100vw" /><div className="inner-hero-content"><p className="eyebrow">{date}</p><h1>{title}</h1></div></section>; }
