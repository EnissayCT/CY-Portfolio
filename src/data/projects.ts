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
  layout?: 'default' | 'portrait-showcase'
  github?: string
  live?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'nidaa',
    title: 'Nidaa',
    subtitle: 'Online Blood Donation Platform',
    description:
      'A platform connecting patients, hospitals, and donors with automated alerts based on eligibility and proximity.',
    longDescription:
      'Built a comprehensive blood donation platform that connects patients, hospitals, and donors. Features automated alerts based on eligibility and proximity, intelligent donor matching, and real-time notifications. Won 1st Prize at Huawei ICT global competition, 2nd Prize at the ESPOIR Social Innovation Competition (INPT), and secured a temporary incubation spot at the ADD.',
    tech: ['React', 'Node.js', 'AI', 'Firebase'],
    category: 'web',
    image: '/images/projects/nidaa.png',
    images: [
      '/images/projects/nidaa-1.png',
      '/images/projects/nidaa-2.png',
      '/images/projects/nidaa-3.png',
      '/images/projects/nidaa-4.png',
    ],
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
    layout: 'portrait-showcase',
    featured: true,
  },
  {
    id: 'sovereign',
    title: 'SOVEREIGN',
    subtitle: 'Self-Mastery RPG Habit Tracker',
    description:
      'A gamified personal growth app that turns real-life actions, quests, and streaks into character progression through domains, stats, and a living skill tree.',
    longDescription:
      'SOVEREIGN is a mobile self-improvement RPG designed to make discipline feel tangible. Real-world actions are logged as deeds across domains like mind, body, soul, wealth, relationships, and craft, then converted into XP, stat growth, streaks, quests, relics, and unlockable skill-tree progression. The app includes onboarding, class-based character identity, mentor guidance, journal and quest systems, shareable character sheets, haptics, sound design, and a polished fantasy-inspired presentation that makes habit building feel like playing a meaningful long-term campaign.',
    tech: ['React Native', 'Expo Router', 'TypeScript', 'Zustand', 'Reanimated'],
    category: 'mobile',
    image: '/images/projects/Sovereign.png',
    images: [
      '/images/projects/Sovereign (6).jpeg',
      '/images/projects/Sovereign (1).jpeg',
      '/images/projects/Sovereign (2).jpeg',
      '/images/projects/Sovereign (3).jpeg',
      '/images/projects/Sovereign (4).jpeg',
      '/images/projects/Sovereign (5).jpeg',
      
    ],
    featured: true,
  },
  {
    id: 'farmmanager',
    title: 'FarmManager',
    subtitle: 'Livestock Operations Management App',
    description:
      'A mobile farm operations app for managing animals, feeding, breeding, medical care, production, finance, tasks, and exports from a single dashboard.',
    longDescription:
      'FarmManager is a practical livestock management app built for day-to-day farm operations. It centralizes herd records, breeding workflows, feed stock tracking, medical history, vaccinations, production logs, expenses, tasks, notes, and calendar planning inside a structured mobile interface. The app also supports multilingual usage, local persistence with SQLite, dashboard analytics, CSV/JSON export, and utility flows like bulk animal entry and customizable settings lists, making it useful both as an operational tracker and as a lightweight farm back-office tool on mobile.',
    tech: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'React Navigation'],
    category: 'mobile',
    image: '/images/projects/FarmManager.png',
    images: [
      '/images/projects/FarmManager (1).jpeg',
      '/images/projects/FarmManager (2).jpeg',
      '/images/projects/FarmManager (3).jpeg',
      '/images/projects/FarmManager (4).jpeg',
      '/images/projects/FarmManager (5).jpeg',
      '/images/projects/FarmManager (6).jpeg',
      '/images/projects/FarmManager (7).jpeg',
    ],
  },
  {
    id: 'tomobilti',
    title: 'Tomobilti',
    subtitle: 'ML Car Price Predictor',
    description:
      'Accurately evaluates used Moroccan car prices using an ML model trained on scraped data from multiple websites.',
    longDescription:
      'A website that accurately evaluates the price of a used Moroccan car. Uses an ML model trained on pre-existing data scraped from multiple Moroccan websites. Features a responsive web interface for easy price prediction.',
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
