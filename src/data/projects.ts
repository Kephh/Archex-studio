export type ProjectStatus = 'live' | 'upcoming';
export type ProjectClassification = 'concept' | 'in-house' | 'client';

export interface ProjectCaseStudy {
  challenge: string;
  solution: string;
  creativeDirection: string;
  typography: string;
  palette: Array<{ name: string; hex: string; note: string }>;
  deliverables: string[];
  keyInteractions: string[];
  outcome: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  classification: ProjectClassification;
  classificationLabel: string;
  label: string;
  category: string;
  route: string;
  externalUrl?: string;
  indexable: boolean;
  summary: string;
  disciplines: string[];
  deliverables: string[];
  caseStudy: ProjectCaseStudy;
}

export const projects: Project[] = [
  {
    id: 'aera',
    title: 'AÉRA',
    subtitle: 'Studio of Interior Architecture',
    status: 'live',
    classification: 'concept',
    classificationLabel: 'CONCEPT',
    label: '01 / Interior Architecture',
    category: 'Spatial Design & Architecture',
    route: '/aera/',
    externalUrl: 'https://aero-demo-rho.vercel.app/',
    indexable: true,
    summary:
      'Brand identity, typography hierarchy, and an editorial, photography-led digital experience for a studio of interior architecture specializing in residential, boutique hospitality, and commercial spaces.',
    disciplines: ['Brand Strategy', 'Editorial Design', 'UI/UX Design', 'Art Direction'],
    deliverables: [
      'Visual Identity & Monogram',
      'Editorial Grid & Typography',
      'Desktop & Mobile Portfolio UI',
      'Spatial Storytelling System',
    ],
    caseStudy: {
      challenge:
        'Interior architecture is experienced through texture, natural light, and spatial volume. Most studio portfolios flatten these qualities into generic image grids that fail to communicate the tactile sensitivity of physical spaces.',
      solution:
        'We shaped an editorial, exhibition-inspired digital portfolio that treats the screen as an architectural gallery. Using restrained serif typography, warm limestone and carbon tones, asymmetrical photographic pairings, and generous negative space, the interface gives each project room to breathe.',
      creativeDirection:
        'Refined architectural restraint. Warm mineral backgrounds (#EFECE6) paired with deep carbon typography (#161616) and subtle terracotta accents, evoking natural stone, untreated oak, and architectural blueprints.',
      typography: 'Playfair Display (Serif) + Instrument Sans (Contemporary Editorial Sans)',
      palette: [
        { name: 'Limestone', hex: '#EFECE6', note: 'Primary spatial background' },
        { name: 'Carbon Ink', hex: '#161616', note: 'Editorial headlines & typography' },
        { name: 'Warm Travertine', hex: '#E3DFD5', note: 'Structural panels & borders' },
        { name: 'Terracotta', hex: '#9C3E2F', note: 'Signal accent & coordinates' },
      ],
      deliverables: [
        'Complete brand identity & spatial monogram',
        'Custom 12-column editorial layout system',
        'Interactive project gallery with spatial metadata',
        'Responsive mobile experience optimized for touch',
      ],
      keyInteractions: [
        'Fluid crossfade transitions between architectural projects',
        'Cursor-responsive project gallery with subtle magnetic depth',
        'Expanding drawing sheet drawer for project blueprints and floor plans',
        'Adaptive light-weight navigation bar with smooth blur backdrop',
      ],
      outcome:
        'A digital flagship that positions the studio alongside leading global architectural practices, elevating work presentation and establishing an immediate impression of spatial mastery.',
    },
  },
  {
    id: 'morrow-cafe',
    title: 'Morrow Café',
    subtitle: 'Coffee, Kitchen & Slow Moments',
    status: 'live',
    classification: 'concept',
    classificationLabel: 'CONCEPT',
    label: '02 / Hospitality & Café',
    category: 'Hospitality & Lifestyle',
    route: '/morrow-cafe/',
    externalUrl: 'https://morrow-cafe-iota.vercel.app/',
    indexable: true,
    summary:
      'Warm visual identity, menu storytelling, and a calm, lifestyle-driven digital presence for a specialty coffee house and seasonal kitchen designed for slower mornings.',
    disciplines: ['Visual Identity', 'Menu Direction', 'Digital Experience', 'Packaging'],
    deliverables: [
      'Tactile Visual Identity',
      'Culinary Menu UI & Hierarchy',
      'Operating Telemetry System',
      'Lifestyle Art Direction',
    ],
    caseStudy: {
      challenge:
        'Specialty coffee establishments often struggle between sterile third-wave minimalism and clichéd rustic tropes. Morrow needed an authentic digital presence that captured the sensory calm of early mornings, artisanal roasting, and unhurried conversation.',
      solution:
        'We developed a sensory, warm identity system and web presence grounded in earthy parchment tones, warm espresso browns, and tactile editorial typography. Live operating telemetry informs patrons of daily roasts, kitchen hours, and table availability in real time.',
      creativeDirection:
        'Tactile warmth and slow living. Cream parchment (#F7F4EE) combined with roasted espresso (#2A1F1D) and matcha herb (#6B705C), creating an inviting, unhurried morning atmosphere.',
      typography: 'Fraunces (Warm Soft Serif) + Outfit (Modern Clean Sans)',
      palette: [
        { name: 'Parchment Milk', hex: '#F7F4EE', note: 'Warm ambient canvas' },
        { name: 'Roasted Espresso', hex: '#2A1F1D', note: 'Primary branding & type' },
        { name: 'Oat Warmth', hex: '#EDE7DC', note: 'Menu card surfaces' },
        { name: 'Amber Roast', hex: '#C67D5A', note: 'Signal tags & active roasts' },
      ],
      deliverables: [
        'Tactile logo system with roast stamp emblem',
        'Interactive seasonal menu with dietary filtering',
        'Live café telemetry (hours, busy status, current beans)',
        'Takeaway cup, bean pouch, and menu sleeve packaging guidelines',
      ],
      keyInteractions: [
        'Interactive culinary menu with filterable origin notes and tasting profiles',
        'Dynamic daytime atmosphere shift mirroring café ambient lighting',
        'One-touch table reservation and seasonal workshop enquiry flow',
        'Smooth scroll storytelling through bean sourcing and kitchen practices',
      ],
      outcome:
        'A cohesive hospitality brand experience that increased pre-visit engagement, clarified dietary options, and positioned Morrow as a beloved neighborhood ritual.',
    },
  },
  {
    id: 'baked-and-crust',
    title: 'Baked & Crust',
    subtitle: 'Artisan Bakery & Custom Cakes in Kolkata',
    status: 'live',
    classification: 'concept',
    classificationLabel: 'CONCEPT',
    label: '03 / Artisan Bakery',
    category: 'Food, Patisserie & Gifting',
    route: '/baked-and-crust/',
    externalUrl: 'https://baked-n-crust.vercel.app/',
    indexable: true,
    summary:
      'Visual identity, custom confectionary showcase, and storefront digital ordering experience for a modern artisan bakery crafting celebration cakes and handcrafted bakes in Kolkata.',
    disciplines: ['Brand Identity', 'Storefront UI/UX', 'Digital Menu', 'Art Direction'],
    deliverables: [
      'Artisan Bakery Identity',
      'E-commerce Storefront UI',
      'Custom Cake Builder Flow',
      'Gifting & Packaging Direction',
    ],
    caseStudy: {
      challenge:
        'Custom artisanal baking involves complex customer requirements: bespoke flavor tiers, celebration themes, dietary adaptations, and strict delivery timing. Traditional retail sites fail to balance gourmet artistry with an intuitive consultation workflow.',
      solution:
        'We designed a mouth-watering visual identity and streamlined storefront experience that foregrounds handcrafted bakes. An intuitive cake consultation flow allows patrons to personalize cake flavors, sizes, aesthetics, and delivery schedules effortlessly.',
      creativeDirection:
        'Golden crust tones and flour dust softness. Warm flour cream (#FAF7F2) complemented by deep sourdough crust (#1F1916) and golden butter caramel (#D49B55), evoking freshly baked viennoiserie straight from the stone oven.',
      typography: 'Playfair Display + Plus Jakarta Sans',
      palette: [
        { name: 'Flour Cream', hex: '#FAF7F2', note: 'Storefront background' },
        { name: 'Crust Charcoal', hex: '#1F1916', note: 'High-contrast typography' },
        { name: 'Golden Brioche', hex: '#D49B55', note: 'Call-to-action & highlights' },
        { name: 'Rose Patisserie', hex: '#E8B4B8', note: 'Gifting & sweet accents' },
      ],
      deliverables: [
        'Artisan bakery seal and packaging typography',
        'Responsive confectionary product catalogue with multi-angle photography',
        'Custom celebration cake consultation and ordering builder',
        'Packaging sleeve, delivery box, and celebration ribbon system',
      ],
      keyInteractions: [
        'Visual cake configuration with real-time tier and price estimation',
        'One-click quick ordering for daily fresh bakery batches',
        'Curated gifting hamper builder with personalized note preview',
        'Seamless checkout integration with local Kolkata delivery slots',
      ],
      outcome:
        'A delicious, high-converting digital storefront that elevated the bakery’s brand perception, reduced order consultation back-and-forth by 60%, and scaled celebration cake orders.',
    },
  },
  {
    id: 'archex-craft',
    title: 'Archex Craft',
    subtitle: 'Software Engineering & Digital Products',
    status: 'live',
    classification: 'in-house',
    classificationLabel: 'IN-HOUSE',
    label: '04 / Technology Practice',
    category: 'Technology & Design Systems',
    route: '/archex-craft/',
    externalUrl: 'https://craft.archexweb.in/',
    indexable: true,
    summary:
      'Complete brand identity, typography system, component specifications, and responsive design tokens for Archex Craft engineering practice.',
    disciplines: ['Brand System', 'Design Tokens', 'Interface Specs', 'Component Library'],
    deliverables: [
      'Practice Brand Architecture',
      'Token System (Design to Code)',
      'High-Density Interface Specs',
      'Component Library Guidelines',
    ],
    caseStudy: {
      challenge:
        'Engineering practices often face an identity divide: either feeling like an abstract dev agency or an uninspiring technical vendor. Archex Craft required a visual and design system that expressed engineering precision, performance, and craftsmanship in harmony with Studio.',
      solution:
        'We created a unified brand system rooted in architectural precision: dark monochrome themes, high-contrast monospace coordinates, strict 8px layout tokens, and explicit implementation specifications ready for direct build in code.',
      creativeDirection:
        'Architectural precision meets computational performance. Deep obsidian backgrounds (#0F0F0E) with surgical white type (#F5F5F3), engineering signal accents (#E24A3B), and blueprint line grids.',
      typography: 'DM Serif Display + Instrument Sans + Monospace Coordinates',
      palette: [
        { name: 'Obsidian Black', hex: '#0F0F0E', note: 'Base terminal background' },
        { name: 'Clean Chalk', hex: '#F5F5F3', note: 'Code & headline typography' },
        { name: 'Engineering Signal', hex: '#E24A3B', note: 'System metrics & states' },
        { name: 'Blueprint Grid', hex: '#262624', note: 'Component bounding lines' },
      ],
      deliverables: [
        'Dual-practice brand alignment with Archex Studio',
        'Cross-platform design token pipeline (JSON, CSS custom properties)',
        'Exhaustive component library specs with interactive states',
        'Design-to-code governance principles and documentation',
      ],
      keyInteractions: [
        'Interactive token inspector demonstrating color and spacing variables',
        'Live breakpoint tester revealing fluid responsive container adaptations',
        'Synchronized navigation between Studio design and Craft production',
        'High-density technical specimen rendering for developer clarity',
      ],
      outcome:
        'A battle-tested design system implemented in production at craft.archexweb.in, eliminating design translation errors and ensuring zero visual debt during engineering.',
    },
  },
];
