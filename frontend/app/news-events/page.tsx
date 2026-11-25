import Image from 'next/image';
import Link from 'next/link';
import { news } from '../../src/data/news';
import { PageHero } from '../components/PageSections';

export default function Page() { return <><PageHero title="News & Events" eyebrow="Latest" image="/images/project1.jpg" /><section className="editorial"><div className="news-list">{news.map(article => <Link className="news-card" href={`/news-events/${article.slug}`} key={article.slug}><Image src={article.image} alt={article.title} width={700} height={420} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" /><p className="eyebrow">{article.date}</p><h2>{article.title}</h2><p>{article.summary}</p></Link>)}</div></section></>; }
