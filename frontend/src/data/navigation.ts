export type NavigationItem = { label: string; href: string; children?: NavigationItem[] };

export const navigation: NavigationItem[] = [
  { label: 'About Us', href: '/about-us', children: [
    { label: 'Our Story', href: '/about-us/our-story' },
    { label: 'Our Businesses', href: '/about-us/our-businesses' },
    { label: 'Our Team', href: '/about-us/our-teams' },
    { label: 'Why Aurelia', href: '/about-us/why-shanta' },
  ] },
  { label: 'Services', href: '/services', children: [
    { label: 'Site Feasibility & Placement', href: '/services#site-feasibility' },
    { label: 'Master Planning & Mapping', href: '/services#master-planning' },
    { label: 'Residential & Commercial Build', href: '/services#build' },
    { label: 'Road & Infrastructure Development', href: '/services#road-infrastructure' },
    { label: 'Turnkey Execution', href: '/services#turnkey' },
  ] },
  { label: 'Projects', href: '/projects' },
  { label: 'Life at Aurelia', href: '/life-at-shanta' },
  { label: 'Careers', href: '/career' },
  { label: 'News & Events', href: '/news-events' },
  { label: 'Contact Us', href: '/contact-us' },
];
