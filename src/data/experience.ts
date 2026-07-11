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
    id: 'odoo-graduation',
    role: 'Odoo Developer (Graduation Internship)',
    company: 'Sendit',
    period: 'Jan 2026 – Jul 2026',
    description: [
      'Digitized HR, attendance, and fleet administration on Odoo 16, replacing manual Excel workflows that consumed dozens of hours monthly',
      'Delivered production modules for attendance, shift planning, and fleet management — centralizing people and fleet data in one ERP',
      'Extended payroll with employee bonus rules linked to shift and KPI data; integrated biometric and GPS telematics for automated tracking and compliance',
      'Led agile delivery from process analysis with HR and operations through staging validation to progressive production rollout',
    ],
    type: 'work',
  },
  {
    id: 'fleet-platform-freelance',
    role: 'Odoo Fleet Platform',
    company: 'Freelance',
    period: 'Mar – May 2026',
    description: [
      'Deployed Odoo 19 on a production VPS (PostgreSQL, SSL, GitHub webhook CI/CD)',
      'Built fleetcost_vehicle — fleet lifecycle module: interventions, compliance, fuel, maintenance, billing (~40 models)',
      'Five-stage repair pipeline with auto POs, service orders, and a client self-service portal',
      'Role-based access with record-level isolation per client company',
    ],
    type: 'freelance',
  },
  {
    id: 'odoo-summer',
    role: 'Odoo Developer Intern',
    company: 'Sendit',
    period: 'Summer 2025',
    description: [
      'Delivered HR-focused Odoo improvements to streamline administrative workflows and support daily people operations',
      'Contributed customizations across purchasing and other standard modules to deepen hands-on Odoo expertise',
      'Supported HR and administrative teams with practical enhancements on recurring operational use cases',
    ],
    type: 'work',
  },
  {
    id: 'emec-expo-2025',
    role: 'Full-Stack Developer — EMEC Expo 2025',
    company: 'Sendit',
    period: 'May 2025',
    description: [
      'Built a production-ready visitor management system with interactive wheel of fortune',
      'Implemented QR code scanning, automated PDF label generation, and email notifications',
      'Integrated dual-mode database (Supabase/local JSON) with real-time Socket.IO updates',
    ],
    type: 'work',
  },
  {
    id: 'huawei-ict-2026',
    role: 'Huawei ICT Global Final — Innovation Track',
    company: 'Huawei — China',
    period: '2026',
    description: [
      'Represented Morocco at the Global Finals in China after winning national and regional rounds',
      'Won 3rd Place Worldwide on the Innovation Track with the Nidaa smart blood donation platform',
    ],
    type: 'competition',
  },
  {
    id: 'huawei-ict-2025',
    role: 'Huawei ICT Global Final — Cloud Track',
    company: 'Huawei — China',
    period: '2025',
    description: [
      'Represented Morocco at the Global Finals in China after qualifying through national and regional rounds',
      'Won 3rd Place Worldwide on the Cloud Track',
      'Deployed and secured cloud infrastructure on Huawei Cloud, prepared datasets, and trained an image classification model under live constraints',
    ],
    type: 'competition',
  },
  {
    id: 'web-freelance',
    role: 'Freelance Web Developer',
    company: 'Various Clients',
    period: 'Summer 2024',
    description: [
      'Developed landing pages and e-commerce websites using ReactJS and Tailwind CSS',
      'Delivered functional, user-friendly solutions tailored to client needs',
    ],
    type: 'freelance',
  },
  {
    id: 'data-analyst',
    role: 'Data Analyst',
    company: 'Sendit',
    period: 'Aug 2023',
    description: [
      'Cleaned and structured delivery data for operational reporting',
      'Built interactive dashboards using Power BI',
    ],
    type: 'work',
  },
]
