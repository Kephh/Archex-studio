export type ProjectStatus = 'live' | 'upcoming';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  label: string;
  category: string;
  route: string | null;
  externalUrl?: string;
  indexable: boolean;
  summary: string;
  disciplines: string[];
}

export const projects: Project[] = [
  {
    id: 'aera',
    title: 'AÉRA',
    subtitle: 'Studio of Interior Architecture',
    status: 'live',
    label: '01 / Interior Architecture',
    category: 'Spatial Design & Architecture',
    route: null,
    externalUrl: 'https://aero-demo-rho.vercel.app/',
    indexable: true,
    summary:
      'Brand identity, typography hierarchy, and an editorial, photography-led digital experience for a studio of interior architecture specializing in residential, boutique hospitality, and commercial spaces.',
    disciplines: ['Brand Strategy', 'Editorial Design', 'UI/UX Design', 'Art Direction'],
  },
  {
    id: 'morrow-cafe',
    title: 'Morrow Café',
    subtitle: 'Coffee, Kitchen & Slow Moments',
    status: 'live',
    label: '02 / Hospitality & Café',
    category: 'Hospitality & Lifestyle',
    route: null,
    externalUrl: 'https://morrow-cafe-iota.vercel.app/',
    indexable: true,
    summary:
      'Warm visual identity, menu storytelling, and a calm, lifestyle-driven digital presence for a specialty coffee house and seasonal kitchen designed for slower mornings.',
    disciplines: ['Visual Identity', 'Menu Direction', 'Digital Experience', 'Packaging'],
  },
  {
    id: 'baked-and-crust',
    title: 'Baked & Crust',
    subtitle: 'Artisan Bakery & Custom Cakes in Kolkata',
    status: 'live',
    label: '03 / Artisan Bakery',
    category: 'Food, Patisserie & Gifting',
    route: null,
    externalUrl: 'https://baked-n-crust.vercel.app/',
    indexable: true,
    summary:
      'Visual identity, custom confectionary showcase, and storefront digital ordering experience for a modern artisan bakery crafting celebration cakes and handcrafted bakes in Kolkata.',
    disciplines: ['Brand Identity', 'Storefront UI/UX', 'Digital Menu', 'Art Direction'],
  },
  {
    id: 'archex-craft',
    title: 'Archex Craft',
    subtitle: 'Software Engineering & Digital Products',
    status: 'live',
    label: '04 / Technology Practice',
    category: 'Technology & Design Systems',
    route: '/archex-craft/',
    externalUrl: 'https://craft.archexweb.in/',
    indexable: true,
    summary:
      'Complete brand identity, typography system, component specifications, and responsive design tokens for Archex Craft engineering practice.',
    disciplines: ['Brand System', 'Design Tokens', 'Interface Specs', 'Component Library'],
  },
];
