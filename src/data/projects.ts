export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  longDescription: string
  tech: string[]
  category: 'web' | 'mobile' | 'ai'
  image: string
  images?: string[]
  github?: string
  live?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'nidaa',
    title: 'Nidaa',
    subtitle: 'Smart Blood Donation Platform',
    description:
      'Web and mobile platform connecting donors with patients — AI matching, shortage prediction, and stock transfer between hospitals.',
    longDescription:
      'Web and mobile platform connecting blood donors with patients in need. Two AI models: one to identify the best eligible donors for each request, another to predict blood shortages. Includes a transfer algorithm to redistribute excess stock between hospitals and blood banks. 2nd Prize — ESPOIR Social Innovation Competition (INPT) 2025. 3rd Place Worldwide — Huawei ICT Competition Innovation Track (2026), after winning national rounds in Morocco and competing at the Global Finals in China.',
    tech: ['React', 'Node.js', 'AI', 'Mobile', 'Firebase'],
    category: 'web',
    image: '/images/projects/nidaa.svg',
    featured: true,
  },
  {
    id: 'sovereign',
    title: 'SOVEREIGN',
    subtitle: 'Life-RPG Mobile App',
    description:
      'Cross-platform app that gamifies personal development through habits, quests, and character progression.',
    longDescription:
      'Cross-platform mobile app (React Native, TypeScript) that gamifies personal development through habits, quests, and character progression, featuring original custom artwork and a polished, immersive user experience.',
    tech: ['React Native', 'TypeScript', 'Expo'],
    category: 'mobile',
    image: '/images/projects/sovereign.svg',
    featured: true,
  },
  {
    id: 'voicefeedback',
    title: 'VoiceFeedback',
    subtitle: 'B2B SaaS Voice Analytics',
    description:
      'Collects customer voice feedback via WhatsApp, uses AI to transcribe and analyze it into actionable insights.',
    longDescription:
      'A B2B SaaS platform that collects customer voice feedback via WhatsApp, uses AI to transcribe and analyze it, and turns it into actionable insights. Features real-time dashboards, sentiment trends, urgent alerts, and automated reports in a secure, scalable, multi-tenant platform.',
    tech: ['React', 'TypeScript', 'Supabase', 'AI', 'WhatsApp API'],
    category: 'web',
    image: '/images/projects/voicefeedback.svg',
    featured: true,
  },
  {
    id: 'quran-garden',
    title: 'Quran Garden',
    subtitle: 'Gamified Quran Reading App',
    description:
      'A Quran reading app that gamifies consistency through a growing garden that evolves as you read.',
    longDescription:
      'A mobile Quran reading app that gamifies consistency through a growing garden. Features include a growing garden where plants evolve from seeds to trees, progress tracking by pages/ayahs/juz, streak system to boost garden growth, and gentle gamification with no harsh punishments.',
    tech: ['React Native', 'Expo', 'NativeWind', 'TypeScript'],
    category: 'mobile',
    image: '/images/projects/qurangarden.svg',
  },
  {
    id: 'tomobilti',
    title: 'Tomobilti',
    subtitle: 'ML Car Price Predictor',
    description:
      'Scraped Moroccan car listings, trained an ML model for price prediction, and built a responsive web app to explore results.',
    longDescription:
      'Scraped and consolidated listings from multiple Moroccan car sales websites, trained a machine learning model for price prediction, and built a responsive web app to explore and visualize results.',
    tech: ['Python', 'scikit-learn', 'Flask', 'Web Scraping'],
    category: 'ai',
    image: '/images/projects/tomobilti.svg',
  },
  {
    id: 'ecom-template',
    title: 'COD E-commerce',
    subtitle: 'Moroccan Store Template',
    description:
      'Minimal, configurable React e-commerce template for Moroccan COD stores with JSON-driven theming.',
    longDescription:
      'A minimal, configurable React e-commerce template for Moroccan COD stores. Features JSON-driven theming and products, simple checkout flow, Google Sheets order handling, no backend or database needed. Production-ready and reusable.',
    tech: ['React', 'Tailwind CSS', 'Google Sheets API', 'Vite'],
    category: 'web',
    image: '/images/projects/ecom-template.svg',
  },
  {
    id: 'ps-timeline',
    title: 'Palestine Timeline',
    subtitle: 'Interactive Data Visualization',
    description:
      'Multi-language interactive timeline visualizing historical data with engaging animations.',
    longDescription:
      'An interactive data visualization project presenting a comprehensive timeline. Supports multiple languages (English, French, Arabic) with engaging animations and a clean, informative interface.',
    tech: ['React', 'Tailwind CSS', 'i18n', 'Data Viz'],
    category: 'web',
    image: '/images/projects/ps-timeline.svg',
  },
  {
    id: 'emec-expo',
    title: 'EMEC Expo System',
    subtitle: 'Visitor Management & Wheel of Fortune',
    description:
      'Production-ready visitor management system with interactive wheel of fortune, QR codes, and automated PDF labels.',
    longDescription:
      'A comprehensive, production-ready visitor management system integrated with an interactive wheel of fortune. Built for the EMEC Expo 2025. Features dual-mode database support (Supabase or local JSON), automated PDF label generation, email notifications with promo codes, real-time updates via Socket.IO, QR code scanning, employee validation interface, and atomic single-use promo code distribution.',
    tech: ['React', 'Node.js', 'Socket.IO', 'Supabase', 'SendGrid', 'QR Code'],
    category: 'web',
    image: '/images/projects/emec-expo.svg',
    featured: true,
  },
]
