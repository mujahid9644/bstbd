import Image from 'next/image';
import { team } from '../../../src/data/team';
import { PageHero } from '../../components/PageSections';

export default function Page() { return <><PageHero title="Our Team" eyebrow="People" image="/images/business.jpg" /><section className="editorial"><p className="eyebrow">Leadership</p><div className="content-grid">{team.map(member => <article className="content-card" key={member.name}><Image src={member.image} alt={member.name} width={600} height={700} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" style={{width:'100%',height:420,objectFit:'cover'}} /><h3>{member.name}</h3><p>{member.role}</p></article>)}</div></section></>; }
