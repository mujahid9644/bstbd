export type Business = { name: string; status: 'our businesses' | 'all'; image: string; summary: string };

export const businesses: Business[] = [
  { name: 'Property Development', status: 'our businesses', image: '/images/project1.jpg', summary: 'Thoughtfully planned residential and commercial addresses.' },
  { name: 'Construction', status: 'our businesses', image: '/images/about.jpg', summary: 'Quality-led construction across complex architectural programmes.' },
  { name: 'Financial Services', status: 'our businesses', image: '/images/business.jpg', summary: 'Investment and financial expertise supporting long-term growth.' },
  { name: 'Retail & Lifestyle', status: 'all', image: '/images/project3.jpg', summary: 'Distinctive retail and lifestyle experiences.' },
];
