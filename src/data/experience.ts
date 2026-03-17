export interface Experience {
  id: string
  role: string
  company: string
  period: string
  description: string[]
  type: 'work' | 'freelance' | 'competition'
}

export const experiences: Experience[] = [
  {
    id: 'odoo-dev',
    role: 'Odoo Developer Intern',
    company: 'Sendit.ma',
    period: 'Jul 2025 – Present',
    description: [
      'Automated HR and administrative workflows via custom Odoo v16 modules',
      'Extended existing modules and optimized them for performance',
      'Developed new management modules from scratch',
    ],
    type: 'work',
  },
  {
    id: 'emec-expo-2025',
    role: 'Full-Stack Developer — EMEC Expo 2025',
    company: 'Sendit.ma',
    period: 'May 2025',
    description: [
      'Built a production-ready visitor management system with interactive wheel of fortune',
      'Implemented QR code scanning, automated PDF label generation, and email notifications',
      'Integrated dual-mode database (Supabase/local JSON) with real-time Socket.IO updates',
      'Developed atomic single-use promo code distribution and employee validation interface',
    ],
    type: 'work',
  },
  {
    id: 'power-automate',
    role: 'Freelance Automation Developer',
    company: 'Sendit / EMEC Expo 2024',
    period: 'Nov 2024',
    description: [
      'Supported Sendit during EMEC Expo 2024 with client automation solutions',
      'Automated customer creation workflows using Power Automate',
      'Built interactive games for lead engagement at the expo',
    ],
    type: 'freelance',
  },
  {
    id: 'huawei-ict',
    role: 'Huawei ICT Global Final',
    company: 'Huawei — China',
    period: 'Jun 2024',
    description: [
      'Represented Morocco in the Cloud Track global finals',
      'Won 3rd Place Worldwide',
      'Competed against top teams from around the globe',
    ],
    type: 'competition',
  },
  {
    id: 'web-freelance',
    role: 'Freelance Web Developer',
    company: 'Various Clients',
    period: 'Summer 2024',
    description: [
      'Built modern landing pages and e-commerce sites with ReactJS & Tailwind CSS',
      'Delivered responsive, production-ready websites for small companies',
    ],
    type: 'freelance',
  },
  {
    id: 'data-analyst',
    role: 'Data Analyst Intern',
    company: 'Sendit.ma',
    period: 'Aug 2023',
    description: [
      'Cleaned, analyzed, and visualized delivery data using Power BI',
      'Delivered reports for better logistics and performance tracking',
    ],
    type: 'work',
  },
]
