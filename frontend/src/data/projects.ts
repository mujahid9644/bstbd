export type Project = { slug: string; title: string; location: string; status: string; image: string; description: string };

export const projects: Project[] = [
  { slug: 'helix', title: 'Helix', location: 'Road 90, North Gulshan', status: 'Ongoing', image: '/images/project1.jpg', description: 'A sculptural residential address defined by light, movement and panoramic city views.' },
  { slug: 'dhaka-tower', title: 'Dhaka Tower', location: 'Tejgaon', status: 'Commercial', image: '/images/hero.jpg', description: 'A next-generation commercial tower rising above Dhaka’s business district.' },
  { slug: 'forum', title: 'Forum', location: 'Tejgaon', status: 'Commercial', image: '/images/project2.jpg', description: 'A landmark mixed-use destination with twin architectural forms.' },
  { slug: 'pinnacle', title: 'Pinnacle', location: 'Gulshan', status: 'Completed', image: '/images/project3.jpg', description: 'A dramatic forty-storey expression of contemporary urban living.' },
  { slug: 'oasis', title: 'Oasis', location: 'Bashundhara R/A', status: 'Residential', image: '/images/about.jpg', description: 'Lake-adjacent residences designed for calm, greenery and family life.' },
  { slug: 'auberge', title: 'Auberge', location: 'Dhaka', status: 'Hospitality', image: '/images/business.jpg', description: 'A refined hospitality address shaped around memorable stays.' },
  { slug: 'orchard', title: 'Orchard', location: 'Dhaka', status: 'Residential', image: '/images/project2.jpg', description: 'Contemporary homes arranged around planted courtyards.' },
  { slug: 'garden', title: 'Garden', location: 'Dhaka', status: 'Residential', image: '/images/project3.jpg', description: 'A garden-centred residential community with generous shared spaces.' },
  { slug: 'olympus', title: 'Olympus', location: 'North Gulshan', status: 'Residential', image: '/images/hero.jpg', description: 'A prestigious private address in one of Dhaka’s established districts.' },
];
